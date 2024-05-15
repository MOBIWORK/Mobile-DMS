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
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState, useTransition} from 'react';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {ApiConstant, AppConstant} from '../../../const';
import {Colors} from '../../../assets';
import {AppIcons, AppInput, SvgIcon} from '../../../components/common';
import AppImage from '../../../components/common/AppImage';
import {IDataCustomer, KeyAbleProps} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useSelector} from '../../../config/function';
import CardAddress from './CardAddress';
import {dispatch} from '../../../utils/redux';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {AppService} from '../../../services';
import {CommonUtils} from '../../../utils';
import isEqual from 'react-fast-compare';
import {GeolocationResponse} from '@react-native-community/geolocation';
import { shallowEqual } from 'react-redux';

type Props = {
  filterRef: React.RefObject<BottomSheetMethods>;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  valueFilter: IDataCustomer;
  setData: React.Dispatch<React.SetStateAction<IDataCustomer>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  valueDate: Date | any;
  setModalShow:React.Dispatch<React.SetStateAction<boolean>>;
  cameraBottomRef: React.RefObject<BottomSheetMethods>;
  imageSource: any;
  location: GeolocationResponse | null;
  setLocation: (location: GeolocationResponse) => void;
  setModalOpen:React.Dispatch<React.SetStateAction<boolean>>
};

const FormAdding = (props: Props) => {
  const {
    filterRef,
    setTypeFilter,
    valueFilter,
    setData,
    setOpen,
    valueDate,
    setModalShow,
    imageSource,
    location,
    setLocation,
    setModalOpen
  } = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: translate} = useTranslation();
  const mainAddress = useSelector(state => state.customer.mainAddress,shallowEqual);
  const mainContactAddress = useSelector(
    state => state.customer.mainContactAddress,shallowEqual
  );

  const [_, setValue] = useState<string>('');

  const [isPending, startTransition] = useTransition();
 


  

  

  useEffect(() => {
    if (location?.coords) {
      AppService.getDetailLocation(
        location.coords.latitude,
        location.coords.longitude,
      ).then(response => {
        if (response.status === ApiConstant.STT_OK || 'OK') {
          setValue(response.results[0].formatted_address);
        }
      });
    }
  }, [location]);

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
        label={translate('customerName')}
        value={valueFilter.customer_name}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text =>
          startTransition(() => {
            setData(prev => ({...prev, customer_name: text}));
          })
        }
      />
      <AppInput
        label={translate('customerCode')}
        value={valueFilter.customer_code}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text =>
          startTransition(() => {
            setData(prev => ({...prev, customer_code: text}));
          })
        }
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
          Keyboard.dismiss();
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
         setModalOpen(true)
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
        // value={valueFilter.frequency ? converArr(valueFilter.frequency) : ''}
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
        label={translate('debtLimit')}
        value={valueFilter.customer_name}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={text =>
          startTransition(() => {
            
            setData(prev => ({...prev, credit_limit: text}));
          })
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
          startTransition(() => {
            setData(prev => ({...prev, customer_details: text}));
          })
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
        onChangeValue={text =>
          startTransition(() => {
            setData(prev => ({...prev, website: text}));
          })
        }
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
                setModalShow(true)
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
                setModalShow(true)
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
    </ScrollView>
  );
};

export default React.memo(FormAdding, isEqual);

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
      overflow: 'hidden',
      width: '100%',
      flex: 1,
      borderRadius: 16,
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
      borderColor: theme.colors.border,
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: 32,
    } as ViewStyle,
    location2View: {
      backgroundColor: theme.colors.action,
      height: 31,
      position: 'absolute',
      top: 70,
      width: 129,
      right: 20,
      borderRadius: 8,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
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
      position: 'absolute',
      top: 16,
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
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 75,
      right: 0,
    } as ViewStyle,
  });
