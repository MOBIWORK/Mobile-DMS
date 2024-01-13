import React, {FC, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {AppContainer, SvgIcon} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ReportCustomerType} from '../../../models/types';
import {CommonUtils} from '../../../utils';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {IFilterType} from '../../../components/common/FilterListComponent';
const NewCustomer = () => {
  const theme = useTheme();
  const styles = createStyle(theme);
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );

  const [newCustomerData, setNewCustomerData] =
    useState<ReportCustomerType[]>(NewCustomerDataFake);

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      setHeaderDate(getLabel(String(item.value)));
    }
  };

  const onChangeDateCalender = (date: any) => {
    setHeaderDate(CommonUtils.convertDate(Number(date)));
  };

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
          <Text style={styles.txt12}>Tổng khách hàng mới</Text>
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
          <RowItem
            label={'Loại khách hàng'}
            content={item.customerType ?? '---'}
          />
          <RowItem
            label={'Nhóm khách hàng'}
            content={item.customerGroup ?? '---'}
          />
          <RowItem label={'Kênh'} content={item.channel ?? '---'} />
          <RowItem
            label={'Ngày thu thập'}
            content={
              item.collectionDate
                ? CommonUtils.convertDate(item.collectionDate)
                : '---'
            }
          />
        </View>
      );
    };
    return (
      <>
        {newCustomerData.map((item, index) => {
          return <View key={index}>{Item(item)}</View>;
        })}
      </>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Khách hàng mới'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <AppContainer style={{marginTop: 24, marginBottom: bottom}}>
        {_renderTotal()}
        {_renderContent()}
      </AppContainer>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};
interface RowProps {
  label: string;
  content: string | number;
}
export default NewCustomer;
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
  });

const NewCustomerDataFake: ReportCustomerType[] = [
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: 'Hà Nội',
    customerType: 'Công ty',
    customerGroup: 'Thân thiết',
    channel: null,
    collectionDate: new Date().getTime(),
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: null,
    customerType: 'Công ty',
    customerGroup: 'Thân thiết',
    channel: null,
    collectionDate: new Date().getTime(),
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: null,
    customerType: 'Công ty',
    customerGroup: 'Thân thiết',
    channel: null,
    collectionDate: new Date().getTime(),
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    address: 'Hà Nội',
    customerType: 'Công ty',
    customerGroup: 'Thân thiết',
    channel: null,
    collectionDate: new Date().getTime(),
  },
];
