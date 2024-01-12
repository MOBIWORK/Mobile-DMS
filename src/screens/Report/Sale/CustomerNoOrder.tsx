import React, {FC, useState} from 'react';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {AppContainer, SvgIcon} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ReportCustomerType} from '../../../models/types';
const CustomerNoOrder = () => {
  const theme = useTheme();
  const styles = createStyle(theme);
  const {bottom} = useSafeAreaInsets();

  const [customerNoOrderData, setCustomerNoOrder] = useState<
    ReportCustomerType[]
  >(CustomerNoOrderDataFake);

  const RowItem: FC<RowProps> = ({label, content}) => {
    return (
      <View style={styles.row}>
        <Text style={styles.txt12}>{label}</Text>
        <Text style={{color: theme.colors.text_primary}}>{content ?? ''}</Text>
      </View>
    );
  };

  const _renderTotal = () => {
    return (
      <View style={styles.totalContainer}>
        <SvgIcon source={'UserGroup2'} size={40} />
        <View style={{marginLeft: 8, rowGap: 4}}>
          <Text style={styles.txt12}>Tổng số khách hàng</Text>
          <Text style={styles.txt18}>15</Text>
        </View>
      </View>
    );
  };

  const _renderContent = () => {
    const Item = (item: ReportCustomerType) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.name}</Text>
            <Text style={{color: theme.colors.text_primary}}>KH - 1233</Text>
          </View>
          <RowItem label={'Địa chỉ'} content={item.address ?? '---'} />
          <RowItem label={'Đặt lần cuối'} content={item.lastOrder ?? '---'} />
          <View style={styles.date}>
            <Text style={{color: theme.colors.text_primary}}>20 ngày</Text>
          </View>
        </View>
      );
    };
    return (
      <>
        {customerNoOrderData.map((item, index) => {
          return <View key={index}>{Item(item)}</View>;
        })}
      </>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Khách hàng chưa phát sinh đơn'}
        date={new Date().getTime()}
        onSelected={() => console.log('123')}
      />
      <AppContainer style={{marginTop: 24, marginBottom: bottom}}>
        {_renderTotal()}
        {_renderContent()}
      </AppContainer>
    </MainLayout>
  );
};
interface RowProps {
  label: string;
  content: string | number;
}
export default CustomerNoOrder;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    totalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: theme.colors.bg_default,
      padding: 16,
      borderRadius: 16,
    } as ViewStyle,
    txt12: {
      fontSize: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
    txt18: {
      fontSize: 18,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    visitContainer: {
      marginTop: 16,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      rowGap: 8,
    } as ViewStyle,
    titleVisit: {
      rowGap: 4,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
    } as ViewStyle,
    txtTitleName: {
      fontSize: 16,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    date: {
      padding: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.bg_neutral,
      alignSelf: 'flex-end',
    } as ViewStyle,
  });
const CustomerNoOrderDataFake: ReportCustomerType[] = [
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: null,
    lastOrder: '24/11/2023',
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: 'Hà Đông, Hà Nội',
    lastOrder: '24/11/2023',
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: null,
    lastOrder: '24/11/2023',
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: null,
    lastOrder: '24/11/2023',
  },
];
