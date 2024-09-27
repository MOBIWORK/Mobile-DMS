import React, {useRef, useState, useMemo, useTransition} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {NavigationProp, RouterProp} from '../../../navigation/screen-type';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {AppHeader, Block} from '../../../components/common';
import Detail from './Detail';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Report from './Report/Report';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import {CustomerService} from '../../../services';
import {ItemNoteVisitDetail, IVisitRouteDetail} from '../../../models/types';
import {useDeepCompareEffect} from '../../../config/function';

import isEqual from 'react-fast-compare';
import {useDispatch} from 'react-redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {ApiConstant} from '../../../const';

const Index = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'VISIT_DETAIL'>>();
  const dispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isPending, startEffect] = useTransition();

  const [filterTime, setFilterTime] = useState<string>(
    `${getLabel('today')}, ${moment(new Date()).format('DD/MM/YYYY')}`,
  );

  const [detailData, setDetailData] = useState<IVisitRouteDetail>();
  const [noteData, setNoteData] = useState<ItemNoteVisitDetail[]>([]);

  const DetailScreen = React.memo(
    () => (
      <Block block style={{marginBottom: bottom}} padding={16}>
        {isPending ? (
          <Block block justifyContent="center" alignItems="center">
            {' '}
            <ActivityIndicator size={'large'} color={colors.primary} />{' '}
          </Block>
        ) : (
          <Detail
            item={route.params && route.params.data}
            otherInfo={detailData}
            noteData={noteData}
          />
        )}
      </Block>
    ),
    isEqual,
  );

  const ReportScreen = React.memo(
    () => (
      <Block block padding={16}>
        <Report
          onOpenReportFilter={() =>
            bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
          }
          timeLabel={filterTime}
          itemData={route.params.data}
        />
      </Block>
    ),
    isEqual,
  );

  const renderScene = SceneMap({
    first: DetailScreen,
    second: ReportScreen,
  });

  const index = useRef<number>(0);
  const routes = React.useRef([
    {key: 'first', title: getLabel('detail')},
    {key: 'second', title: getLabel('report')},
  ]).current;

  const renderTabBar = React.useCallback((props: any) => {
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
  }, []);

  useDeepCompareEffect(() => {
    const getDetail = async (customer_name: string) => {
      dispatch(appActions.setProcessingStatus(true));
      const response: any = await CustomerService.getVisitRouteDetail(
        customer_name,
      );
      if (Object.keys(response?.result).length > 0) {
        setDetailData(response.result);
      }
      const noteResponse: any = await CustomerService.getListCheckinNote(
        route.params?.data?.customer_code,
      );
      if (noteResponse?.status === ApiConstant.STT_OK) {
        setNoteData(noteResponse.data.result.data);
      }

      dispatch(appActions.setProcessingStatus(false));
    };
    startEffect(() => {
      getDetail(route.params.data.name);
    });
  }, []);

  const onIndexChange = React.useCallback(
    (indx: number) => {
      startEffect(() => {
        index.current = indx;
      });
    },
    [index.current],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        label={getLabel('visitDetail')}
        onBack={() => navigation.goBack()}
      />
      {isPending ? (
        <Block
          block
          justifyContent="center"
          alignItems="center"
          colorTheme="primary">
          <ActivityIndicator size="large" color={colors.primary} />{' '}
        </Block>
      ) : (
        <TabView
          style={{backgroundColor: colors.bg_neutral}}
          onIndexChange={onIndexChange}
          navigationState={{index: index.current, routes}}
          renderScene={renderScene}
          initialLayout={{width: layout.width}}
          lazy
          lazyPreloadDistance={1}
          renderTabBar={renderTabBar}
        />
      )}

      {/*<AppBottomSheet*/}
      {/*  bottomSheetRef={bottomSheetRef}*/}
      {/*  snapPointsCustom={snapPoints}>*/}
      {/*  <FilterListComponent*/}
      {/*    title={getLabel('time')}*/}
      {/*    data={filterData}*/}
      {/*    handleItem={handleItem}*/}
      {/*    onClose={() =>*/}
      {/*      bottomSheetRef.current && bottomSheetRef.current.close()*/}
      {/*    }*/}
      {/*  />*/}
      {/*</AppBottomSheet>*/}
      {/*<DatePickerModal*/}
      {/*  locale={languageCode ?? 'vi'}*/}
      {/*  mode="single"*/}
      {/*  startYear={2010}*/}
      {/*  visible={openDate}*/}
      {/*  label={getLabel('selectDate')}*/}
      {/*  onDismiss={onDismissSingle}*/}
      {/*  date={date}*/}
      {/*  onConfirm={onConfirmSingle}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};
export default React.memo(Index, isEqual);
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
