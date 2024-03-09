import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {ApiConstant, AppConstant} from '../../../const';
import {Colors, ImageAssets} from '../../../assets';
import {AppIcons, AppInput, SvgIcon} from '../../../components/common';
import AppImage from '../../../components/common/AppImage';
import {IDataCustomer, KeyAbleProps} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useSelector} from '../../../config/function';
import CardAddress from './CardAddress';
import {dispatch} from '../../../utils/redux';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {AppService} from '../../../services';
import {CommonUtils} from '../../../utils';

type Props = {
  filterRef: React.RefObject<BottomSheetMethods>;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  valueFilter: IDataCustomer;
  setData: React.Dispatch<React.SetStateAction<IDataCustomer>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  valueDate: Date | any;
  addingBottomRef: React.RefObject<BottomSheetMethods>;
  cameraBottomRef: React.RefObject<BottomSheetMethods>;
  imageSource: any;
  location: Location | null;
  setLocation: (location: Location) => void;
};

const FormAdding = (props: Props) => {
  const {
    filterRef,
    setTypeFilter,
    valueFilter,
    setData,
    setOpen,
    valueDate,
    addingBottomRef,
    imageSource,
    location,
    setLocation,
  } = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: translate} = useTranslation();
  const mainAddress = useSelector(state => state.customer.mainAddress);
  const mainContactAddress = useSelector(
    state => state.customer.mainContactAddress,
  );

  const [value, setValue] = useState<string>('');
  const mapboxCameraRef = useRef<CameraRef>(null);

  const handleMarkerMap = async (lat: number, lng: number) => {
    setLocation({
      // @ts-ignore
      coords: {
        latitude: lat,
        longitude: lng,
      },
    });
    setData(prev => ({...prev, latitude: lat, longitude: lng}));
    const response: KeyAbleProps = await AppService.getDetailLocation(lat, lng);
    if (response.status === ApiConstant.STT_OK || 'OK') {
      setValue(response.results[0].formatted_address);
    }
  };

  const handleRegainLocation = () => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(cur_location => {
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [cur_location.coords.longitude, cur_location.coords.latitude],
            1000,
          );
        setLocation(cur_location);
        setData(prev => ({
          ...prev,
          latitude: cur_location.coords.latitude,
          longitude: cur_location.coords.longitude,
        }));
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
        setData(prev => ({
          ...prev,
          latitude: geometry.location.latitude,
          longitude: geometry.location.longitude,
        }));
      }
    }
  };

  useEffect(() => {
    if (location) {
      AppService.getDetailLocation(
        location.coords.latitude,
        location.coords.longitude,
      ).then(response => {
        if (response.status === ApiConstant.STT_OK || 'OK') {
          setValue(response.results[0].formatted_address);
        }
      });
    }
  }, []);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      decelerationRate={'fast'}>
      <Text style={styles.titleText}>{translate('generalInformation')} </Text>
      <TouchableOpacity
        style={styles.containContainImage}
        onPress={() => props.cameraBottomRef.current?.snapToIndex(0)}>
        <View style={styles.containImageCamera}>
          {imageSource !== undefined && imageSource ? (
            <Image
              source={{uri: `data:image/png;base64,${imageSource}`}}
              resizeMode="cover"
              style={styles.imageStyle}
            />
          ) : (
            <AppImage source="IconCamera" style={styles.iconImage} />
          )}
        </View>
      </TouchableOpacity>
      <AppInput
        label={translate('customerName')}
        value={valueFilter.customer_name}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text => {
          setData(prev => ({...prev, customer_name: text}));
        }}
      />
      <AppInput
        label={translate('customerCode')}
        value={valueFilter.customer_code}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text => {
          setData(prev => ({...prev, customer_code: text}));
        }}
      />
      <AppInput
        label={translate('customerType')}
        isRequire={true}
        contentStyle={styles.contentStyle}
        value={valueFilter.customer_type}
        editable={false}
        styles={{marginBottom: 20}}
        onPress={() => {
          setTypeFilter(AppConstant.CustomerFilterType.loai_khach_hang);
          filterRef.current?.snapToIndex(0);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('groupCustomer')}
        value={valueFilter.customer_group}
        editable={false}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setTypeFilter(AppConstant.CustomerFilterType.nhom_khach_hang);
          filterRef.current?.snapToIndex(0);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('area')}
        value={valueFilter.territory!}
        editable={false}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setTypeFilter(AppConstant.CustomerFilterType.khu_vuc);
          filterRef.current?.snapToIndex(0);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('dob')}
        value={valueDate}
        editable={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setOpen(true);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'calendar'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('gland')}
        value={valueFilter.router_name ? valueFilter.router_name[0] : ''}
        editable={false}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setTypeFilter(AppConstant.CustomerFilterType.tuyen);
          filterRef.current?.snapToIndex(0);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('frequency')}
        value={valueFilter.frequency ? valueFilter.frequency.toString() : ''}
        editable={false}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setTypeFilter(AppConstant.CustomerFilterType.tan_suat);
          filterRef.current?.snapToIndex(0);
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
      />
      <AppInput
        label={translate('description')}
        value={valueFilter.customer_details ?? ''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        inputProp={{
          multiline: true,
        }}
        hiddenRightIcon={true}
        onChangeValue={text =>
          setData(prev => ({...prev, customer_details: text}))
        }
      />
      <AppInput
        label={translate('websiteUrl')}
        value={valueFilter.website ?? ''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text => setData(prev => ({...prev, website: text}))}
      />
      <Pressable>
        <View style={styles.contentLabelAddingStyle}>
          <Text style={styles.titleText}>{translate('address')}</Text>
          {Object.keys(mainAddress).length > 0 && (
            <SvgIcon
              size={20}
              source="Trash"
              onPress={() => dispatch(customerActions.setMainAddress({}))}
            />
          )}
        </View>
        {Object.keys(mainAddress).length > 0 ? (
          <CardAddress type="address" mainAddress={mainAddress} />
        ) : (
          <View style={styles.contentView}>
            <TouchableOpacity
              style={styles.directionViewButton}
              onPress={() => {
                addingBottomRef.current?.snapToIndex(0);
                setTypeFilter(AppConstant.CustomerFilterType.dia_chi);
              }}>
              <View style={styles.containIcon}>
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.Feather}
                  name={'plus'}
                  size={20}
                  color={theme.colors.action}
                />
              </View>
              <Text style={styles.textButton}>{translate('addAddress')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
      <View>
        <View style={styles.contentLabelAddingStyle}>
          <Text style={styles.titleText}>{translate('contactName')}</Text>
          {Object.keys(mainContactAddress).length > 0 && (
            <SvgIcon
              size={20}
              source="Trash"
              onPress={() =>
                dispatch(customerActions.setMainContactAddress({}))
              }
            />
          )}
        </View>
        {Object.keys(mainContactAddress).length > 0 ? (
          <CardAddress type="contact" mainContactAddress={mainContactAddress} />
        ) : (
          <View style={styles.contentView}>
            <TouchableOpacity
              style={styles.directionViewButton}
              onPress={() => {
                addingBottomRef.current?.snapToIndex(0);
                setTypeFilter(AppConstant.CustomerFilterType.nguoi_lien_he);
              }}>
              <View style={styles.containIcon}>
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.Feather}
                  name={'plus'}
                  size={20}
                  color={theme.colors.action}
                />
              </View>
              <Text style={styles.textButton}>{translate('addContact')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Pressable>
        <Text style={styles.titleText}>{translate('location')}</Text>
        <View style={[styles.contentView, {height: 320}]}>
          {location && (
            <View
              style={{
                overflow: 'hidden',
                width: '100%',
                flex: 1,
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
                    numberOfLines={1}
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
                    {translate('currentPosition')}
                  </Text>
                </TouchableOpacity>
              </Mapbox.MapView>
            </View>
          )}
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default React.memo(FormAdding);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    contentStyle: {
      color: theme.colors.text_secondary,
      fontWeight: '400',
      fontSize: 16,
    } as TextStyle,
    root: {
      backgroundColor: theme.colors.bg_default,
      marginVertical: 10,
    } as ViewStyle,
    titleText: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21,
      color: theme.colors.text_secondary,
    } as TextStyle,
    containImageCamera: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.divider,
      width: 98,
      height: 98,
      borderRadius: 8,
    } as ViewStyle,
    containContainImage: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    } as ViewStyle,
    iconImage: {
      width: 24,
      height: 24,
    } as ImageStyle,
    contentView: {
      marginVertical: 16,
    } as ViewStyle,
    directionViewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg_neutral,
      height: 48,
      borderRadius: 16,
    } as ViewStyle,
    textButton: {
      marginLeft: 8,
      color: theme.colors.action,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    containIcon: {
      width: 24,
      height: 24,
      borderWidth: 1,
      borderColor: theme.colors.action,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    mapView: {
      width: '100%',
      height: 381,
    } as ViewStyle,
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      borderRadius: 30,
      backgroundColor: theme.colors.bg_default,
      borderWidth: 2,
      borderColor: Colors.white,
    } as ViewStyle,
    locationView: {
      backgroundColor: theme.colors.white,
      height: 48,
      position: 'absolute',
      top: 10,
      width: '90%',
      right: 0,
      left: 17,
      bottom: 0,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      // alignSelf: 'center',
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: 32,
      // paddingVertical:16,
    } as ViewStyle,
    location2View: {
      backgroundColor: theme.colors.action,
      height: 31,
      position: 'absolute',
      top: 70,
      width: 129,
      right: 20,
      // left:0,
      // bottom:0,
      borderRadius: 8,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      // alignSelf:'center'
    } as ViewStyle,
    locationText: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.colors.text_primary,
      lineHeight: 24,
      marginLeft: 8,
      maxWidth: '80%',
      textAlign: 'center',
      paddingVertical: 8,
    } as TextStyle,
    currentLocationText: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.colors.white,
      marginLeft: 8,
      lineHeight: 21,
    } as TextStyle,
    contentLabelAddingStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginHorizontal:4
    } as ViewStyle,
    imageStyle: {
      width: '100%',
      height: '100%',
      borderRadius: 16,
    } as ImageStyle,
    searchContainer: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 12,
      marginHorizontal: 16,
      flexDirection: 'row',
      backgroundColor: theme.colors.bg_default,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 8,
      top: -20,
    } as ViewStyle,
    textInput: {
      backgroundColor: theme.colors.bg_default,
      marginLeft: 8,
      maxWidth: '90%',
      padding: 0,
    } as TextStyle,
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      maxWidth: '50%',
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
  });
