import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
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
  Block,
  SvgIcon,
} from '../../components/common';
import FormAdding from './components/FormAdding';
import {ApiConstant, AppConstant, ScreenConstant} from '../../const';
import {NavigationProp} from '../../navigation/screen-type';
import {
  DataCustomersUpdate,
  IDataCustomer,
  IDataCustomers,
  ListCustomerTerritory,
} from '../../models/types';
import {AppTheme, useTheme} from '../../layouts/theme';
import ListFilterAdding from './components/ListFilterAdding';
import FormAddress from './components/FormAddress';
import {openImagePicker, openImagePickerCamera} from '../../utils/camera.utils';
import {dispatch} from '../../utils/redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {CustomerService} from '../../services';
import {useSelector} from '../../config/function';
import {MainAddress, MainContactAddress} from './components/CardAddress';

import {CommonUtils} from '../../utils';
import {useTranslation} from 'react-i18next';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {
  setNewCustomer,
  setProcessingStatus,
} from '../../redux-store/app-reducer/reducer';
import isEqual from 'react-fast-compare';
import Modal from 'react-native-modal';
import ModalArea from './components/ModalArea';
import {storage} from '../../utils/commom.utils';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';

function listDataReducer(newState: any, oldState: any) {
  return {...newState, ...oldState};
}

