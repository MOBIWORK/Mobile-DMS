import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  StatusBar,
  Platform,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {
  useRef,
  useMemo,
  useCallback,
  useTransition,
  useState,
  useEffect,
} from 'react';
import {TextInput} from 'react-native-paper';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

import {AppConstant, ScreenConstant} from '../../const';

import AppImage from '../../components/common/AppImage';
import FilterHandle from './components/FilterHandle';
import {listFilter} from './components/data';
import ListCard from './components/ListCard';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
  AppInput,
  Block,
  AppText as Text,
} from '../../components/common';
import ListFilter from './components/ListFilter';
import {NavigationProp} from '../../navigation/screen-type';
import {AppTheme, useTheme} from '../../layouts/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  calculateDistance,
  handleBackgroundLocation,
  useEffectOnce,
  useSelector,
} from '../../config/function';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {shallowEqual, useDispatch} from 'react-redux';
import {IDataCustomers, ListCustomerType} from '../../models/types';
import {LocationProps} from '../Visit/VisitList/VisitItem';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import isEqual from 'react-fast-compare';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
} from '../../redux-store/app-reducer/reducer';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {onResetSearchValueOfVisit} from '../Visit/VisitList/SearchVisit';
import SkeletonLoading from '../Visit/SkeletonLoading';
import ModalSearchCustomer from './components/ModalSearchCustomer';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import {getCustomer} from '../../services/appService';
export type IValueType = {
  customerType: string;
  customerGroupType: string;
  // customerBirthday: string;
};

