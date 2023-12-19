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
import {AppBottomSheet, AppHeader, AppIcons} from '../../components/common';
import FormAdding from './components/FormAdding';
import ListFilter from './components/ListFilter';
import {Colors} from '../../assets';
import {AppConstant} from '../../const';
import {NavigationProp} from '../../navigation';
import {IDataCustomer} from '../../models/types';
import { AppTheme, useTheme } from '../../layouts/theme';

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
  const snapPointAdding = useMemo(
    () =>
      typeFilter === AppConstant.CustomerFilterType.dia_chi
        ? ['100%']
        : ['40%'],
    [],
  );

  const filterRef = useRef<BottomSheetMethods>(null);
  const addingAddress = useRef<BottomSheetMethods>(null);

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
        <FormAdding
          filterRef={filterRef}
          setTypeFilter={setTypeFilter}
          valueFilter={valueFilter}
          valueDate={moment(date).format('DD/MM/YYYY')}
          setOpen={setOpenDate}
          setData={setListData}
          addingBottomRef={addingAddress}
        />
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
        label="Chọn sinh nhật"
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <AppBottomSheet
        bottomSheetRef={addingAddress}
        snapPointsCustom={snapPointAdding}></AppBottomSheet>

      <TouchableOpacity style={styles.buttonAddingNew}>
        <Text style={styles.textButtonStyle}>Thêm mới</Text>
      </TouchableOpacity>
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
  });
