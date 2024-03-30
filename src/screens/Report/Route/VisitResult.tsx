import React, {FC, useEffect, useRef, useState} from 'react';
import {AppSegmentedButtonsType} from '../../../components/common/AppSegmentedButtons';
import {AppContainer, TabSelected, SvgIcon} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import ReportHeader from '../Component/ReportHeader';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {CommonUtils} from '../../../utils';
import {KeyAbleProps, VisitCheckinReport, VisitReportNoCheckin, VisitedItemType} from '../../../models/types';
import ReportFilterBottomSheet from '../Component/ReportFilterBottomSheet';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import {IFilterType} from '../../../components/common/FilterListComponent';
import { ReportService } from '../../../services';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';


const VisitResult = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const styles = createStyle(theme);

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>(dataSeg);
  const [selectedValue, setSelectedValue] = useState<number | string>(
    dataSeg[0].value,
  );
  const [from_date,setFromDate] = useState<number>(new Date().getTime());
  const [to_date,setToDate] = useState<number>(new Date().getTime());
  
  const [data, setData] = useState<VisitCheckinReport>()
  const [visitedData, setVisitedData] = useState<VisitedItemType[]>([]);
  const [notVisitData, setNotVisitData] = useState<VisitReportNoCheckin[]>([]);

  const [headerDate, setHeaderDate] = useState<string>(`${getLabel('today')}, ${CommonUtils.convertDate(from_date)}`,);

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

  const changeIndex = (value: string | number) => {
    setSelectedValue(value);
    const newSegData = segData.map(item => {
      if (value === item.value) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setSegData(newSegData);
  };

  const VisitedRowItem: FC<VisitRowProps> = ({
    label,
    content,
    contentColor,
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 12, color: theme.colors.text_secondary}}>
          {label}
        </Text>
        <Text style={{color: contentColor ?? theme.colors.text_primary}}>
          {content ?? ''}
        </Text>
      </View>
    );
  };

  const NotVisitRowItem: FC<NotVisitRowProps> = ({iconName, content}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <SvgIcon
          source={iconName as any}
          size={16}
          color={theme.colors.text_primary}
        />
        <Text style={{marginLeft: 4, color: theme.colors.text_primary}}>
          {content}
        </Text>
      </View>
    );
  };

  const _renderTotal = () => {
    return (
      <View style={styles.totalContainer}>
        <View style={styles.itemTotal}>
          <SvgIcon source={'Visited'} size={40} />
          <Text style={styles.txt12}>{getLabel("visit")}</Text>
          <Text style={styles.txt18}>{data?.so_kh_da_vt}</Text>
        </View>
        <View style={styles.itemTotal}>
          <SvgIcon source={'NotVisit'} size={40} />
          <Text style={styles.txt12}>{getLabel("notVisited")}</Text>
          <Text style={styles.txt18}>{data?.so_kh_chua_vt}</Text>
        </View>
      </View>
    );
  };

  const _renderTotalSales = () => {
    return (
      <View style={styles.saleContainer}>
        <SvgIcon source={'Money'} size={40} />
        <View style={{rowGap: 4, marginLeft: 8}}>
          <Text style={styles.txt12}>Tổng doanh thu</Text>
          <Text style={styles.txt18}>
            {CommonUtils.convertNumber(data?.doanh_so || 0)}
          </Text>
        </View>
      </View>
    );
  };

  const _renderVisited = () => {
    const visitedItem = (item: VisitedItemType) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.name}</Text>
            <Text style={{color: theme.colors.text_primary}}>KH - 1233</Text>
          </View>
          <VisitedRowItem label={getLabel("time")} content={item.checkin_giovao} />
          <VisitedRowItem
            label={''}
            content={CommonUtils.convertDate(item.checkin_giovao || "")}
          />
          <VisitedRowItem
            label={getLabel("gland")}
            content={item.checkin_dungtuyen > 0 ? getLabel("inRoute") : getLabel("outRoute")}
            contentColor={item.checkin_dungtuyen > 0 ? theme.colors.text_primary : theme.colors.primary}
          />
          <VisitedRowItem label={getLabel("image")} content={item.checkin_hinhanh} />
          <VisitedRowItem
            label={getLabel("putOrder")}
            content={item.checkin_donhang > 0 ? getLabel("ys") : getLabel("no")}
          />
          <VisitedRowItem
            label={getLabel("sales")}
            content={CommonUtils.convertNumber(item.doanh_so || 0)}
          />
        </View>
      );
    };
    return (
      <>
        {visitedData.map((item, index) => {
          return <View key={index}>{visitedItem(item)}</View>;
        })}
      </>
    );
  };

  const _renderNotVisit = () => {
    const notVisitItem = (item: VisitReportNoCheckin) => {
      return (
        <View style={styles.visitContainer}>
          <View style={styles.titleVisit}>
            <Text style={styles.txtTitleName}>{item.customer_name}</Text>
            <Text style={{color: theme.colors.text_primary}}>{item.customer_code}</Text>
          </View>
          <NotVisitRowItem iconName={'MapPin'} content={item.display_address} />
          <NotVisitRowItem iconName={'Phone'} content={item.phone_number} />
          <NotVisitRowItem iconName={'Folder'} content={""} />
        </View>
      );
    };
    return (
      <>
        {notVisitData.map((item, index) => {
          return <View key={index}>{notVisitItem(item)}</View>;
        })}
      </>
    );
  };

  useEffect(()=>{
      const getData = async ()=>{
      dispatch(appActions.setProcessingStatus(true))

        const {data,status} :KeyAbleProps = await ReportService.getVisitReoprt({
          from_date : from_date / 1000 ,
          to_date : to_date / 1000
        })
      dispatch(appActions.setProcessingStatus(false))

        const result =data.result
        setData(result.data);
        setVisitedData(result.has_checkin);
        setNotVisitData(result.not_checkin);
      }
      getData();
  },[from_date,to_date])

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <ReportHeader
        title={'Báo cáo viếng thăm'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <AppContainer style={{marginTop: 24, marginBottom: bottom}}>
        {_renderTotal()}
        {_renderTotalSales()}
        <TabSelected
          style={{marginTop: 24}}
          data={segData}
          onChange={changeIndex}
        />
        {selectedValue === 1 ? _renderVisited() : _renderNotVisit()}
      </AppContainer>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
        onChangeDateCalender={onChangeDateCalender}
      />
    </MainLayout>
  );
};
interface VisitRowProps {
  label: string;
  content?: string | number;
  contentColor?: string;
}

interface NotVisitRowProps {
  iconName: string;
  content?: string;
}
export default VisitResult;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    totalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    itemTotal: {
      flex: 0.47,
      rowGap: 12,
      paddingHorizontal: 12,
      paddingVertical: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    },
    txt12: {
      fontSize: 12,
      color: theme.colors.text_secondary,
    } as TextStyle,
    txt18: {
      fontSize: 18,
      color: theme.colors.text_primary,
      fontWeight: '500',
    } as TextStyle,
    saleContainer: {
      flexDirection: 'row',
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
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
const dataSeg: AppSegmentedButtonsType[] = [
  {
    title: 'visited',
    value: 1,
    isSelected: true,
  },
  {
    title: 'notVisited',
    value: 2,
    isSelected: false,
  },
];
