import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {MainLayout} from '../../layouts';
import {DatePickerModal} from 'react-native-paper-dates';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
  AppInput,
} from '../../components/common';
import {AppConstant} from '../../const';
import {Colors} from '../../assets';
import {ColorSchema, useNavigation, useTheme} from '@react-navigation/native';
import AppImage from '../../components/common/AppImage';
import {NavigationProp} from '../../navigation';
import {IValueType} from './Customer';
import {TextInput} from 'react-native-paper';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import FormAdding from './components/FormAdding';
import ListFilter from './components/ListFilter';
import {IDataCustomer} from '../../models/types';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';

const AddingNewCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: 'Cá nhân',
    customerGroupType: 'Tất cả',
    customerBirthday: 'Tất cả',
  });
  const [date, setDate] = useState<Date>();
  const [listData, setListData] = useState<IDataCustomer>({
    nameCompany: '',
    type: valueFilter.customerType,
    group: valueFilter.customerGroupType,
    dob: valueFilter.customerBirthday,
    area: '',
    gland: '',
    debtLimit: 0,
    description: '',
    websiteURL: '',
    address: {
      address: '',
      phoneNumber: '',
    },
    contact: {
      name: '',
      address: '',
      phoneNumber: '',
    },
  });
  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const snapPoint = useMemo(() => ['40%'], []);
  const filterRef = useRef<BottomSheetMethods>(null);

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

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
        <Text style={styles.titleText}>Thông tin chung </Text>
        <TouchableOpacity style={styles.containContainImage}>
          <View style={styles.containImageCamera}>
            <AppImage source="IconCamera" style={styles.iconImage} />
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <FormAdding
            filterRef={filterRef}
            setTypeFilter={setTypeFilter}
            valueFilter={valueFilter}
            valueDate={date}
            setOpen={setOpenDate}
            onChange={value =>
              setListData(prev => ({
                ...prev,
                nameCompany: value,
              }))
            }
          />
        </View>
      </View>
      <AppBottomSheet bottomSheetRef={filterRef} snapPointsCustom={snapPoint}>
        <ListFilter
          type={typeFilter}
          filterRef={filterRef}
          setValueFilter={setValueFilter}
          valueFilter={valueFilter}
        />
      </AppBottomSheet>
      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openDate}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
    </MainLayout>
  );
};

export default React.memo(AddingNewCustomer);

const rootStyles = (theme: ColorSchema) =>
  StyleSheet.create({
    containContentView: {
      marginTop: 24,
      flex: 1,
      // backgroundColor: 'red',
    } as ViewStyle,
    titleText: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21,
      color: Colors.gray_600,
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
  });
