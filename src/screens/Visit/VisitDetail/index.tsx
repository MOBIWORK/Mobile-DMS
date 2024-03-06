import React, {useRef, useState, useMemo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {NavigationProp, RouterProp} from '../../../navigation';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {MainLayout} from '../../../layouts';
import {
  AppBottomSheet,
  AppContainer,
  AppHeader,
} from '../../../components/common';
import Detail from './Detail';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Report from './Report/Report';
import BottomSheet from '@gorhom/bottom-sheet';
import {AppConstant} from '../../../const';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import moment from 'moment';
import {CommonUtils} from '../../../utils';
import {DatePickerModal} from 'react-native-paper-dates';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import {useMMKVString} from 'react-native-mmkv';
import {CustomerService} from '../../../services';
import {IVisitRouteDetail} from '../../../models/types';

const Index = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'VISIT_DETAIL'>>();
  const snapPoints = useMemo(() => ['30%'], []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [languageCode] = useMMKVString(AppConstant.Language_Code);

  const [openDate, setOpenDate] = React.useState<boolean>(false);
  const [date, setDate] = useState<Date>();

  const [filterTime, setFilterTime] = useState<string>(
    `${getLabel('today')}, ${moment(new Date()).format('DD/MM/YYYY')}`,
  );
  const [filterData, setFilterData] = useState<IFilterType[]>(
    AppConstant.SelectedDateFilterData,
  );

  const [detailData, setDetailData] = useState<IVisitRouteDetail>();

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      setDate(params.date);
      setFilterTime(`${moment(params.date).format('DD/MM/YYYY')}`);
      const newData = filterData.map(filter => {
        if (filter.value === 4) {
          return {...filter, isSelected: true};
        } else {
          return {...filter, isSelected: false};
        }
      });
      setFilterData(newData);
    },
    [setOpenDate, setDate],
  );

  const renderFilterLabel = (value: any) => {
    switch (value) {
      case 1:
        return `${getLabel('today')}, ${moment(new Date()).format(
          'DD/MM/YYYY',
        )}`;
      case 2: {
        const timeObj: any = CommonUtils.dateToDate('weekly');
        return `${moment(new Date(timeObj.from_date)).format(
          'DD/MM/YYYY',
        )} - ${moment(new Date(timeObj.to_date)).format('DD/MM/YYYY')}`;
      }

      case 3: {
        const timeObj: any = CommonUtils.dateToDate('monthly');
        return `${moment(new Date(timeObj.from_date)).format(
          'DD/MM/YYYY',
        )} - ${moment(new Date(timeObj.to_date)).format('DD/MM/YYYY')}`;
      }
    }
  };

  const handleItem = (item: IFilterType) => {
    bottomSheetRef.current?.close();
    if (item.value === 4) {
      setOpenDate(true);
    } else {
      const time: any = renderFilterLabel(item.value);
      setFilterTime(time);
      const newData = filterData.map(filter => {
        if (item.value === filter.value) {
          return {...filter, isSelected: true};
        } else {
          return {...filter, isSelected: false};
        }
      });
      setFilterData(newData);
    }
  };

  const DetailScreen = () => (
    <AppContainer style={{marginBottom: bottom}}>
      <View style={{flex: 1, padding: 16}}>
        <Detail
          item={route.params && route.params.data}
          otherInfo={detailData}
        />
      </View>
    </AppContainer>
  );

  const ReportScreen = () => (
    <View style={{flex: 1, padding: 16}}>
      <Report
        onOpenReportFilter={() =>
          bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
        }
        timeLabel={filterTime}
      />
    </View>
  );

  const renderScene = SceneMap({
    first: DetailScreen,
    second: ReportScreen,
  });

  const [index, setIndex] = useState<number>(0);
  const [routes] = React.useState([
    {key: 'first', title: getLabel('detail')},
    {key: 'second', title: getLabel('report')},
  ]);

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        renderLabel={({focused, route}) => {
          return (
            <Text
              style={[
                styles.textTabBar,
                {color: focused ? colors.primary : colors.text_disable},
              ]}>
              {route.title}
            </Text>
          );
        }}
        indicatorStyle={[
          styles.indicatorStyle,
          {backgroundColor: colors.primary},
        ]}
        style={[styles.tabBar, {borderColor: colors.bg_default}]}
      />
    );
  };

  useEffect(() => {
    const getDetail = async (customer_name: string) => {
      const response: any = await CustomerService.getVisitRouteDetail(
        customer_name,
      );
      if (Object.keys(response?.result).length > 0) {
        setDetailData(response.result);
      }
    };
    getDetail(route.params.data.customer_name).then();
  }, []);

  return (
    <MainLayout style={{paddingHorizontal: 0}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        label={getLabel('visitDetail')}
        onBack={() => navigation.goBack()}
      />
      <TabView
        style={{backgroundColor: colors.bg_neutral}}
        onIndexChange={setIndex}
        navigationState={{index, routes}}
        renderScene={renderScene}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={snapPoints}>
        <FilterListComponent
          title={getLabel('time')}
          data={filterData}
          handleItem={handleItem}
          onClose={() =>
            bottomSheetRef.current && bottomSheetRef.current.close()
          }
        />
      </AppBottomSheet>
      <DatePickerModal
        locale={languageCode ?? 'vi'}
        mode="single"
        startYear={2010}
        visible={openDate}
        label={getLabel('selectDate')}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
    </MainLayout>
  );
};
export default Index;
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
  } as ViewStyle,
  textTabBar: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  } as ViewStyle,
  indicatorStyle: {
    padding: 1.5,
    marginBottom: -2,
  },
});
