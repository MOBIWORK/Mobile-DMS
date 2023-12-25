import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {AppActions, IAppReduxState} from '../../redux-store';
import {openImagePicker, openImagePickerCamera} from '../../utils/camera.utils';

const AddingNewCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: 'Tất cả',
    customerBirthday: 'Tất cả',
  });
  const {mainContactAddress, mainAddress} = useSelector(
    (state: IAppReduxState) => state.appRedux,
  );
  const [imageSource, setImageSource] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>();
  const [listData, setListData] = useState<IDataCustomer>({
    nameCompany: '',
    type: valueFilter.customerType,
    group: valueFilter.customerGroupType,
    dob: date,
    area: '',
    gland: '',
    debtLimit: 0,
    description: '',
    websiteURL: '',
    address: {
      address: mainAddress?.length >= 0 ? mainAddress[0]?.detailAddress : '',
      isSetAddressGet:
        mainAddress?.length >= 0 ? mainAddress[0]?.addressGet : false,
      isSetAddressTake:
        mainAddress?.length >= 0 ? mainAddress[0]?.addressOrder : false,
    },
    contact: {
      name:
        mainContactAddress?.length >= 0
          ? mainContactAddress[0]?.nameContact
          : '',
      address:
        mainContactAddress?.length >= 0
          ? mainContactAddress[0]?.addressContact
          : '',
      phoneNumber:
        mainContactAddress?.length >= 0
          ? mainContactAddress[0]?.phoneNumber
          : '',
    },
    imageSource: imageSource ? imageSource : '',
  });
  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();

  const snapPoint = useMemo(() => ['40%'], []);
  const snapPointAdding = useMemo(
    () =>
      typeFilter === AppConstant.CustomerFilterType.dia_chi
        ? ['100%']
        : typeFilter === AppConstant.CustomerFilterType.nguoi_lien_he
        ? ['60%']
        : ['40%'],
    [typeFilter],
  );

  const filterRef = useRef<BottomSheetMethods>(null);
  const addingAddress = useRef<BottomSheetMethods>(null);
  const cameraBottomRef = useRef<BottomSheetMethods>(null);

  const onPressAdding = (listData: IDataCustomer) => {
    dispatch(AppActions.setNewCustomer(listData));
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
      <View style={styles.containContentView}>
        <FormAdding
          filterRef={filterRef}
          setTypeFilter={setTypeFilter}
          valueFilter={listData}
          valueDate={moment(date).format('DD/MM/YYYY')}
          setOpen={setOpenDate}
          setData={setListData}
          addingBottomRef={addingAddress}
          setShow={setShow}
          imageSource={imageSource}
          cameraBottomRef={cameraBottomRef}
        />
      </View>
      <AppBottomSheet bottomSheetRef={filterRef} snapPointsCustom={snapPoint}>
        <ListFilterAdding
          type={typeFilter}
          filterRef={filterRef}
          setValueFilter={setValueFilter}
          valueFilter={valueFilter}
          setData={setListData}
          data={listData}
          setShow={setShow}
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
            setShow(false);
          }}
          typeFilter={typeFilter}
        />
      </AppBottomSheet>
      {!show && (
        <TouchableOpacity
          style={styles.buttonAddingNew}
          onPress={() => onPressAdding(listData)}>
          <Text style={styles.textButtonStyle}>Thêm mới</Text>
        </TouchableOpacity>
      )}
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
      // backgroundColor: 'red',
    } as ViewStyle,

    buttonAddingNew: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 40,
      height: 40,
      // marginBottom:40,
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
