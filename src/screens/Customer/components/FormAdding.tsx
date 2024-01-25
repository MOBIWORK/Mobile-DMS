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
} from 'react-native';
import React, {useRef, useState, useLayoutEffect} from 'react';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import Mapbox, {Location} from '@rnmapbox/maps';
import {AppConstant} from '../../../const';
import {Colors} from '../../../assets';
import {
  AppFAB,
  AppIcons,
  AppInput,
  AppText,
  SvgIcon,
  showSnack,
} from '../../../components/common';
import AppImage from '../../../components/common/AppImage';
import {IDataCustomer, RootEkMapResponse} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {getDetailLocation} from '../../../services/appService';
import {formatMoney, useSelector} from '../../../config/function';
import CardAddress from './CardAddress';
import {
  removeAddress,
  removeContactAddress,
} from '../../../redux-store/app-reducer/reducer';
import {dispatch} from '../../../utils/redux';
import { customerActions } from '../../../redux-store/customer-reducer/reducer';

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
  } = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: translate} = useTranslation();
  const ref = useRef<Mapbox.Camera>(null);
  const [location, setLocation] = useState<Location | any>({
    coords: {
      latitude: 0,
      longitude: 0,
    },
    timestamp: 0,
  });
  const [dataLocation, setDataLocation] = useState<string>('');
  const mainAddress = useSelector(state => state.app.mainAddress);
  const mainContactAddress = useSelector(state=>state.app.mainContactAddress);
  
  const fetchData = async (lat: any, lon: any) => {
    const data: RootEkMapResponse = await getDetailLocation(lat, lon);

    if (data.status === 'OK') {
      setDataLocation(data.results[0].formatted_address);
    } else {
      showSnack({
        msg: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        type: 'error',
        interval: 1000,
      });
    }
    // return console.log(data, 'data');
  };

  const onPressButtonGetLocation = () => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(res => {
        setLocation(res);
        showSnack({
          msg: 'Thành công',
          type: 'success',
          interval: 1000,
        });
        ref?.current?.flyTo(
          [res?.coords.longitude, res?.coords?.latitude],
          1000,
        );
      })
      .catch(err => console.log(err));
  };

  useLayoutEffect(() => {
    dispatch(customerActions.onGetCustomerType())
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(res => {
        setLocation(res);
        fetchData(res?.coords?.latitude, res?.coords?.longitude);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      decelerationRate={'fast'}>
      <Text style={styles.titleText}>Thông tin chung </Text>
      <TouchableOpacity
        style={styles.containContainImage}
        onPress={() => props.cameraBottomRef.current?.snapToIndex(0)}>
        <View style={styles.containImageCamera}>
          {imageSource !== undefined && imageSource ? (
            <Image
              source={{uri: imageSource}}
              resizeMode="cover"
              style={styles.imageStyle}
            />
          ) : (
            <AppImage source="IconCamera" style={styles.iconImage} />
          )}
        </View>
      </TouchableOpacity>
      <AppInput
        label="Tên khách hàng"
        value={valueFilter.customer_name}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text => {
          setData(prev => ({...prev, customer_name: text}));
          console.log('text');
        }}
      />
      <AppInput
        label="Mã khách hàng"
        value={valueFilter.customer_code}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text => {
          setData(prev => ({...prev, customer_code: text}));
          console.log('text');
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
        // isRequire={true}
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
        value={''}
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
        value={''}
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
        label={translate('debtLimit')}
        value={
          valueFilter.credit_limid[0]
            ? formatMoney(valueFilter.credit_limid[0])
            : valueFilter.credit_limid[0]
        }
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text => {
          setData(prev => ({...prev, credit_limit: text}));
          console.log(formatMoney(text));
        }}
      />
      <AppInput
        label={translate('description')}
        value={valueFilter.customer_details}
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
        value={valueFilter.website}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text => setData(prev => ({...prev, website: text}))}
      />
      <View>
        <View style={styles.contentLabelAddingStyle}>
          <Text style={styles.titleText}>Địa chỉ</Text>
          {Object.keys(mainAddress).length > 0 && (
            <SvgIcon
              size={20}
              source="Trash"
              onPress={() => dispatch(removeAddress([]))}
            />
          )}
        </View>
        {Object.keys(mainAddress).length > 0 ? (
          <CardAddress type="address" mainAddress={mainAddress[0]} />
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
              <Text style={styles.textButton}>Thêm địa chỉ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        <View style={styles.contentLabelAddingStyle}>
          <Text style={styles.titleText}>Người liên hệ</Text>
          {Object.keys(mainContactAddress).length > 0 && (
            <SvgIcon
              size={20}
              source="Trash"
              onPress={() => dispatch(removeContactAddress([]))}
            />
          )}
        </View>
        {Object.keys(mainContactAddress).length > 0 ? (
          <CardAddress
            type="contact"
            mainContactAddress={mainContactAddress[0]}
          />
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
              <Text style={styles.textButton}>Thêm người liên hệ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <Text style={styles.titleText}>Vị trí</Text>
        <View style={styles.contentView}>
          <Mapbox.MapView
            pitchEnabled={false}
            styleURL={Mapbox.StyleURL.Street}
            attributionEnabled={false}
            scaleBarEnabled={false}
            logoEnabled={false}
            style={styles.mapView}>
            <Mapbox.Camera
              // ref={mapboxCameraRef}
              ref={ref}
              centerCoordinate={[
                location?.coords.longitude ?? 0,
                location?.coords.latitude ?? 0,
              ]}
              animationMode={'flyTo'}
              animationDuration={500}
              zoomLevel={12}
            />
            <View style={styles.locationView}>
              <SvgIcon source={'MapLocation'} size={24} />
              <Text numberOfLines={1}>
                {'  '}
                {dataLocation}
              </Text>
            </View>
            <View style={styles.location2View}>
              <SvgIcon source={'iconMap'} size={24} colorTheme="white" />
              <AppText numberOfLines={1} colorTheme="white" fontSize={14}>
                {'  '}Vị trí hiện tại
              </AppText>
            </View>
            <Mapbox.MarkerView
              coordinate={[
                location?.coords.longitude ?? 0,
                location?.coords.latitude ?? 0,
              ]}>
              <SvgIcon source="Location" size={32} colorTheme="action" />
            </Mapbox.MarkerView>
          </Mapbox.MapView>
          <AppFAB
            icon="google-maps"
            visible={true}
            style={styles.fab}
            mode={'flat'}
            onPress={onPressButtonGetLocation}
            customIconSize={24}
          />
        </View>
      </View>
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
  });
