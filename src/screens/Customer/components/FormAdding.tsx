import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
  Platform,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import debounce from 'debounce';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {IValueType} from '../Customer';
import {AppConstant} from '../../../const';
import {Colors} from '../../../assets';
import {AppFAB, AppIcons, AppInput} from '../../../components/common';
import AppImage from '../../../components/common/AppImage';
import {IDataCustomer, RootObjectGeoDecoding} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {apiDecodeMap} from '../../../api/apiMap';

type Props = {
  filterRef: React.RefObject<BottomSheetMethods>;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  valueFilter: IValueType;
  setData: React.Dispatch<React.SetStateAction<IDataCustomer>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  valueDate: Date | any;
};

const FormAdding = (props: Props) => {
  const {filterRef, setTypeFilter, valueFilter, setData, setOpen, valueDate} =
    props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: translate} = useTranslation();
  const ref = useRef<MapView>(null);
  const [location, setLocation] = useState<GeolocationResponse>();
  const [dataLocation, setDataLocation] = useState<string>('');

  const onPressButtonGetLocation = () => {
    Geolocation.getCurrentPosition(log => {
      setLocation(log);
      ref.current?.animateToRegion(
        {
          latitude: log?.coords.latitude!,
          longitude: log?.coords.longitude!,
          latitudeDelta: 0.05,
          longitudeDelta: 0.04,
        },
        1000,
      );
    });
    console.log('aaa')
  };

  const fetchData = async () => {
    try {
      const geoData: RootObjectGeoDecoding = await apiDecodeMap(
        location?.coords.latitude,
        location?.coords.longitude,
      );
  
      if (geoData.status === 'OK') {
        setDataLocation(geoData.plus_code.compound_code);
      }
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
    }
  };
  
  const animateMapToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        setLocation(info)
        ref.current?.animateToRegion(
          {
            latitude: info?.coords.latitude!,
            longitude: info?.coords.longitude!,
            latitudeDelta: 0.05,
            longitudeDelta: 0.04,
          },
          1000,
        );
      },
      (error) => {
        console.error('Error getting current position:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };
  
  useEffect(() => {
    fetchData();
    animateMapToCurrentLocation();
  }, []); 
  

  
  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      decelerationRate={'fast'}>
      <Text style={styles.titleText}>Thông tin chung </Text>
      <TouchableOpacity style={styles.containContainImage}>
        <View style={styles.containImageCamera}>
          <AppImage source="IconCamera" style={styles.iconImage} />
        </View>
      </TouchableOpacity>
      <AppInput
        label="Tên khách hàng"
        value={'Tên khách'}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text => {
          setData(prev => ({...prev, nameCompany: text}));
        }}
      />
      <AppInput
        label={translate('customerType')}
        isRequire={true}
        contentStyle={styles.contentStyle}
        value={valueFilter.customerType}
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
        value={valueFilter.customerGroupType}
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
        value={valueFilter.customerGroupType}
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
        label={translate('debtLimit')}
        value={''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text =>
          debounce(() => {
            setData(prev => ({...prev, debtLimit: text}));
          }, 1500)
        }
      />
      <AppInput
        label={translate('description')}
        value={''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text =>
          debounce(() => {
            setData(prev => ({...prev, description: text}));
          }, 1500)
        }
      />
      <AppInput
        label={translate('websiteUrl')}
        value={''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text =>
          debounce(() => {
            setData(prev => ({...prev, websiteURL: text}));
          }, 1500)
        }
      />
      <View>
        <Text style={styles.titleText}>Địa chỉ</Text>
        <View style={styles.contentView}>
          <TouchableOpacity style={styles.directionViewButton}>
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
      </View>
      <View>
        <Text style={styles.titleText}>Người liên hệ</Text>
        <View style={styles.contentView}>
          <TouchableOpacity style={styles.directionViewButton}>
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
      </View>
      <View>
        <Text style={styles.titleText}>Vị trí</Text>
        <View style={styles.contentView}>
          <MapView
            ref={ref}
            initialRegion={{
              latitude: 21.056871,
              longitude: 105.777695,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            }}
            style={styles.mapView}
            provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : PROVIDER_GOOGLE}
            showsUserLocation>
            <View style={styles.locationView}>
              <View style={{paddingVertical:8}}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name="location"
                color={theme.colors.text_disable}
                
                size={24}
              />
              </View>
              
              <Text numberOfLines={1} style={styles.locationText}>
                {dataLocation === '' ? 'Loading' : dataLocation}
              </Text>
            </View>

            <Marker
              draggable
              coordinate={{
                latitude: location?.coords.latitude!,
                longitude: location?.coords.longitude!,
              }}
            />
            <View style={styles.location2View}>
            <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name="map-outline"
                color={theme.colors.white}
                size={20}
              />
              <Text style={styles.currentLocationText}>Vị trí hiện tại</Text>
            </View>
          </MapView>
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

export default FormAdding;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    contentStyle: {
      color: Colors.gray_500,
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
      backgroundColor: Colors.gray_200,
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
      left: 15,
      bottom: 0,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
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
      flexDirection:'row',
      alignItems: 'center',
      // alignSelf:'center'
    } as ViewStyle,
    locationText: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.colors.text_primary,
      lineHeight: 24,
      marginLeft: 8,
      maxWidth:'80%',
      textAlign:'center',
      paddingVertical:8
    } as TextStyle,
    currentLocationText:{
      fontSize:14,
      fontWeight:'400',
      color:theme.colors.white,
      marginLeft:8,
      lineHeight:21
    } as TextStyle
  });
