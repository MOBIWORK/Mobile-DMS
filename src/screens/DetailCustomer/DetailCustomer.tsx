import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {RouterProp} from '../../navigation/screen-type';
import {AppHeader, Block, SvgIcon} from '../../components/common';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Modal from 'react-native-modal';
import {AppTheme, useTheme} from '../../layouts/theme';
import {Address, Contact, Overview} from './screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import FormAddress from '../Customer/components/FormAddress';
import {AppConstant, ScreenConstant} from '../../const';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {goBack, navigate} from '../../navigation/navigation-service';
import {CustomerService} from '../../services';
import {useSelector} from '../../config/function';
import {shallowEqual} from 'react-redux';
import { dataCustomer } from '../Report/Statistical/components/data';

const DetailCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const layout = useWindowDimensions();
  const {t: getLabel} = useTranslation();

  const params = useRoute<RouterProp<'DETAIL_CUSTOMER'>>().params;

  const [isPending, startTrans] = useTransition();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState({
    type: AppConstant.CustomerFilterType.loai_khach_hang,
    status: false,
  });
  const isFocus = useIsFocused();
  const indexView = useRef<number>(0);

  const getDetailCustomer = async () => {
    try {
      setLoading(true);
      let res: any = await CustomerService.getCustomerDetail(params?.data.name);
      if (res.message === 'ok' || Object.keys(res.result).length > 0) {
        setData(res.result);
      }
    } catch (err) {
      console.log('[error]: ', err);
    } finally {
      // mounted.current = false;
      setLoading(false);
    }
  };

  // console.log(data,'dataAddress')

  const listData = useSelector(
    state => state.customer.mainAddress,
    shallowEqual,
  );
  // const [dataAddress,setDataAddress] = useState<any>(listData)
  // console.log(dataAddress,'dataAddress')
  useEffect(() => {
    // setLoading(true);
    getDetailCustomer();

    return () => {
      // mounted.current = false;
    };
  }, [isFocus]);

  // console.log(data, 'data customer');

  const routes = useRef([
    {key: 'first', title: getLabel('overview')},
    {key: 'second', title: getLabel('address')},
    {key: 'third', title: getLabel('contact')},
  ]).current;

  const renderScene = React.useCallback(
    SceneMap({
      first: () => (
        // <ErrorBoundary fallbackRender={ErrorFallBack} onError={err => navigate(ScreenConstant.ERROR, {error: err})}   >
        <Overview data={data as any} />
      ),
      second: () => (
        // <ErrorBoundary fallbackRender={ErrorFallBack} onError={err => navigate(ScreenConstant.ERROR, {error: err})}>
        <Address
          onPressAdding={onPressAdding}
          data={data as any}
          listData={data && data?.address ? data.address : []}
        />
      ),
      third: () => (
        // <ErrorBoundary fallbackRender={ErrorFallBack} onError={err => navigate(ScreenConstant.ERROR, {error: err})} >
        <Contact onPressAdding={onPressAddingContact} data={data as any} />
        // </ErrorBoundary>
      ),
    }),
    [data,indexView.current],
  );

  // console.log(data.contact,'data')


  const onPressAdding = useCallback(() => {
    setModalShow({
      type: AppConstant.CustomerFilterType.dia_chi,
      status: true,
    });
  }, [modalShow.status, modalShow.type]);

  const onPressAddingContact = useCallback(() => {
    setModalShow({
      type: AppConstant.CustomerFilterType.nguoi_lien_he,
      status: true,
    });
  }, [modalShow.status, modalShow.type]);

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

  const onBackButtonPress = useCallback(() => {
    setModalShow(prev => ({
      ...prev,
      status: false,
    }));
  }, [modalShow.status]);

  const onIndexChange = useCallback(
    (index: number) => {
      startTrans(() => {
        indexView.current = index;
      });
    },
    [indexView.current],
  );
  // console.log(mounted.current,'mounted')
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.labelHeader}>
        <AppHeader
          label={getLabel('customerDetail')}
          style={{backgroundColor: theme.colors.bg_default}}
          onBack={() => goBack()}
          rightButton={
            <TouchableOpacity
              style={styles.containIcon}
              onPress={() =>
                navigate(ScreenConstant.EDIT_CUSTOMER, {data: data})
              }>
              <SvgIcon source="Edit" size={20} />
            </TouchableOpacity>
          }
        />
      </View>
      {!!loading ? (
        <Block block justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Block>
      ) : (
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
      )}

      <Modal
        isVisible={modalShow.status}
        animationIn="slideInUp"
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        onBackButtonPress={onBackButtonPress}
        onBackdropPress={onBackButtonPress}
        style={styles.modalStyle}>
        <Block block colorTheme="bg_default" paddingHorizontal={16}>
          <FormAddress
            onPressClose={onBackButtonPress}
            typeFilter={modalShow.type}
            listData={listData as any}
            setData={() => {}}
            dataCustomer={data}
            getDetailCustomer={getDetailCustomer}
          />
        </Block>
      </Modal>
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
      backgroundColor: theme.colors.bg_default,
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
    modalStyle: {
      marginHorizontal: 0,
      marginVertical: 0,
    } as ViewStyle,
  });
