import React, {FC, useEffect, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {ProgressBar} from 'react-native-paper';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {KeyAbleProps, ReportKPIItemType, ReportKPIType, ReportTagerKpiType} from '../../../models/types';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {CommonUtils} from '../../../utils';
import {AppContainer, SvgIcon} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {IFilterType} from '../../../components/common/FilterListComponent';
import {useTranslation} from 'react-i18next';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';
import { ReportService } from '../../../services';
import { ApiConstant } from '../../../const';

const KPI = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const styles = createStyle(theme);

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(getLabel('monthly'));
  const [KPIData, setKpiData] = useState<ReportKPIType>(KPIDataFake);
  const [data,setData] = useState<ReportTagerKpiType>();

  const {from_date : from,to_date : to} = CommonUtils.dateToDate("monthly");

  const [from_date,setFromDate] = useState<number>(new Date(from).getTime());
  const [to_date,setToDate] = useState<number>(new Date(to).getTime());

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      setFromDate(Number(item.value))
      setToDate(Number(item.value))
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      const {from_date ,to_date} = CommonUtils.dateToDate(item.value?.toString() || "");
      setFromDate(new Date(from_date).getTime());
      setToDate(new Date(to_date).getTime());
      setHeaderDate(getLabel(String(item.label)));
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

  useEffect(()=>{

    const getData  = async()=>{
      dispatch(appActions.setProcessingStatus(true))
      const { status, data :res}: KeyAbleProps = await ReportService.getReoprtTagertKpi({
        month: new Date(from_date).getMonth() + 1,
        year: new Date(to_date).getFullYear()
      })
      dispatch(appActions.setProcessingStatus(false))
      if(status == ApiConstant.STT_OK){
        setData(res.result)
      } 
    }
    getData();
  },[from_date,to_date])

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={getLabel("targetKpi")}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <AppContainer style={{marginTop: 16, marginBottom: bottom}}>
        <KPIItem item={{
            title: getLabel("revenue"),
            progress: data ? data.ti_le_doanh_thu : 0,
            time:  data ? data.so_ngay_thuc_hien : 0,
            plan: data ? data.kh_doanh_thu : 0,
            perform: data ? data.th_doanh_thu : 0,
            remaining: data ? data.cl_doanh_thu : 0,
        }} />
        <KPIItem item={{
            title: getLabel("sales"),
            progress: data ? data.ti_le_doanh_so : 0,
            time:  data ? data.so_ngay_thuc_hien : 0,
            plan: data ? data.kh_doanh_so : 0,
            perform: data ? data.th_doanh_so : 0,
            remaining: data ? data.cl_doanh_so : 0,
        }} />
        <KPIItem item={{
            title: getLabel("order"),
            progress:data ? data.ti_le_don_hang : 0,
            time:  data ? data.so_ngay_thuc_hien : 0,
            plan: data ? data.kh_don_hang : 0,
            perform: data ? data.th_don_hang : 0,
            remaining: data ? data.cl_don_hang : 0,
        }} />
        <KPIItem item={{
            title: getLabel("visit"),
            progress: data ? data.ti_le_vieng_tham : 0,
            time:  data ? data.so_ngay_thuc_hien : 0,
            plan: data ? data.kh_vieng_tham : 0,
            perform: data ? data.th_vieng_tham : 0,
            remaining: data ? data.cl_vieng_tham : 0,
        }} />
        <KPIItem item={{
            title: getLabel("newCustomer"),
            progress: data ? data.ti_le_kh_moi : 0,
            time:  data ? data.so_ngay_thuc_hien : 0,
            plan: data ? data.kh_kh_moi : 0,
            perform: data ? data.th_kh_moi : 0,
            remaining: data ? data.cl_kh_moi : 0,
        }} />
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
