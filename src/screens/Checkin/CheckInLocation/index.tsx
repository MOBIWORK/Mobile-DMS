import React, {useLayoutEffect, useRef, useState} from 'react';
import {AppButton, AppHeader, SvgIcon} from '../../../components/common';
import {
  ExtendedTheme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {RouterProp} from '../../../navigation/screen-type';
import Mapbox from '@rnmapbox/maps';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {LocationProps} from '../../Visit/VisitList/VisitItem';
import {KeyAbleProps} from '../../../models/types';
import {CommonUtils} from '../../../utils';
import {AppService, CheckinService} from '../../../services';
import {IUpdateAddress} from '../../../services/checkInService';
import {
  appActions,
  setProcessingStatus,
} from '../../../redux-store/app-reducer/reducer';
import {useSelector} from '../../../config/function';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {dispatch} from '../../../utils/redux';
import {GeolocationResponse} from '@react-native-community/geolocation';
import isEqual from 'react-fast-compare';
import {CheckinData} from '../../../services/appService';
import {shallowEqual} from 'react-redux';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const CheckInLocation = () => {
  const navigation = useNavigation<any>();

  const route = useRoute<RouterProp<'CHECKIN_LOCATION'>>();
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = createStyle(theme);
  const {t: getLabel} = useTranslation();

  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const customer_location: LocationProps =
    route.params?.data &&
    JSON.parse(route.params.data.item.customer_location_primary);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [value, setValue] = useState<string>(
    route.params?.data && route.params.data.item.customer_primary_address,
  );
  const mapboxCameraRef = useRef<CameraRef>(null);
  const zoomLevelRef = useRef<number>(15);

  const handleRegainLocation = () => {
    CommonUtils.getCurrentLocation(newLocation => {
      setLocation(newLocation);
      mapboxCameraRef.current &&
        mapboxCameraRef.current.moveTo(
          [newLocation.coords.longitude, newLocation.coords.latitude],
          1000,
        );
      handleMarkerMap(
        newLocation?.coords.latitude,
        newLocation?.coords.longitude,
      );
    });
  };

  const handleSearchText = async (text: string) => {
    if (text) {
      await CommonUtils.CheckNetworkState();
      const response: KeyAbleProps = await AppService.autocompleteGeoLocation(
        text,
      );
      if (response.status === ApiConstant.STT_OK || 'OK') {
        const geometry: any = response.results[0].geometry;
        setLocation({
          // @ts-ignore
          coords: {
            longitude: geometry.location.lng,
            latitude: geometry.location.lat,
          },
        });
        setValue(response.results[0].formatted_address);
      }
      // setValue(text)
    }
  };

  const handleMarkerMap = async (lat: number, lng: number) => {
    Keyboard.dismiss();
    setLocation({
      // @ts-ignore
      coords: {
        latitude: lat,
        longitude: lng,
      },
    });
    const response: KeyAbleProps = await AppService.getDetailLocation(lat, lng);
    if (response.status === ApiConstant.STT_OK || 'OK') {
      setValue(response.results[0].formatted_address);
    }
  };
console.log(value,'?????')
  const handleComplete = async () => {
    if (value !== route.params.data.item.customer_primary_address) {
      dispatch(setProcessingStatus(true));
      let newParams = route.params;
      await CommonUtils.CheckNetworkState();
      const split = value.split(',', 4);
      const params: IUpdateAddress = {
        customer: route.params.data.item.name,
        long: location?.coords.longitude ?? 0,
        lat: location?.coords.latitude ?? 0,
        address_line1: split[0] ?? '',
        state: split[1] ?? '',
        county: split[2] ?? '',
        city: split[3] ?? '',
        country: 'Việt Nam',
        checkin_id: route.params.data.checkin_id,
      };
      newParams.data.kh_diachi = params.address_line1;
      const response: any = await CheckinService.updateCustomerAddress(params);
      if (response?.status === ApiConstant.STT_OK) {
        dispatch(
          appActions.setDataCheckIn({
            ...dataCheckIn,
            item: {
              ...dataCheckIn.item,
              customer_primary_address: value,
            },
          }),
        );
        completeCheckin();
        // navigation.goBack();
        navigation.navigate({
          name: ScreenConstant.CHECKIN,
          params: {item: newParams.data, isLocation: true},
          merge: true,
        });
        // navigation.setParams({data:newParams.data,type:newParams.type})
      }
    } else {
      completeCheckin();
      navigation.goBack();
    }
    dispatch(setProcessingStatus(false));
  };

  const completeCheckin = () => {
    const newData = categoriesCheckin.map(item =>
      item.key === 'location' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
  };

  useLayoutEffect(() => {
    if (customer_location) {
      setLocation({
        // @ts-ignore
        coords: {
          longitude: customer_location.long,
          latitude: customer_location.lat,
        },
      });
      handleMarkerMap(customer_location.lat, customer_location.long);
    } else {
      CommonUtils.getCurrentLocation(locations => {
        setLocation(locations);
        handleMarkerMap(
          locations?.coords.latitude,
          locations?.coords.longitude,
        );
      });
    }
  }, []);

  return (
    <SafeAreaView style={{paddingHorizontal: 0}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        onBack={() => navigation.goBack()}
        label={getLabel('location')}
      />
      <View
        style={{
          overflow: 'hidden',
          width: '100%',
          height: AppConstant.HEIGHT,
        }}>
        <Mapbox.MapView
          onCameraChanged={state =>
            (zoomLevelRef.current = state.properties.zoom)
          }
          pitchEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          styleURL={Mapbox.StyleURL.Street}
          logoEnabled={false}
          style={{flex: 1}}
          onPress={feature =>
            handleMarkerMap(
              // @ts-ignore
              feature.geometry.coordinates[1],
              // @ts-ignore
              feature.geometry.coordinates[0],
            )
          }>
          <Mapbox.RasterSource
            id="adminmap"
            tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
            <Mapbox.RasterLayer
              id={'adminmap'}
              sourceID={'admin'}
              style={{visibility: 'visible'}}
            />
          </Mapbox.RasterSource>
          <Mapbox.Camera
            ref={mapboxCameraRef}
            centerCoordinate={[
              location?.coords.longitude ?? 0,
              location?.coords.latitude ?? 0,
            ]}
            animationMode={'flyTo'}
            animationDuration={500}
            zoomLevel={zoomLevelRef.current}
          />
          {location?.coords && (
            <Mapbox.MarkerView
              coordinate={[
                Number(location?.coords.longitude),
                Number(location?.coords.latitude),
              ]}>
              <SvgIcon source={'LocationCheckIn'} size={40} />
            </Mapbox.MarkerView>
          )}
        </Mapbox.MapView>
        <View style={styles.searchContainer}>
          <Image
            source={ImageAssets.MapPinFillIcon}
            style={{width: 24, height: 24}}
            resizeMode={'cover'}
            tintColor={theme.colors.text_secondary}
          />
          <TextInput
            style={[styles.textInput]}
            value={value}
            onChangeText={setValue}
            onSubmitEditing={e => handleSearchText(e.nativeEvent.text)}
            onBlur={() => handleSearchText(value)}
          />
        </View>
        <TouchableOpacity
          onPress={handleRegainLocation}
          style={styles.regainPosition}>
          <Image
            source={ImageAssets.MapIcon}
            style={{width: 16, height: 16}}
            resizeMode={'cover'}
            tintColor={theme.colors.bg_default}
          />
          <Text style={{color: theme.colors.bg_default, marginLeft: 4}}>
            {getLabel('currentPosition')}
          </Text>
        </TouchableOpacity>
        <View style={[styles.buttonFooter, {bottom: bottom + 80}]}>
          <AppButton label={getLabel('completed')} onPress={handleComplete} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default React.memo(CheckInLocation, isEqual);
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    searchContainer: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 12,
      marginHorizontal: 16,
      flexDirection: 'row',
      backgroundColor: theme.colors.bg_default,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      top: 20,
      position: 'absolute',
    } as ViewStyle,
    textInput: {
      color: theme.colors.text_primary,
      marginLeft: 8,
      maxWidth: '90%',
      flex: 1,
    } as TextStyle,
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 100,
      right: 0,
    } as ViewStyle,
    buttonFooter: {
      position: 'absolute',
      width: '90%',
      alignSelf: 'center',
    } as ViewStyle,
  });
