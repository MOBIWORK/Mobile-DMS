import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../navigation';
import {AppBottomSheet, AppHeader, SvgIcon} from '../../components/common';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {AppTheme, useTheme} from '../../layouts/theme';
import {Address, Contact, Overview} from './screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import FormAddress from '../Customer/components/FormAddress';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { AppConstant } from '../../const';

const DetailCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const layout = useWindowDimensions();

  const params = useRoute<RouterProp<'DETAIL_CUSTOMER'>>().params;
  const navigation = useNavigation<NavigationProp>();
  const addingAddress = useRef<BottomSheetMethods>();
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const [show, setShow] = useState(false);

  const snapPointAdding = useMemo(
    () =>
      typeFilter === AppConstant.CustomerFilterType.dia_chi
        ? ['100%']
        : typeFilter === AppConstant.CustomerFilterType.nguoi_lien_he
        ? ['60%']
        : ['40%'],
    [typeFilter],
  );
  const [routes] = useState([
    {key: 'first', title: 'Tổng quan'},
    {key: 'second', title: 'Địa chỉ'},
    {key: 'third', title: 'Liên hệ'},
  ]);
  

  const renderScene = React.useCallback(
    SceneMap({
      first: () => <Overview data={params.data} />,
      second: () => <Address onPressAdding={onPressAdding}    />,
      third: () => <Contact onPressAdding={onPressAddingContact}/>,
    }),
    [],
  );

  const [currentIndexView, setCurrentIndexView] = useState(0);

    const onPressAdding = () =>{
      setTypeFilter(AppConstant.CustomerFilterType.dia_chi)
      addingAddress.current?.snapToIndex(0)
    }


    const onPressAddingContact = () =>{
      setTypeFilter(AppConstant.CustomerFilterType.nguoi_lien_he)
      addingAddress.current?.snapToIndex(0)
    }

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        renderLabel={({focused, route}) => {
          return (
            <Text style={[styles.textTabBar(focused)]}>{route.title}</Text>
          );
        }}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBar}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.labelHeader}>
      <AppHeader
        label="Chi tiết khách hàng"
        style={{backgroundColor: theme.colors.bg_default}}
        backButtonIcon={
          <SvgIcon
            source="arrowLeft"
            size={20}
            onPress={() => navigation.goBack()}
          />
        }
        rightButton={
          <View style={styles.containIcon}>
            <SvgIcon source="IconKebab" size={20} />
          </View>
        }
      />
      </View>
    

      <TabView
        onIndexChange={setCurrentIndexView}
        navigationState={{
          index: currentIndexView,
          routes: routes,
        }}
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{width: layout.width}}
      />
       <AppBottomSheet
          bottomSheetRef={addingAddress}
          snapPointsCustom={snapPointAdding}>
          <FormAddress
            onPressClose={() => {
              addingAddress.current?.close();
              setShow(false);
            }}
            typeFilter={typeFilter}
            // setListData={}
          />
        </AppBottomSheet>
    </SafeAreaView>
  );
};

export default React.memo(DetailCustomer);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    textTabBar: (focused: boolean) =>
      ({
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        color: focused ? theme.colors.primary : theme.colors.text_disable,
      } as TextStyle),
    indicatorStyle: {
      backgroundColor: theme.colors.primary,
      padding: 1.5,
      marginBottom: -2,
    },
    tabBar: {
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderColor: theme.colors.bg_default,
    },
    root: {
      backgroundColor: theme.colors.bg_default,
      flex: 1,
    } as ViewStyle,
    containIcon: {
      marginRight: 10,
    } as ViewStyle,
    labelHeader:{
        marginHorizontal:16,
        marginBottom:20

    } as ViewStyle
  });
