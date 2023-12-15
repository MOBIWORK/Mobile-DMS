import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import React, {useRef} from 'react';
import debounce from 'debounce';
import {ColorSchema, useTheme} from '@react-navigation/native';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {TextInput} from 'react-native-paper';
import {IValueType} from '../Customer';
import {AppConstant} from '../../../const';
import {Colors} from '../../../assets';
import {AppInput} from '../../../components/common';
import AppImage from '../../../components/common/AppImage';
import {IDataCustomer} from '../../../models/types';
import { useTranslation } from 'react-i18next';

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
  const {t:translate} = useTranslation()
  //   const filterRef = useRef<BottomSheetMethods>(null);
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
        label={'Khu Vực'}
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
        onChangeValue={text => debounce(() =>{
          setData(prev => ({...prev, debtLimit: text}));
        },1500)}
      />
      <AppInput
        label={translate('description')}
        value={''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text =>debounce(() => {
          setData(prev => ({...prev, description: text}));
        },1500)}
      />
      <AppInput
        label={translate('websiteUrl')}
        value={''}
        editable={true}
        isRequire={false}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        hiddenRightIcon={true}
        onChangeValue={text => debounce(() => {
            setData(prev => ({...prev, websiteURL: text}))
        },1500)}
      />
    </ScrollView>
  );
};

export default FormAdding;

const rootStyles = (theme: ColorSchema) =>
  StyleSheet.create({
    contentStyle: {
      color: Colors.gray_500,
      fontWeight: '400',
      fontSize: 16,
    } as TextStyle,
    root: {
      // flex:1,
      backgroundColor: theme.colors.bg_default,
      marginVertical: 10,
      // backgroundColor:'red'
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
