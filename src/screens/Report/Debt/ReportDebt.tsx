import React, {FC, useMemo, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import ReportHeader from '../Component/ReportHeader';
import PieChart from 'react-native-pie-chart';
import {AppConstant} from '../../../const';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {CommonUtils} from '../../../utils';
import {ReportDebtTotalType} from '../../../models/types';
import {AppBottomSheet, AppContainer} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

const ReportDebt = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const styles = createStyle(theme);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [debtData, setDebtData] =
    useState<ReportDebtTotalType[]>(ReportDebtDataFake);
  const [filterTypeData, setFilterTypeData] = useState<IFilterType[]>(
    CustomerTypeFilterData,
  );
  const [filterGroupData, setFilterGroupData] = useState<IFilterType[]>(
    CustomerGroupFilterData,
  );
  const [isFilterType, setFilterType] = useState<boolean>(true);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const customerTypeLabel = useMemo(() => {
    const selected = filterTypeData.filter(item => item.isSelected);
    return getLabel(selected[0].label);
  }, [filterTypeData]);

  const customerGroupLabel = useMemo(() => {
    const selected = filterGroupData.filter(item => item.isSelected);
    return getLabel(selected[0].label);
  }, [filterGroupData]);

  const handleItemFilter = (item: IFilterType) => {
    if (isFilterType) {
      const newData = filterTypeData.map(filterTypeItem => {
        if (item.value === filterTypeItem.value) {
          return {...filterTypeItem, isSelected: true};
        } else {
          return {...filterTypeItem, isSelected: false};
        }
      });
      setFilterTypeData(newData);
    } else {
      const newData = filterGroupData.map(filterGroupItem => {
        if (item.value === filterGroupItem.value) {
          return {...filterGroupItem, isSelected: true};
        } else {
          return {...filterGroupItem, isSelected: false};
        }
      });
      setFilterGroupData(newData);
    }
  };

  const _renderChart = () => {
    const chartSize = AppConstant.WIDTH * 0.5;
    const series = [1, 1];
    const sliceColor = [theme.colors.success, theme.colors.warning];

    const NoteItem = (isPaid: boolean, money: number) => {
      return (
        <View style={styles.noteItemContainer}>
          <View style={styles.rowFlexStart}>
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: isPaid
                  ? theme.colors.success
                  : theme.colors.warning,
              }}
            />
            <Text style={{marginLeft: 8, color: theme.colors.text_secondary}}>
              {isPaid ? 'Đã trả' : 'Còn lại'}
            </Text>
          </View>
          <Text style={styles.txt16}>{CommonUtils.convertNumber(money)}</Text>
        </View>
      );
    };

    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            width: chartSize,
            height: chartSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PieChart
            widthAndHeight={chartSize}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.7}
          />
          <View
            style={{
              position: 'absolute',
              rowGap: 4,
            }}>
            <Text style={styles.txt12}>Tổng</Text>
            <Text style={styles.txtNumberMoney}>
              {CommonUtils.convertNumber(800000000)}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 16, rowGap: 12}}>
          {NoteItem(true, 400000000)}
          {NoteItem(false, 400000000)}
        </View>
      </View>
    );
  };

  const _renderFilter = () => {
    const Item = (isCustomerType: boolean) => {
      return (
        <TouchableOpacity
          onPress={() => {
            if (isCustomerType) {
              setFilterType(true);
            } else {
              setFilterType(false);
            }
            bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0);
          }}
          style={styles.filterItem}>
          <Text style={{color: theme.colors.text_secondary, fontSize: 16}}>
            {isCustomerType ? 'Loại KH' : 'Nhóm KH'}
            {': '}
            <Text style={{color: theme.colors.text_primary}}>
              {isCustomerType ? customerTypeLabel : customerGroupLabel}
            </Text>
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.filterContainer}>
        {Item(true)}
        {Item(false)}
      </View>
    );
  };

  const _renderListCustomer = () => {
    const RowItem: FC<RowProps> = ({label, content, contentColor}) => {
      return (
        <View style={styles.rowCenter}>
          <Text style={styles.rowItemLabel}>{label}</Text>
          <Text style={{color: contentColor ?? theme.colors.text_primary}}>
            {content ?? '---'}
          </Text>
        </View>
      );
    };

    const CustomerItem = (item: ReportDebtTotalType) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.name}</Text>
            <Text style={{color: theme.colors.text_primary}}>{item.code}</Text>
          </View>
          <View style={{rowGap: 12}}>
            <RowItem label={'Địa chỉ'} content={item.address} />
            <RowItem label={'SĐT'} content={item.phone} />
            <RowItem
              label={'Tổng dư nợ'}
              content={CommonUtils.convertNumber(item.totalDebt)}
            />
            <RowItem
              label={'Đã trả'}
              content={CommonUtils.convertNumber(item.paid)}
              contentColor={theme.colors.success}
            />
            <RowItem
              label={'Còn lại'}
              content={CommonUtils.convertNumber(item.remaining)}
            />
          </View>
        </View>
      );
    };
    return (
      <>
        {debtData.map((item, index) => {
          return <View key={index}>{CustomerItem(item)}</View>;
        })}
      </>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Báo cáo công nợ'}
        date={new Date().getTime()}
        onSelected={() => console.log(123)}
      />
      <AppContainer style={{marginBottom: bottom, marginTop: 24}}>
        {_renderChart()}
        {_renderFilter()}
        {_renderListCustomer()}
      </AppContainer>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: bottom + 16, paddingHorizontal: 16}}
          onLayout={handleContentLayout}>
          <FilterListComponent
            title={isFilterType ? 'Loại khách hàng' : 'Nhóm khách hàng'}
            data={
              isFilterType ? CustomerTypeFilterData : CustomerGroupFilterData
            }
            handleItem={handleItemFilter}
            isSearch={false}
            onClose={() =>
              bottomSheetRef.current && bottomSheetRef.current.close()
            }
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </MainLayout>
  );
};
interface RowProps {
  label: string;
  content: string | number;
  contentColor?: string;
}
export default ReportDebt;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    visitContainer: {
      marginTop: 24,
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
    noteItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: AppConstant.WIDTH * 0.6,
    } as ViewStyle,
    rowFlexStart: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    txt16: {
      fontSize: 16,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    txtNumberMoney: {
      fontSize: 16,
      color: theme.colors.action,
      fontWeight: '500',
    } as TextStyle,
    txt12: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
    rowItemLabel: {
      fontSize: 12,
      color: theme.colors.text_secondary,
      fontWeight: '500',
    } as ViewStyle,
    filterItem: {
      marginTop: 24,
      padding: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 16,
    } as ViewStyle,
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
  });

const ReportDebtDataFake: ReportDebtTotalType[] = [
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    phone: '03291930182',
    address: 'Hà Nội',
    totalDebt: 3000000,
    paid: 100000,
    remaining: 2900000,
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    phone: '03291930182',
    address: 'Hà Nội',
    totalDebt: 3000000,
    paid: 100000,
    remaining: 2900000,
  },
  {
    name: 'Công ty TNHH ABC',
    code: 'KH - 123',
    phone: '03291930182',
    address: 'Hà Nội',
    totalDebt: 3000000,
    paid: 100000,
    remaining: 2900000,
  },
];
const CustomerTypeFilterData: IFilterType[] = [
  {
    label: 'all',
    value: 1,
    isSelected: true,
  },
  {
    label: 'company',
    value: 2,
    isSelected: false,
  },
  {
    label: 'individual',
    value: 3,
    isSelected: false,
  },
];

export const CustomerGroupFilterData: IFilterType[] = [
  {
    label: 'all',
    value: 1,
    isSelected: true,
  },
  {
    label: 'loyal',
    value: 2,
    isSelected: false,
  },
];
