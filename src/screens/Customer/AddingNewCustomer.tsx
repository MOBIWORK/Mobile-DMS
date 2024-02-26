import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {DatePickerModal} from 'react-native-paper-dates';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import moment from 'moment';
import {IValueType} from './Customer';

import {MainLayout} from '../../layouts';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
  AppText,
  showSnack,
  SvgIcon,
} from '../../components/common';
import FormAdding from './components/FormAdding';
import {Colors} from '../../assets';
import {ApiConstant, AppConstant, ScreenConstant} from '../../const';
import {NavigationProp} from '../../navigation';
import {IDataCustomer, KeyAbleProps} from '../../models/types';
import {AppTheme, useTheme} from '../../layouts/theme';
import ListFilterAdding from './components/ListFilterAdding';
import FormAddress from './components/FormAddress';
import {openImagePicker, openImagePickerCamera} from '../../utils/camera.utils';
import {
  setNewCustomer,
  setProcessingStatus,
} from '../../redux-store/app-reducer/reducer';
import {dispatch} from '../../utils/redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {CustomerService} from '../../services';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useSelector} from '../../config/function';
import {MainAddress, MainContactAddress} from './components/CardAddress';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {CommonUtils} from '../../utils';
import {useTranslation} from 'react-i18next';

const AddingNewCustomer = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: '',
    customerBirthday: 'Tất cả',
  });

  const [location, setLocation] = useState<Location | null>(null);

  const [imageSource, setImageSource] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>();
  const [listData, setListData] = useState<IDataCustomer>({
    customer_code: '',
    customer_name: '',
    customer_type: '',
    customer_group: '',
    territory: '',
    custom_birthday: new Date().getTime(),
  });
  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );

  const mainAddress = useSelector(state => state.customer.mainAddress);
  const mainContactAddress = useSelector(
    state => state.customer.mainContactAddress,
  );
  const lisCustomerRoute = useSelector(
    state => state.customer.listCustomerRoute,
  );
  const listCustomerTerritory = useSelector(
    state => state.customer.listCustomerTerritory,
  );

  const snapPoint = useMemo(() => ['40%'], []);
  const snapPointAdding = useMemo(
    () =>
      typeFilter === AppConstant.CustomerFilterType.dia_chi
        ? ['100%']
        : typeFilter === AppConstant.CustomerFilterType.nguoi_lien_he
        ? ['100%']
        : ['40%'],
    [typeFilter],
  );

  const filterRef = useRef<BottomSheetMethods>(null);
  const addingAddress = useRef<BottomSheetMethods>(null);
  const cameraBottomRef = useRef<BottomSheetMethods>(null);

  const onPressAdding = async (newListData: IDataCustomer) => {
    const address: MainAddress = mainAddress;
    const contact: MainContactAddress = mainContactAddress;
    const updateListData: IDataCustomer = {
      ...newListData,
      frequency: newListData.frequency.toString(),
      customer_type:
        newListData.customer_type === getLabel('individual')
          ? 'Individual'
          : 'Company',
      address_title_cus: `${newListData.customer_name} address`,
      address_type_cus: address ? 'Billing' : '',
      detail_address_cus: address?.detailAddress,
      ward_cus: String(address?.ward?.id) ?? '',
      district_cus: String(address?.district?.id) ?? '',
      province_cus: String(address?.city?.id) ?? '',
      is_primary_address: address.addressOrder,
      is_shipping_address: address.addressGet,
      phone: contact?.phoneNumber ?? '',
      adr_title_contact: `${newListData.customer_name} contact`,
      detail_adr_contact: contact?.addressContact ?? '',
      ward_contact: String(contact?.ward?.id) ?? '',
      district_contact: String(contact?.district?.id) ?? '',
      province_contact: String(contact?.city?.id) ?? '',
      first_name: contact?.nameContact ?? '',
      router_name: newListData.router_name[1] ?? '',
      website: newListData.website ?? '',
      longitude: newListData.longitude ?? 0,
      latitude: newListData.latitude ?? 0,
      custom_birthday: newListData.custom_birthday
        ? newListData.custom_birthday / 1000
        : new Date().getTime() / 1000,
    };

    dispatch(setNewCustomer(newListData));
    dispatch(setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    const response: KeyAbleProps = await CustomerService.addNewCustomer(
      updateListData,
    );
    if (response?.status === ApiConstant.STT_OK) {
      navigation.navigate(ScreenConstant.MAIN_TAB, {
        screen: ScreenConstant.CUSTOMER,
      });
    }
    dispatch(setProcessingStatus(false));
  };

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const handleImagePicker = () => {
    openImagePicker(selectedImage => {
      // Handle the selected image, e.g., set it to state
      cameraBottomRef.current?.close();
      setImageSource(selectedImage);
      setListData(prevState => ({...prevState, faceimage: selectedImage}));
    }, true);
  };

  const handleCameraPicker = () => {
    openImagePickerCamera((selectedImage, base64) => {
      // Handle the selected image, e.g., set it to state
      cameraBottomRef.current?.close();
      setImageSource(base64);
      setListData(prevState => ({...prevState, faceimage: base64}));
    });
  };
  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      setDate(params.date);
    },
    [setOpenDate, setDate],
  );

  const getCustomerTerritory = async () => {
    const response: any = await CustomerService.getCustomerTerritory();
    if (response?.result.length > 0) {
      dispatch(customerActions.setListCustomerTerritory(response.result));
    }
  };

  const getCustomerRoute = async () => {
    // const response: any = await CustomerService.getCustomerRoute();
    // if (response?.result.length > 0) {
    //   dispatch(customerActions.setListCustomerRoute(response.result));
    // }
    dispatch(customerActions.onGetCustomerVisit());
  };
  //get Cur Location
  useEffect(() => {
    if (!location) {
      BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
        .then(cur_location => {
          setLocation(cur_location);
        })
        .catch(() => {
          showSnack({
            msg: getLabel('GPSErr'),
            interval: 2000,
            type: 'error',
          });
        });
    }
  }, []);

  useLayoutEffect(() => {
    if (listCustomerTerritory.length === 0) {
      getCustomerTerritory();
    }
    if (lisCustomerRoute.length === 0) {
      getCustomerRoute();
    }
  }, []);

  return (
    <MainLayout>
      <AppHeader
        label={getLabel('customer')}
        onBack={() => navigation.goBack()}
        backButtonIcon={
          <AppIcons
            iconType={AppConstant.ICON_TYPE.EntypoIcon}
            name="chevron-thin-left"
            size={24}
            color={Colors.gray_600}
          />
        }
      />
      <View style={[styles.containContentView, {marginBottom: bottom + 60}]}>
        <FormAdding
          filterRef={filterRef}
          setTypeFilter={setTypeFilter}
          valueFilter={listData}
          valueDate={moment(date).format('DD/MM/YYYY')}
          setOpen={setOpenDate}
          setData={setListData}
          addingBottomRef={addingAddress}
          imageSource={imageSource}
          cameraBottomRef={cameraBottomRef}
          location={location}
          setLocation={setLocation}
        />
        <TouchableOpacity
          style={styles.buttonAddingNew}
          onPress={() => onPressAdding(listData)}>
          <Text style={styles.textButtonStyle}>Thêm mới</Text>
        </TouchableOpacity>
      </View>
      <AppBottomSheet bottomSheetRef={filterRef} snapPointsCustom={snapPoint}>
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <ListFilterAdding
            type={typeFilter}
            filterRef={filterRef}
            setValueFilter={setValueFilter}
            valueFilter={valueFilter}
            setData={setListData}
            data={listData}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openDate}
        label={getLabel('chooseBirthday')}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <AppBottomSheet
        bottomSheetRef={addingAddress}
        snapPointsCustom={snapPointAdding}>
        <FormAddress
          onPressClose={() => {
            addingAddress.current?.close();
          }}
          typeFilter={typeFilter}
        />
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={cameraBottomRef}
        snapPointsCustom={['28%']}>
        <MainLayout style={styles.mainLayout}>
          <View>
            <AppHeader
              label={getLabel('chooseImage')}
              onBack={() => {}}
              backButtonIcon={
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name="close"
                  size={26}
                  color={theme.colors.black}
                  onPress={() => cameraBottomRef.current?.close()}
                />
              }
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.containButton}
              onPress={handleCameraPicker}>
              <View style={styles.containIconView}>
                <SvgIcon source="IconCamera" size={24} />
                <AppText fontSize={16} fontWeight="500" colorTheme="black">
                  {'  '} {getLabel('takePicture')}
                </AppText>
              </View>

              <SvgIcon source="arrowRight" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.containButton}
              onPress={handleImagePicker}>
              <View style={styles.containIconView}>
                <SvgIcon source="IconImage" size={24} />
                <AppText fontSize={16} fontWeight="500" colorTheme="black">
                  {'  '} {getLabel('chooseFromLibrary')}
                </AppText>
              </View>
              <SvgIcon source="arrowRight" size={20} />
            </TouchableOpacity>
          </View>
        </MainLayout>
      </AppBottomSheet>
    </MainLayout>
  );
};

export default React.memo(AddingNewCustomer);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containContentView: {
      marginTop: 24,
      flex: 1,
    } as ViewStyle,

    buttonAddingNew: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      alignItems: 'center',
      // marginBottom: 40,
      width: '100%',
      alignSelf: 'center',
      position: 'absolute',
      bottom: -40,
      height: 40,
      justifyContent: 'center',
    } as ViewStyle,
    textButtonStyle: {
      color: Colors.white,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
    } as TextStyle,
    mainLayout: {paddingTop: 0} as ViewStyle,
    containButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      marginVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    } as ViewStyle,
    containIconView: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
  });
