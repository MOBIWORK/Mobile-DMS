import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
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
  SvgIcon,
} from '../../components/common';
import FormAdding from './components/FormAdding';
import {Colors} from '../../assets';
import {AppConstant, ScreenConstant} from '../../const';
import {NavigationProp} from '../../navigation';
import {IDataCustomer} from '../../models/types';
import {AppTheme, useTheme} from '../../layouts/theme';
import ListFilterAdding from './components/ListFilterAdding';
import FormAddress from './components/FormAddress';
import {openImagePicker, openImagePickerCamera} from '../../utils/camera.utils';
import {useSelector} from '../../config/function';
import {
  appActions,
  setNewCustomer,
} from '../../redux-store/app-reducer/reducer';
import {dispatch} from '../../utils/redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {customerActions} from '../../redux-store/customer-reducer/reducer';

const AddingNewCustomer = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: 'Tất cả',
    customerBirthday: 'Tất cả',
  });

  const [imageSource, setImageSource] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>();
  const [listData, setListData] = useState<IDataCustomer>({
    customer_code: '',
    customer_name: '',
    customer_type: valueFilter.customerType,
    customer_group: valueFilter.customerGroupType,
    customer_birthday: date,
    territory: '',
    router_name: '',
    credit_limid: 0,
    customer_details: '',
    website: '',
    // address: {
    //   address: mainAddress?.length >= 0 ? mainAddress[0]?.detailAddress : '',
    //   isSetAddressGet:
    //     mainAddress?.length >= 0 ? mainAddress[0]?.addressGet : false,
    //   isSetAddressTake:
    //     mainAddress?.length >= 0 ? mainAddress[0]?.addressOrder : false,
    // },
    // contact: {
    //   name:
    //     mainContactAddress?.length >= 0
    //       ? mainContactAddress[0]?.nameContact
    //       : '',
    //   address:
    //     mainContactAddress?.length >= 0
    //       ? mainContactAddress[0]?.addressContact
    //       : '',
    //   phoneNumber:
    //     mainContactAddress?.length >= 0
    //       ? mainContactAddress[0]?.phoneNumber
    //       : '',
    // },
    image: imageSource ? imageSource : '',
  });
  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
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

  const onPressAdding = (newListData: IDataCustomer) => {
    dispatch(setNewCustomer(newListData));
    navigation.navigate(ScreenConstant.MAIN_TAB, {
      screen: ScreenConstant.CUSTOMER,
    });
  };

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const handleImagePicker = () => {
    openImagePicker(selectedImage => {
      // Handle the selected image, e.g., set it to state
      console.log('Selected Image:', selectedImage);
      setImageSource(selectedImage);
      cameraBottomRef.current?.close();
    });
  };

  const handleCameraPicker = () => {
    openImagePickerCamera(selectedImage => {
      // Handle the selected image, e.g., set it to state
      setImageSource(selectedImage);
      console.log('Selected Image from Camera:', selectedImage);
      cameraBottomRef.current?.close();
    });
  };
  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      setDate(params.date);
    },
    [setOpenDate, setDate],
  );

  useEffect(() => {
    dispatch(customerActions.onGetCustomerType());
    dispatch(appActions.onGetListCity());
  }, []);

  return (
    <MainLayout>
      <AppHeader
        label="Khách hàng"
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
        label="Chọn sinh nhật"
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
              label="Chọn ảnh"
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
                  {'  '}Chụp ảnh
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
                  {'  '}Chọn từ thư viện
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