const Customer = () => {
  const {t: getLabel} = useTranslation();
  const theme = useTheme();
  const styles = rootStyles(theme);
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const isFocus = useIsFocused();
  const isEnable = useRef<boolean>(false);
  const [modalErrorGPS, setModalErrorGPS] = useState(false);

  const listCustomer: IDataCustomers[] = useSelector(
    state => state.customer.listCustomer?.data,
    // shallowEqual,
    isEqual,
  );
  const listCustomerResult = useSelector(
    state => state.customer.listCustomer,
    shallowEqual,
  );
  const customerType: ListCustomerType[] = useSelector(
    state => state.customer.listCustomerType,
    shallowEqual,
  );

  const searchCustomerValue = useSelector(
    state => state.app.searchCustomerValue,
  );
  const appLoading = useSelector(state => state.app.loadingApp, shallowEqual);
  const page = useSelector(
    state => state.customer?.listCustomer?.page_number ?? 1,
    shallowEqual,
  );

  const location: GeolocationResponse = useSelector(
    state => state.app.currentLocation,
    shallowEqual,
  );

  const [value, setValue] = React.useState({
    first: getLabel('nearest'),
    second: '',
  });
  const [show, setShow] = React.useState({
    firstModal: false,
    secondModal: false,
  });

  const [loading, setLoading] = useState(true);
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: getLabel('all'),
    customerGroupType: getLabel('all'),
  });
  //  console.log(listCustomerResult,'listCustomer')
  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const currentIndex = useRef<number>(0);
  const [showModal, setShowModal] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  // const customerData = React.useRef<IDataCustomers[]>(listCustomer);
  const [customerData, setCustomerData] = React.useState<IDataCustomers[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const bottomRef = useRef<BottomSheetMethods>(null);
  const bottomRef2 = useRef<BottomSheetMethods>(null);
  const filterRef = useRef<BottomSheetMethods>(null);
  const flatListRef = useRef<FlatList>(null);
  const mounted = useRef<boolean>(true);
  const snapPoints = useMemo(() => ['100%'], []);
  const totalPage = useRef<number>(
    Math.ceil(listCustomerResult?.total / listCustomerResult?.page_size),
  );

  const onPressType1 = useCallback(() => {
    bottomRef.current?.snapToIndex(0);
  }, [bottomRef.current]);

  const onPressType2 = useCallback(() => {
    bottomRef2.current?.snapToIndex(0);
  }, [bottomRef2.current]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.height - 240;
      const index = event.nativeEvent.contentOffset.y / slideSize;
      const roundIndex = Math.ceil(index);
      currentIndex.current = roundIndex;
    },

    [currentIndex],
  );

  const sortedData = useCallback(
    (filteredData: IDataCustomers[]) => {
      return (
        filteredData.slice().sort((a, b) => {
          const locationA: LocationProps = JSON.parse(
            a.customer_location_primary,
          );
          const locationB: LocationProps = JSON.parse(
            b.customer_location_primary,
          );
          const distance1 = calculateDistance(
            location?.coords?.latitude,
            location?.coords?.longitude,
            locationA.lat != null ? locationA.lat : 0,
            locationA.long != null ? locationA.long : 0,
          );
          const distance2 = calculateDistance(
            location?.coords?.latitude,
            location?.coords?.longitude,
            locationB.lat != null ? locationB.lat : 0,
            locationB.long != null ? locationB.long : 0,
          );
          return value.first === getLabel('nearest')
            ? distance1 - distance2
            : distance2 - distance1;
        }) || filteredData
      );
    },
    [customerData],
  );

  const onRefreshData = useCallback(async () => {
    console.log('onRefreshData');
    try {
      dispatch(onLoadApp());
      dispatch(customerActions.onGetCustomer());
      totalPage.current = Math.ceil(
        listCustomerResult.total / listCustomerResult.page_size,
      );
      // flatListRef.current?.scrollToIndex({
      //   animated: true,
      //   index: currentIndex.current,
      // });
    } catch (er) {
      console.log('errDispatch: ', er);
    } finally {
      dispatch(onLoadAppEnd());
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (!isFocus) {
      //delete search visit value in ListVisit.tsx
      // onResetSearchValueOfVisit();
      dispatch(appActions.setSearchCustomerValue(''));
      // if (currentIndex.current > 0) {
      //   flatListRef.current?.scrollToIndex({
      //     animated: true,
      //     index: currentIndex.current,
      //   });
      // }
    }
  }, [isFocus]);

  React.useEffect(() => {
    if ( searchCustomerValue &&  searchCustomerValue.trim().length > 0) {
      dispatch(
        customerActions.onGetCustomer({customer_name: searchCustomerValue}),
      );
    }
  }, [searchCustomerValue]);

  const checkGPS = useCallback(async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean = await isLocationEnabled();
      isEnable.current = checkEnabled;
      if (checkEnabled === true) {
        setModalErrorGPS(false);
        handleBackgroundLocation();
      } else {
        setModalErrorGPS(true);
        return null;
      }
    } else {
      handleBackgroundLocation();
    }
  }, [modalErrorGPS]);

  React.useLayoutEffect(() => {
    checkGPS();
    // handleEnabledPressed();
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (listCustomer && listCustomer?.length > 0) {
      console.log('lissss', listCustomer.length);
      const filteredData = listCustomer.filter(
        item => item.customer_location_primary,
      );
      const noLocationCustomer = listCustomer.filter(
        item => !item.customer_location_primary,
      );
      // console.log('hehehe', [
      //   ...sortedData(filteredData),
      //   ...noLocationCustomer,
      // ]);
      // setCustomerData([...sortedData(filteredData), ...noLocationCustomer]);
      setCustomerData(listCustomer);
      dispatch(appActions.onLoadAppEnd());
    } else if (
      valueFilter.customerType === 'Tất cả' &&
      valueFilter.customerGroupType === 'Tất cả' &&
      !searchCustomerValue
    ) {
      console.log('131212');
      // dispatch(customerActions.onGetCustomer());
    } else if (listCustomer?.length === 0) {
      setCustomerData([]);
    }
    mounted.current = false;
    dispatch(onLoadAppEnd());
    setLoading(false);

    return () => {
      mounted.current = false;
    };
  }, [listCustomerResult]);

  // useEffect(() => {
  //   console.log('liscustomer', listCustomerResult.data);
  // }, [listCustomerResult]);

  useEffect(() => {
    if (isFocus && !searchCustomerValue) {
      console.log('123333');
      dispatch(customerActions.onGetCustomer());
    }
  }, [isFocus, searchCustomerValue]);

  useEffectOnce(() => {
    dispatch(customerActions.getCustomerType());
  });

  const handleApplyFilter = () => {
    console.log('handleApplyFilter');
    if (
      valueFilter.customerType !== 'Tất cả' &&
      valueFilter.customerGroupType !== 'Tất cả'
    ) {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: valueFilter.customerType,
          customer_group: valueFilter.customerGroupType,
        }),
      );
    } else if (
      valueFilter.customerType !== 'Tất cả' &&
      valueFilter.customerGroupType === 'Tất cả'
    ) {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: valueFilter.customerType,
          customer_group: '',
        }),
      );
    } else if (
      valueFilter.customerType === 'Tất cả' &&
      valueFilter.customerGroupType !== 'Tất cả'
    ) {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: '',
          customer_group: valueFilter.customerGroupType,
        }),
      );
    } else {
      console.log('handleApplyFilter2222');
      dispatch(customerActions.onGetCustomer());
    }
  };
  const handleCancel = useCallback(() => {
    // bottomRef2.current && bottomRef2.current.close();
    setValueFilter({
      customerType: getLabel('all'),
      customerGroupType: getLabel('all'),
    });
  }, [valueFilter]);

  const onBackButtonPress = useCallback(() => {
    setShowModal(false);
  }, [showModal]);

  const onEndReachedThreshold = useCallback(() => {
    if (
      page <= Math.ceil(listCustomerResult.total / listCustomerResult.page_size) && listCustomer.length > 4
    ) {
      startTransition(() => {
        console.log('run   end')
        if (
          valueFilter.customerType !== 'Tất cả' &&
          valueFilter.customerGroupType !== 'Tất cả'
        ) {
          dispatch(
            customerActions.getCustomerNewPage({
              page: page + 1,
              customer_type: valueFilter.customerType,
              customer_group: valueFilter.customerGroupType,
            }),
          );
        } else if (
          valueFilter.customerType !== 'Tất cả' &&
          valueFilter.customerGroupType === 'Tất cả'
        ) {
          dispatch(
            customerActions.getCustomerNewPage({
              page: page + 1,
              customer_type: valueFilter.customerType,
              customer_group: '',
            }),
          );
        } else if (
          valueFilter.customerType === 'Tất cả' &&
          valueFilter.customerGroupType !== 'Tất cả'
        ) {
          dispatch(
            customerActions.getCustomerNewPage({
              page: page + 1,
              customer_type: '',
              customer_group: valueFilter.customerGroupType,
            }),
          );
        } else {
          dispatch(
            customerActions.getCustomerNewPage({
              page: page + 1,
            }),
          );
        }
      });
      // flatListRef.current?.scrollToIndex({
      //   animated: true,
      //   index: currentIndex.current,
      // });
    } else {
      return null;
    }
  }, [page, valueFilter]);

  const onPressAdding = useCallback(() => {
    dispatch(customerActions.setMainAddress({}));
    dispatch(customerActions.setMainContactAddress({}));
    navigation.navigate(ScreenConstant.ADDING_NEW_CUSTOMER);
  }, []);

  const renderBottomView = React.useCallback(() => {
    return (
      <Block block paddingHorizontal={16}>
        <AppHeader
          label={getLabel('customer')}
          onBack={() => bottomRef2.current && bottomRef2.current.close()}
          backButtonIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.IonIcon}
              name={'close'}
              size={24}
              color={theme.colors.text_primary}
            />
          }
        />
        <View style={styles.containListFilter}>
          <AppInput
            label={getLabel('groupCustomer')}
            value={valueFilter.customerGroupType}
            editable={false}
            styles={{marginBottom: 24}}
            onPress={() => {
              startTransition(() => {
                setTypeFilter(AppConstant.CustomerFilterType.nhom_khach_hang);
              });
              filterRef.current?.snapToIndex(0);
            }}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
          <AppInput
            label={getLabel('customerType')}
            value={valueFilter.customerType}
            editable={false}
            styles={{marginBottom: 24}}
            onPress={() => {
              startTransition(() => {
                setTypeFilter(AppConstant.CustomerFilterType.loai_khach_hang);
              });
              filterRef.current?.snapToIndex(0);
            }}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
          {/*<AppInput*/}
          {/*  label={getLabel('customerBirthDay')}*/}
          {/*  value={valueFilter.customerBirthday}*/}
          {/*  editable={false}*/}
          {/*  onPress={() => {*/}
          {/*    startTransition(() => {*/}
          {/*      setTypeFilter(AppConstant.CustomerFilterType.ngay_sinh_nhat);*/}
          {/*    });*/}
          {/*    filterRef.current?.snapToIndex(0);*/}
          {/*  }}*/}
          {/*  rightIcon={*/}
          {/*    <TextInput.Icon*/}
          {/*      icon={'chevron-down'}*/}
          {/*      style={{width: 24, height: 24}}*/}
          {/*      color={theme.colors.text_secondary}*/}
          {/*    />*/}
          {/*  }*/}
          {/*/>*/}
        </View>
        <View style={styles.containButtonBottom}>
          <View style={styles.containContentButton}>
            <TouchableOpacity
              style={styles.buttonRestart}
              onPress={handleCancel}>
              <Text style={styles.restartText}>{getLabel('reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonApply}
              onPress={() => {
                handleApplyFilter();
                bottomRef2.current?.close();
              }}>
              <Text style={styles.applyText}>{getLabel('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Block>
    );
  }, [valueFilter]);
  // console.log(customerData.current,'customerData')

  // console.log(modalErrorGPS)

  return (
    <SafeAreaView style={styles.backgroundRoot} edges={['bottom', 'top']}>
      <StatusBar barStyle={'dark-content'} />
      <Block paddingHorizontal={16} block paddingBottom={bottom + 24}>
        <View style={styles.rootHeader}>
          <Text style={styles.labelStyle}>{getLabel('customer')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenConstant.SEARCH_CUSTOMER)}
            style={styles.iconSearch}>
            <AppImage source="IconSearch" style={styles.iconSearch} />
          </TouchableOpacity>
        </View>
        <View style={styles.containFilterView}>
          <FilterHandle type={'1'} value={value.first} onPress={onPressType1} />
          <FilterHandle
            type={'2'}
            value={value.second}
            onPress={onPressType2}
          />
        </View>

        <Text style={styles.containCustomer}>
          <Text style={styles.numberCustomer}>
            {listCustomerResult ? listCustomerResult.total : 0}{' '}
          </Text>
          {getLabel('customer')}
        </Text>
        {loading ? (
          <SkeletonLoading />
        ) : (
          <ListCard
            data={customerData || []}
            loading={loading}
            onRefresh={onRefreshData}
            onLoadData={onEndReachedThreshold}
            onScroll={onScroll}
            currentIndex={currentIndex.current}
          />
        )}
      </Block>

      <AppBottomSheet
        bottomSheetRef={bottomRef}
        useBottomSheetView={show.firstModal}
        enablePanDownToClose={true}>
        <View>
          <View style={styles.tittleHeader}>
            <Text style={styles.titleText}>{getLabel('distance')}</Text>
          </View>
          {listFilter.map(item => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() =>
                  setValue(prev => ({
                    ...prev,
                    first: item.title,
                  }))
                }>
                <Text style={styles.itemText(item.title, value.first)}>
                  {item.title}
                </Text>
                {item.title === value.first && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={bottomRef2}
        useBottomSheetView={show.secondModal}
        snapPointsCustom={snapPoints}
        // onClose={() => dispatch(appActions.setShowModal(false)) }

        enablePanDownToClose={true}>
        {renderBottomView()}
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={filterRef}
        enablePanDownToClose={true}
        snapPointsCustom={['60%']}>
        <ListFilter
          type={typeFilter}
          filterRef={filterRef}
          customerType={customerType}
          setValueFilter={setValueFilter}
          valueFilter={valueFilter}
        />
      </AppBottomSheet>
      <TouchableOpacity onPress={onPressAdding} style={styles.fab}>
        <AppIcons
          iconType="IonIcon"
          name="add-outline"
          size={40}
          color={theme.colors.white}
        />
      </TouchableOpacity>
      {/*<ModalSearchCustomer*/}
      {/*  data={customerData}*/}
      {/*  setDataCustomer={setCustomerData}*/}
      {/*  showModal={showModal}*/}
      {/*  onBackButtonPress={onBackButtonPress}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};

export default React.memo(Customer, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    labelStyle: {
      fontSize: 24,
      color: theme.colors.text_primary,
      lineHeight: 25,
      fontWeight: '500',
      textAlign: 'left',
      // alignSelf:'flex-end'
    } as TextStyle,
    containCustomer: {
      fontSize: 14,
      color: theme.colors.text_primary,
      lineHeight: 21,
      fontWeight: '500',
      textAlign: 'left',
      marginBottom: 16,
      // alignSelf:'flex-end'
    } as TextStyle,
    numberCustomer: {
      fontSize: 14,
      color: theme.colors.text_primary,
      lineHeight: 21,
      fontWeight: '700',
      textAlign: 'left',
      // alignSelf:'flex-end'
    } as TextStyle,
    iconSearch: {
      width: 28,
      height: 28,
      marginRight: 16,
    } as ImageStyle,
    searchButtonStyle: {
      alignItems: 'flex-end',
      width: 200,
      flex: 1,
    } as ViewStyle,
    labelContentStyle: {alignSelf: 'flex-end'} as ViewStyle,
    rootHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      marginBottom: 16,
    } as ViewStyle,
    containFilterView: {
      flexDirection: 'row',
      height: 48,
      marginBottom: 16,
    } as ViewStyle,
    tittleHeader: {
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    titleText: {
      fontSize: 18,
      color: theme.colors.text,
      lineHeight: 27,
      fontWeight: '500',
      marginBottom: 4,
      // textAlign: 'left',
      // alignSelf:'flex-end'
    } as TextStyle,
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
    itemText: (text: string, value: string) =>
      ({
        fontSize: 16,
        fontWeight: text === value ? '600' : '400',
        lineHeight: 21,
        marginBottom: 16,
      } as TextStyle),
    containListFilter: {
      marginTop: 24,
      flex: 1,
    } as ViewStyle,
    containButtonBottom: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    } as ViewStyle,
    containContentButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
    } as ViewStyle,
    buttonApply: {
      backgroundColor: theme.colors.primary,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      flex: 1,
      marginHorizontal: 6,
    } as ViewStyle,
    buttonRestart: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginHorizontal: 6,
      // width:'100%',
      flex: 1,
    } as ViewStyle,
    restartText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: theme.colors.text_disable,
    } as TextStyle,
    applyText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: theme.colors.bg_default,
    } as TextStyle,
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      // justifyContent:'space-around',
      alignItems: 'center',
    } as ViewStyle,
    titleHeaderText: {
      // alignSelf:'center',
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      flex: 1,
      marginLeft: 8,
      // backgroundColor:'blue',
      textAlign: 'center',
    } as TextStyle,
    fab: {
      width: 60,
      height: 60,
      flex: 1,
      zIndex: 99,
      right: 20,
      bottom: 150,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: theme.colors.bg_default,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    backgroundRoot: {
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
    } as ViewStyle,
    buttonModal: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      height: 40,
      borderRadius: 8,
      marginRight: 8,
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  });
