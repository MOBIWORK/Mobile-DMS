import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {NavigationProp} from '../../../navigation';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {MainLayout} from '../../../layouts';
import {AppContainer, AppHeader} from '../../../components/common';
import {VisitListItemType} from '../../../models/types';
import Detail from './Detail';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Report from './Report';

const Index = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();

  const DetailScreen = () => (
    <AppContainer style={{marginBottom: bottom}}>
      <View style={{flex: 1, padding: 16}}>
        <Detail item={ItemFake} />
      </View>
    </AppContainer>
  );

  const ReportScreen = () => (
    <View style={{flex: 1, padding: 16}}>
      <Report />
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
    </MainLayout>
  );
};
export default Index;
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
  },
  textTabBar: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  indicatorStyle: {
    padding: 1.5,
    marginBottom: -2,
  },
});

const ItemFake: VisitListItemType = {
  label: "McDonald's",
  useName: 'Chu Quỳnh Anh',
  status: true,
  address:
    'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
  phone_number: '+84 234 234 456',
  lat: 37.789839,
  long: -122.4667,
  distance: 1.5,
};
