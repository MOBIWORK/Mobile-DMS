import React, {useEffect, useRef, useState, useMemo} from 'react';
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
import {VisitListItemType} from '../../../models/types';
import Detail from './Detail';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Report from './Report/Report';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {AppConstant} from '../../../const';
import FilterListComponent from '../../../components/common/FilterListComponent';

const Index = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'VISIT_DETAIL'>>();
  const snapPoints = useMemo(() => ['40%'], []);
 
  const bottomSheetRef = useRef<BottomSheet>(null);

  const DetailScreen = () => (
    <AppContainer style={{marginBottom: bottom}}>
      <View style={{flex: 1, padding: 16}}>
        <Detail item={route.params && route.params.data} />
      </View>
    </AppContainer>
  );

  const ReportScreen = () => (
    <View style={{flex: 1, padding: 16}}>
      <Report
        onOpenReportFilter={() =>
          bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
        }
      />
    </View>
  );

  const renderScene = SceneMap({
    first: DetailScreen,
    second: ReportScreen,
  });

  const [index, setIndex] = useState<number>(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Chi tiết'},
    {key: 'second', title: 'Báo cáo'},
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

  return (
    <MainLayout style={{paddingHorizontal: 0}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        label={'Chi tiết viếng thăm'}
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
        snapPointsCustom={snapPoints}
        // contentHeight={animatedContentHeight}
       >
        <FilterListComponent
          title={'Thời gian'}
          data={AppConstant.SelectedDateFilterData}
          handleItem={item => console.log(item)}
          onClose={() =>
            bottomSheetRef.current && bottomSheetRef.current.close()
          }
        />
      </AppBottomSheet>
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