const AddingNewCustomer = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const initValueState = useRef<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: '',
    // customerBirthday: 'Tất cả',
  });
  const [valueFilter, setValueFilter] = useReducer(
    listDataReducer,
    initValueState.current,
  );
  const initStateData = useRef<IDataCustomers>({
    customer_code: '',
    customer_name: '',
    customer_type: '',
    customer_group: '',
    sfa_customer_type: '',
    sfa_sale_channel: '',
    territory: '',
    custom_birthday: new Date().getTime(),
    mobile_no: '',
    industry: '',
    name: '',
  });

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [modalAddress, setModalAddress] = useState(false);
  const [imageSource, setImageSource] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>();
  const [listData, setListData] = useState<IDataCustomers>(
    initStateData.current,
  );
  const listTerritory: ListCustomerTerritory[] = useSelector(
    state => state.customer.listCustomerTerritory,
  );
  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
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
  const listTypeCustomer = useSelector(
    state => state.customer.listTypeCustomer,
  );
  const listChannel = useSelector(state => state.customer.listChannel);
  const snapPoint = useMemo(() => ['60%'], []);
  const filterRef = useRef<BottomSheetMethods>(null);
  const cameraBottomRef = useRef<BottomSheetMethods>(null);

  // const isInvalid = useCallback((newListData: IDataCustomer) => {
  //
  // }, []);

  const isInvalid = (newListData: IDataCustomer) => {
    return (
      newListData?.customer_name &&
      newListData?.customer_code &&
      newListData?.customer_type &&
      newListData?.customer_group &&
      newListData?.sfa_customer_type &&
      newListData?.sfa_sale_channel &&
      newListData?.territory &&
      newListData?.frequency &&
      newListData?.router &&
      newListData?.router?.length > 0
    );
  };

  const onPressAdding = async (newListData: IDataCustomer) => {
    dispatch(setProcessingStatus(true));
    let address: MainAddress = mainAddress;
    let contact: MainContactAddress = mainContactAddress;

    const updateListData: DataCustomersUpdate = {
      router: newListData?.router
        ? newListData?.router.map(item => item.name)
        : [],
      frequency: newListData?.frequency
        ? newListData.frequency.toString().replaceAll(',', ';')
        : '',
      address: {
        longitude: newListData.longitude || 0,
        latitude: newListData.latitude || 0,
        address_title:
          Object.keys(address).length > 0
            ? `${address?.detailAddress},${address.ward?.value},${address.district?.value},${address.city?.value},Vietnam`
            : '',
        address_type: 'Billing',
        address_line1:
          Object.keys(address).length > 0 ? String(address?.detailAddress) : '',
        city: Object.keys(address).length > 0 ? String(address?.city?.id) : '',
        county:
          Object.keys(address).length > 0 ? String(address?.district?.id) : '',
        state: Object.keys(address).length > 0 ? String(address?.ward?.id) : '',
        is_primary_address:
          Object.keys(address).length > 0 ? address.addressOrder : false,
        is_shipping_address:
          Object.keys(address).length > 0 ? address.addressGet : false,
        primary:
          Object.keys(address).length > 0
            ? address.primary
              ? true
              : false
            : false,
      },
      contact:
        Object.keys(contact).length > 0
          ? {
              address_title:
                Object.keys(contact).length > 0
                  ? `${contact.ward?.value}/${contact.district?.value}/${contact.city?.value}`
                  : '',
              address_line1:
                Object.keys(address).length > 0
                  ? String(address?.detailAddress)
                  : '',
              first_name: contact?.nameContact || '',
              phone: contact?.phoneNumber || '',
              city:
                Object.keys(contact).length > 0
                  ? String(contact?.city?.id)
                  : '',
              county:
                Object.keys(contact).length > 0
                  ? String(contact?.district?.id)
                  : '',
              state:
                Object.keys(contact).length > 0
                  ? String(contact?.ward?.id)
                  : '',
            }
          : undefined,

      customer_type:
        newListData.customer_type === getLabel('individual')
          ? 'Individual'
          : newListData.customer_type === getLabel('company')
          ? 'Company'
          : newListData.customer_type === getLabel('proprietorship')
          ? 'Proprietorship'
          : 'Partnership',

      website: newListData.website ?? '',

      custom_birthday: newListData.custom_birthday
        ? newListData.custom_birthday / 1000
        : new Date().getTime() / 1000,
      customer_code: newListData.customer_code || '',
      customer_name: newListData.customer_name || '',
      customer_group: newListData.customer_group || '',
      sfa_customer_type: newListData.sfa_customer_type || '',
      sfa_sale_channel: newListData.sfa_sale_channel || '',
      territory: newListData?.territory ?? '',
      credit_limit: newListData?.credit_limit
        ? Number(newListData.credit_limit.toString().replaceAll('.', ''))
        : 0,
      customer_details: newListData?.customer_details ?? '',
      image: newListData.faceimage ? newListData.faceimage : '',
    };

    // console.log(updateListData, 'update List Data');
    if (isInvalid(newListData)) {
      dispatch(checkinActions.setRefreshCustomerWhenAddNew(true));
      dispatch(setNewCustomer(newListData));
      await CommonUtils.CheckNetworkState();
      const response: any = await CustomerService.addNewCustomer(
        updateListData,
      );
      if (response?.status === ApiConstant.STT_CREATED) {
        dispatch(checkinActions.setRefreshCustomerWhenAddNew(true));
        navigation.navigate(ScreenConstant.MAIN_TAB, {
          screen: ScreenConstant.CUSTOMER,
        });
      }
    } else {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
    }

    dispatch(setProcessingStatus(false));
  };

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const handleImagePicker = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      (granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']) ||
      Platform.OS === 'ios'
    ) {
      openImagePicker((selectedImage, base64) => {
        // Handle the selected image, e.g., set it to state
        cameraBottomRef.current?.close();
        setImageSource('data:image/jpeg;base64,' + base64);
        setListData((prevState: any) => ({
          ...prevState,
          faceimage: `data:image/jpeg;base64,${base64}`,
        }));
      });
    } else {
      Alert.alert('Bạn chưa cấp quyền');
    }
  };

  const handleCameraPicker = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      (granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']) ||
      Platform.OS === 'ios'
    ) {
      openImagePickerCamera((selectedImage, base64) => {
        // Handle the selected image, e.g., set it to state
        cameraBottomRef.current?.close();
        setImageSource('data:image/jpeg;base64,' + base64);
        setListData((prevState: any) => ({
          ...prevState,
          faceimage: `data:image/jpeg;base64,${base64}`,
        }));
      });
    } else {
      Alert.alert('Bạn chưa cấp quyền ');
    }
  };
  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      setDate(params.date);
      setListData(prev => ({...prev, custom_birthday: params.date?.getTime()}));
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
    const response: any = await CustomerService.getCustomerRoute();
    if (response?.result.length > 0) {
      dispatch(customerActions.setListCustomerRoute(response.result));
    }
  };

  const getTypeCustomer = async () => {
    const response: any = await CustomerService.getTypeCusTomer();
    if (response?.result.length > 0) {
      dispatch(customerActions.setListTypeCustomer(response.result));
    }
  };
  const getChannel = async () => {
    const response: any = await CustomerService.getChannel();
    if (response?.result.length > 0) {
      dispatch(customerActions.setListChannel(response.result));
    }
  };
  //get Cur Location
  useEffect(() => {
    if (!location) {
      CommonUtils.getCurrentLocation(locations => setLocation(locations));
    }
  }, []);

  useLayoutEffect(() => {
    if (listCustomerTerritory.length === 0) {
      getCustomerTerritory();
    }
    if (lisCustomerRoute.length === 0) {
      getCustomerRoute();
    }
    if (listTypeCustomer.length === 0) {
      getTypeCustomer();
    }
    if (listTypeCustomer.length === 0) {
      getChannel();
    }
  }, []);

  const onBackButtonPress = useCallback(() => {
    setOpenModal(false);
  }, [openModal]);
  const onPressClose = useCallback(() => {
    setModalAddress(false);
  }, [modalAddress]);

  return (
    <>
      <MainLayout>
        <AppHeader
          label={getLabel('customer')}
          onBack={() => navigation.goBack()}
        />
        <View style={[styles.containContentView, {marginBottom: bottom + 60}]}>
          <FormAdding
            filterRef={filterRef}
            setTypeFilter={setTypeFilter}
            valueFilter={listData}
            valueDate={moment(date).format('DD/MM/YYYY')}
            setOpen={setOpenDate}
            setData={setListData}
            setModalShow={setModalAddress}
            imageSource={imageSource}
            cameraBottomRef={cameraBottomRef}
            location={location}
            setLocation={setLocation}
            setModalOpen={setOpenModal}
          />
          <TouchableOpacity
            style={styles.buttonAddingNew}
            onPress={() => onPressAdding(listData)}>
            <Text style={styles.textButtonStyle}>Thêm mới</Text>
          </TouchableOpacity>
        </View>
        <AppBottomSheet bottomSheetRef={filterRef} snapPointsCustom={snapPoint}>
          <ListFilterAdding
            type={typeFilter}
            filterRef={filterRef}
            setValueFilter={setValueFilter}
            valueFilter={valueFilter}
            setData={setListData}
            data={listData}
          />
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
        <Modal
          isVisible={modalAddress}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          style={styles.modal}
          backdropColor="white"
          backdropOpacity={1}
          onBackButtonPress={() => setModalAddress(false)}
          onBackdropPress={() => setModalAddress(false)}>
          <Block block>
            <FormAddress
              onPressClose={onPressClose}
              typeFilter={typeFilter}
              listData={listData}
              setData={setListData}
              dataCustomer={listData}
            />
          </Block>
        </Modal>
        <ModalArea
          openModal={openModal}
          setOpenModal={setOpenModal}
          listTerritory={listTerritory}
          data={listData as any}
          setData={setListData as any}
          onBackButtonPress={onBackButtonPress}
        />
      </MainLayout>
    </>
  );
};

export default React.memo(AddingNewCustomer, isEqual);

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
      color: theme.colors.bg_default,
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
    modal: {
      marginHorizontal: 0,
      flex: 1,
      width: '100%',
      height: '100%',
      marginVertical: 0,
      paddingHorizontal: 16,
    } as ViewStyle,
  });
