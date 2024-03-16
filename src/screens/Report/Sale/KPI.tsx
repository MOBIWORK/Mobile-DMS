import React, {FC, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {ProgressBar} from 'react-native-paper';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {ReportKPIItemType, ReportKPIType} from '../../../models/types';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {CommonUtils} from '../../../utils';
import {AppContainer, SvgIcon} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {IFilterType} from '../../../components/common/FilterListComponent';
import {useTranslation} from 'react-i18next';

const KPI = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const styles = createStyle(theme);

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(getLabel('thisMonth'));
  const [KPIData, setKpiData] = useState<ReportKPIType>(KPIDataFake);

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

  const RowItem: FC<RowProps> = ({label, content, contentColor, icon}) => {
    return (
      <View style={styles.rowCenter}>
        <Text style={styles.txt12}>{label}</Text>
        <View style={styles.rowFlexStart}>
          {icon && icon}
          <Text
            style={{
              color: contentColor ?? theme.colors.text_primary,
              marginLeft: 4,
            }}>
            {content ?? '---'}
          </Text>
        </View>
      </View>
    );
  };

  const KPIItem: FC<KPIItemProps> = ({item}) => {
    return (
      <View style={styles.kpiItemContainer}>
        <Text style={styles.kpiTitle}>{item.title}</Text>
        <RowItem
          label={`${item.progress}%`}
          content={`${item.time} days`}
          icon={
            <SvgIcon
              source={'iconClock'}
              size={16}
              color={theme.colors.text_secondary}
            />
          }
        />
        <ProgressBar
          style={{height: 10, borderRadius: 10}}
          color={theme.colors.success}
          animatedValue={item.progress / 100}
        />
        <RowItem
          label={'Kế hoạch'}
          content={CommonUtils.convertNumber(item.plan)}
        />
        <RowItem
          label={'Thực hiện'}
          content={CommonUtils.convertNumber(item.perform)}
        />
        <RowItem
          label={'Còn lại'}
          content={CommonUtils.convertNumber(item.remaining)}
          contentColor={theme.colors.primary}
        />
      </View>
    );
  };

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Chỉ tiêu KPI'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <AppContainer style={{marginTop: 16, marginBottom: bottom}}>
        <KPIItem item={KPIData.revenue} />
        <KPIItem item={KPIData.sales} />
        <KPIItem item={KPIData.order} />
        <KPIItem item={KPIData.visit} />
      </AppContainer>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
        isKPI
      />
    </MainLayout>
  );
};
interface KPIItemProps {
  item: ReportKPIItemType;
}
interface RowProps {
  label: string;
  content: string | number;
  contentColor?: string;
  icon?: any;
}
export default KPI;
const KPIDataFake: ReportKPIType = {
  revenue: {
    title: 'Doanh thu',
    progress: 65,
    time: 21,
    plan: 10000000,
    perform: 7000000,
    remaining: 3000000,
  },
  sales: {
    title: 'Doanh số',
    progress: 70,
    time: 21,
    plan: 10000000,
    perform: 7000000,
    remaining: 3000000,
  },
  order: {
    title: 'Đơn hàng',
    progress: 50,
    time: 21,
    plan: 100,
    perform: 65,
    remaining: 35,
  },
  visit: {
    title: 'Viếng thăm',
    progress: 65,
    time: 21,
    plan: 50,
    perform: 30,
    remaining: 20,
  },
  newCustomer: {
    title: 'Khách hàng mới',
    progress: 66,
    time: 21,
    plan: 60,
    perform: 40,
    remaining: 20,
  },
};

const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    rowCenter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    rowFlexStart: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    } as ViewStyle,
    txt12: {
      fontSize: 12,
      color: theme.colors.text_secondary,
      fontWeight: '500',
    } as TextStyle,
    kpiItemContainer: {
      rowGap: 12,
      marginVertical: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    kpiTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
  });
