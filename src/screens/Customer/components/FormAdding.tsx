import {StyleSheet, Text, TextStyle, View,ScrollView, ViewStyle} from 'react-native';
import React, {useRef} from 'react';
import {IValueType} from '../Customer';
import {AppConstant} from '../../../const';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ColorSchema, useTheme} from '@react-navigation/native';
import {Colors} from '../../../assets';
import {TextInput} from 'react-native-paper';
import { AppInput} from '../../../components/common';


type Props = {
  filterRef: React.RefObject<BottomSheetMethods>;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  valueFilter: IValueType;
  onChange:(value:string) => void,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  valueDate:Date | any
  
};

const FormAdding = (props: Props) => {
  const {filterRef, setTypeFilter, valueFilter,onChange,setOpen,valueDate} =
    props;
  const theme = useTheme();
  const styles = rootStyles(theme);

  //   const filterRef = useRef<BottomSheetMethods>(null);
  return (
    <ScrollView style={styles.root}>
      <AppInput
        label="Tên khách hàng"
        value={'Tên khách'}
        editable={true}
        hiddenRightIcon={true}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onChangeValue={onChange}
      />
      <AppInput
        label={'Loại khách hàng'}
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
        label={'Nhóm khách hàng'}
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
        label={'Sinh nhật'}
        value={valueDate}
        editable={false}
        isRequire={true}
        contentStyle={styles.contentStyle}
        styles={{marginBottom: 20}}
        onPress={() => {
          setOpen(true)
        }}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={theme.colors.text_secondary}
          />
        }
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
    root:{  
        // flex:1,
        backgroundColor:theme.colors.bg_default
        // backgroundColor:'red'

    }as ViewStyle
  });
