import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../navigation/screen-type';
import {
  AppBottomSheet,
  AppHeader,
  Block,
  SvgIcon,
} from '../../components/common';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {AppTheme, useTheme} from '../../layouts/theme';
import {Address, Contact, Overview} from './screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import FormAddress from '../Customer/components/FormAddress';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {AppConstant} from '../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {goBack} from '../../navigation/navigation-service';
import {useSelector} from '../../config/function';
import {shallowEqual} from 'react-redux';
import {dispatch} from '../../utils/redux';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {CustomerService} from '../../services';

const DetailCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const layout = useWindowDimensions();
  const {t: getLabel} = useTranslation();

  const params = useRoute<RouterProp<'DETAIL_CUSTOMER'>>().params;
  const navigation = useNavigation<NavigationProp>();
  const addingAddress = useRef<BottomSheetMethods>();
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const [show, setShow] = useState(false);
  const [isPending, startTrans] = useTransition();
  const appLoading = useSelector(state => state.app.loadingApp, shallowEqual);
  const data = useRef<any>(null);

  const snapPointAdding = useMemo(
    () =>
      typeFilter === AppConstant.CustomerFilterType.dia_chi
        ? ['100%']
        : typeFilter === AppConstant.CustomerFilterType.nguoi_lien_he
        ? ['60%']
        : ['40%'],
    [typeFilter],
  );
  const routes = useRef([
    {key: 'first', title: getLabel('overview')},
    {key: 'second', title: getLabel('address')},
    {key: 'third', title: getLabel('contact')},
  ]).current;

  React.useEffect(() => {
    let mounted = true;
    dispatch(appActions.onLoadApp());
    const getDetailCustomer = async () => {
      let res: any = await CustomerService.getCustomerDetail(
        params.data.customer_name,
      );
      if (res.message === 'ok' || Object.keys(res.result).length > 0) {
        data.current = res.result;
      }
    };

    getDetailCustomer();
    dispatch(appActions.onLoadAppEnd());
    return () => {
      mounted = false;
    };
  }, []);

  const renderScene = React.useCallback(
    SceneMap({
      first: () => (
        <Overview
          data={
            data.current != null && Object.keys(data.current).length > 0
              ? data.current
              : params.data
          }
        />
      ),
      second: () =>
        isPending ? (
          <Block block justifyContent="center" alignItems="center">
            {' '}
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Block>
        ) : (
          <Address
            onPressAdding={onPressAdding}
            data={
              data.current != null && Object.keys(data.current).length > 0
                ? data.current
                : params.data
            }
          />
        ),
      third: () =>
        isPending ? (
          <Block block justifyContent="center" alignItems="center">
            {' '}
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Block>
        ) : (
          <Contact
            onPressAdding={onPressAddingContact}
            data={
              data.current != null && Object.keys(data.current).length > 0
                ? data.current
                : params.data
            }
          />
        ),
    }),
    [data.current],
  );

  const indexView = useRef<number>(0);

  const onPressAdding = () => {
    setTypeFilter(AppConstant.CustomerFilterType.dia_chi);
    addingAddress.current?.snapToIndex(0);
  };

  const onPressAddingContact = () => {
    setTypeFilter(AppConstant.CustomerFilterType.nguoi_lien_he);
    addingAddress.current?.snapToIndex(0);
  };

  const renderTabBar = useCallback((props: any) => {
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
  }, []);

  const onIndexChange = useCallback(
    (index: number) => {
      startTrans(() => {
        indexView.current = index;
      });
    },
    [indexView.current],
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.labelHeader}>
        <AppHeader
          label={getLabel('customerDetail')}
          style={{backgroundColor: theme.colors.bg_default}}
          onBack={() => goBack()}
          rightButton={
            <View style={styles.containIcon}>
              <SvgIcon source="IconKebab" size={20} />
            </View>
          }
        />
      </View>
      {appLoading ? (
        <Block block justifyContent="center" alignItems="center">
          {' '}
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Block>
      ) : (
        <>
          <TabView
            onIndexChange={onIndexChange}
            navigationState={{
              index: indexView.current,
              routes: routes,
            }}
            swipeEnabled={true}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            lazyPreloadDistance={2}
            lazy={true}
            animationEnabled={true}
            initialLayout={{width: layout.width}}
          />
        </>
      )}

      <AppBottomSheet
        bottomSheetRef={addingAddress}
        snapPointsCustom={snapPointAdding}>
        <FormAddress
          onPressClose={() => {
            addingAddress.current?.close();
            setShow(false);
          }}
          typeFilter={typeFilter}
          listData={[] as any}
          setData={() => {}}
        />
      </AppBottomSheet>
    </SafeAreaView>
  );
};

export default React.memo(DetailCustomer, isEqual);

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
    labelHeader: {
      marginHorizontal: 16,
      marginBottom: 20,
    } as ViewStyle,
  });
