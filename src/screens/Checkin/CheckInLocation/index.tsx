import React, {useLayoutEffect, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppButton, AppHeader, SvgIcon} from '../../../components/common';
import {
  ExtendedTheme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {ApiConstant, AppConstant} from '../../../const';
import {
  Image,
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {LocationProps} from '../../Visit/VisitList/VisitItem';
import {KeyAbleProps} from '../../../models/types';
import {CommonUtils} from '../../../utils';
import {AppService} from '../../../services';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const CheckInLocation = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'CHECKIN_LOCATION'>>();
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = createStyle(theme);
  const {t: getLabel} = useTranslation();

  const customer_location: LocationProps = JSON.parse(
    route.params.data.customer_location_primary ?? '',
  );

  const [location, setLocation] = useState<Location | null>(null);
  const [value, setValue] = useState<string>(
    route.params.data.customer_primary_address ?? '',
  );
  const mapboxCameraRef = useRef<CameraRef>(null);

  const handleRegainLocation = () => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(location => {
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [location.coords.longitude, location.coords.latitude],
            1000,
          );
        setLocation(location);
      })
      .catch(e => console.log('err', e));
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
    }
  };

  const handleMarkerMap = async (lat: number, lng: number) => {
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

  const handleComplete = async () => {
    if (value !== route.params.data.customer_primary_address) {
      await CommonUtils.CheckNetworkState();
      const split = value.split(',', 4);
      console.log('split', split[5] ?? '---');
    }
  };

  useLayoutEffect(() => {
    // BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
    //   .then(location => {
    //     setLocation(location);
    //   })
    //   .catch(e => console.log('err', e));
    setLocation({
      // @ts-ignore
      coords: {
        longitude: customer_location.long,
        latitude: customer_location.lat,
      },
    });
  }, []);

  return (
    <MainLayout
      style={{backgroundColor: theme.colors.bg_neutral, paddingHorizontal: 0}}>
      <AppHeader
        style={{paddingHorizontal: 16, flex: 0.5}}
        onBack={() => navigation.goBack()}
        label={'Vị trí'}
      />
      <View
        style={{
          overflow: 'hidden',
          width: '100%',
          flex: 9,
        }}>
        <Mapbox.MapView
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
          <Mapbox.Camera
            ref={mapboxCameraRef}
            centerCoordinate={[
              location?.coords.longitude ?? 0,
              location?.coords.latitude ?? 0,
            ]}
            animationMode={'flyTo'}
            animationDuration={500}
            zoomLevel={12}
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
          <View style={styles.searchContainer}>
            <Image
              source={ImageAssets.MapPinFillIcon}
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={theme.colors.text_secondary}
            />
            <TextInput
              style={styles.textInput}
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
          <View style={[styles.buttonFooter, {bottom: bottom}]}>
            <AppButton label={getLabel('completed')} onPress={handleComplete} />
          </View>
        </Mapbox.MapView>
      </View>
    </MainLayout>
  );
};
export default CheckInLocation;
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
      padding: 16,
      top: 20,
    } as ViewStyle,
    textInput: {
      color: theme.colors.text_primary,
      marginLeft: 8,
      maxWidth: '90%',
    } as TextStyle,
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      marginTop: 32,
      maxWidth: '50%',
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    buttonFooter: {
      position: 'absolute',
      width: '90%',
      alignSelf: 'center',
    } as ViewStyle,
  });
