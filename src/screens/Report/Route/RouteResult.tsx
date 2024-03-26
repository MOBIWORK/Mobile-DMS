import React, { useEffect, useRef, useState } from 'react';
import { MainLayout } from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import { AppContainer, SvgIcon } from '../../../components/common';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { CommonUtils } from '../../../utils';
import { ApiConstant, AppConstant } from '../../../const';
import { useTranslation } from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import { IFilterType } from '../../../components/common/FilterListComponent';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import RouterResutlLoading from './Loading/RouterResutlLoading';
import { ReportService } from '../../../services';
import { KeyAbleProps, ReportRouterResultType } from '../../../models/types';




const RouteResult = () => {

  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { t: getLabel } = useTranslation();
  const styles = createStyle(theme);
  const [isLoading, setLoading] = useState<boolean>(false);
  const filerBottomSheetRef = useRef<BottomSheet>(null);
  const [reportRouter ,setReportRouter] = useState<ReportRouterResultType | any>();
  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );
  const [from_date,setFromDate] = useState<number>(new Date().getTime());
  const [to_date,setToDate] = useState<number>(new Date().getTime());

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


  const _renderProcess = () => {
    return (
      <View style={styles.processContainer}>
        <ProgressCircle
          percent={reportRouter ?  reportRouter.so_kh_da_vt / reportRouter.so_kh_phai_vt : 0}
          radius={80}
          borderWidth={30}
          color={theme.colors.action}
          shadowColor={theme.colors.bg_disable}
          bgColor={theme.colors.bg_default}>
          <View>
            <Text style={[styles.textProcess]}>
              {reportRouter ? `${reportRouter.so_kh_da_vt} / ${reportRouter.so_kh_phai_vt}` : ""}
            </Text>
          </View>
        </ProgressCircle>
        <Text style={[styles.checkinDesc]}>
          {getLabel("numberToVisit")}
        </Text>
      </View>
    );
  };

  const _renderSales = () => {
    return (
      <View
        style={[
          styles.processContainer,
          { flexDirection: 'row', justifyContent: 'flex-start' },
        ]}>
        <SvgIcon source={'Money'} size={40} />
        <View style={{ rowGap: 4, marginLeft: 8 }}>
          <Text style={styles.txt12}>{getLabel("sales")}</Text>
          <Text style={styles.txt18}>
            {CommonUtils.convertNumber(reportRouter?.doanh_so || 0)}
          </Text>
        </View>
      </View>
    );
  };

  const _renderVisitReport = () => {
    const Item = (item: VisitReportDataType) => {
      return (
        <View style={styles.visitReportContainer}>
          <Text style={styles.txt12}>{item.label}</Text>
          <Text style={styles.txt18}>{reportRouter ? reportRouter[item.keyData] : ""}</Text>
        </View>
      );
    };
    return (
      <FlatList
        data={VisitReportData}
        renderItem={({ item }) => Item(item)}
        numColumns={2}
      />
    );
  };


  const fetchData = async () =>{
      setLoading(true);
      const {status,data}:KeyAbleProps = await ReportService.getRouterResult({
        from_date : from_date / 1000,
        to_date : to_date / 1000
      })
      setLoading(false);
      if(status === ApiConstant.STT_OK) {
        setReportRouter(data.result)
      }
  }

  useEffect(()=>{
    fetchData()
  },[from_date,to_date])

  return (
    <MainLayout style={{ backgroundColor: theme.colors.bg_neutral }}>
      <ReportHeader
        title={getLabel("resultRouter")}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      {isLoading ? <RouterResutlLoading /> :
        <AppContainer style={{ marginBottom: bottom }}>
          {_renderProcess()}
          {_renderSales()}
          {_renderVisitReport()}
        </AppContainer>
      }
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};
export default RouteResult;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    processContainer: {
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    textProcess: {
      fontSize: 20,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    checkinDesc: {
      marginTop: 16,
      fontWeight: '500',
      color: theme.colors.text_secondary,
    } as TextStyle,
    txt12: {
      color: theme.colors.text_secondary,
      fontSize: 12,
    } as TextStyle,
    txt18: {
      color: theme.colors.text_primary,
      fontSize: 18,
      fontWeight: '500',
    } as TextStyle,
    visitReportContainer: {
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: AppConstant.WIDTH * 0.43,
      height: 100,
      marginHorizontal: 8,
    } as ViewStyle,
  });
type VisitReportDataType = {
  label: string;
  keyData: string;
};
const VisitReportData: VisitReportDataType[] = [
  {
    label: 'Viếng thăm đúng tuyến',
    keyData: "vt_dung_tuyen",
  },
  {
    label: 'Viếng thăm khác tuyến',
    keyData: "vt_ngoai_tuyen",
  },
  {
    label: 'Viếng thăm không có đơn',
    keyData: "vieng_tham_ko_don",
  },
  {
    label: 'Viếng thăm có hình ảnh',
    keyData: "vieng_tham_co_anh",

  },
  {
    label: 'Viếng thăm không có hình ảnh',
    keyData: "vieng_tham_ko_anh",
  },
];
