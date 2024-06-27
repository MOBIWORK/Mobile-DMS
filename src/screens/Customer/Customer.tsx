import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  StatusBar,
  Platform,
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
import {ScreenConstant} from '../../const';
import AppImage from '../../components/common/AppImage';
import ListCard from './components/ListCard';
import {
  AppBottomSheet,
  AppIcons,
  Block,
  AppText as Text,
} from '../../components/common';
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
import SkeletonLoading from '../Visit/SkeletonLoading';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import FilterListComponent, {
  IFilterType,
} from '../../components/common/FilterListComponent';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
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

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const isEnable = useRef<boolean>(false);
  const [modalErrorGPS, setModalErrorGPS] = useState(false);
  const [isFilterType, setFilterType] = useState<boolean>(true);
  const [filterTypeData, setFilterTypeData] = useState<IFilterType[]>(
    CustomerTypeFilterData,
  );
  const [filterGroupData, setFilterGroupData] = useState<IFilterType[]>(
    CustomerGroupFilterData,
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  const isRefreshCustomerWhenAddNew = useSelector(
    state => state.checkin.isRefreshCustomerWhenAddNew,
  );

  const listCustomer: IDataCustomers[] = useSelector(
    state => state.customer.listCustomer?.data,
    shallowEqual,
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
  const page = useSelector(
    state => state.customer?.listCustomer?.page_number ?? 1,
    shallowEqual,
  );

  const location: GeolocationResponse = useSelector(
    state => state.app.currentLocation,
    shallowEqual,
  );

  const [value, setValue] = React.useState({
    first: 'all',
    second: 'all',
  });
  const [loading, setLoading] = useState(true);
  const currentIndex = useRef<number>(0);
  const [isPending, startTransition] = useTransition();
  const [customerData, setCustomerData] = React.useState<IDataCustomers[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const mounted = useRef<boolean>(true);

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

  const handleItemFilter = useCallback(
    (item: IFilterType) => {
      if (isFilterType) {
        const newData = filterTypeData.map(filterTypeItem => {
          if (item.value === filterTypeItem.value) {
            return {...filterTypeItem, isSelected: true};
          } else {
            return {...filterTypeItem, isSelected: false};
          }
        });
        setValue(prevState => ({...prevState, first: item.label}));
        setFilterTypeData(newData);
      } else {
        const newData = filterGroupData.map(filterGroupItem => {
          if (item.value === filterGroupItem.value) {
            return {...filterGroupItem, isSelected: true};
          } else {
            return {...filterGroupItem, isSelected: false};
          }
        });
        setValue(prevState => ({...prevState, second: item.label}));
        setFilterGroupData(newData);
      }
      bottomSheetRef.current?.close();
    },
    [isFilterType],
  );

  const getCustomer = useCallback(() => {
    dispatch(customerActions.onGetCustomer());
  }, [customerData]);

  //refresh when add new customer
  useEffect(() => {
    if (isRefreshCustomerWhenAddNew) {
      dispatch(checkinActions.setRefreshCustomerWhenAddNew(false));
      onRefreshData();
    }
  }, [isRefreshCustomerWhenAddNew]);

  const onRefreshData = useCallback(async () => {
    try {
      console.log('run on refresh');
      dispatch(onLoadApp());
      getCustomer();
    } catch (er) {
      console.log('errDispatch: ', er);
    } finally {
      dispatch(onLoadAppEnd());
    }
  }, [listCustomerResult]);

  useEffect(() => {
    if (customerType?.length > 0) {
      const newDataGroup = customerType.map((item, index) => {
        return {
          label: item.customer_group_name,
          value: index + 1,
          isSelected: false,
        };
      });
      setFilterGroupData(
        [{label: 'all', value: 0, isSelected: true}].concat(newDataGroup),
      );
    }
  }, [customerType]);

  React.useEffect(() => {
    if (!isFocus) {
      dispatch(appActions.setSearchCustomerValue(''));
      setValue({first: 'all', second: 'all'});
    }
  }, [isFocus]);

  React.useEffect(() => {
    if (searchCustomerValue && searchCustomerValue.trim().length > 0) {
      console.log('run on search');
      dispatch(
        customerActions.onGetCustomer({search_key: searchCustomerValue}),
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

  useEffectOnce(() => {
    // console.log('run on deepcompare');
    dispatch(customerActions.getCustomerType());
    dispatch(customerActions.onGetCustomer());
  });

  useEffect(() => {
    mounted.current = true;
    // console.log('run on mounted');
    if (listCustomer && listCustomer?.length > 0) {
      // console.log('run case 1');
      const filteredData = listCustomer.filter(
        item => item.customer_location_primary,
      );
      const noLocationCustomer = listCustomer.filter(
        item => !item.customer_location_primary,
      );
      setCustomerData([...sortedData(filteredData), ...noLocationCustomer]);
      dispatch(appActions.onLoadAppEnd());
    } else if (
      value.first === 'all' &&
      value.second === 'all' &&
      !searchCustomerValue
    ) {
      // console.log('run case 2 ');
      // dispatch(customerActions.onGetCustomer());
    } else if (listCustomer?.length === 0) {
      // console.log('run case 3');
      setCustomerData([]);
    }
    mounted.current = false;
    dispatch(onLoadAppEnd());
    setLoading(false);

    return () => {
      mounted.current = false;
    };
  }, [listCustomer]);

  // useEffect(() => {
  //   if (isFocus && !searchCustomerValue) {
  //     dispatch(customerActions.onGetCustomer());
  //   }
  // }, [isFocus, searchCustomerValue]);

  useEffect(() => {
    if (value.first !== 'all' && value.second !== 'all') {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: value.first,
          customer_group: value.second,
        }),
      );
    } else if (value.first !== 'all' && value.second === 'all') {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: value.first,
          customer_group: '',
        }),
      );
    } else if (value.first === 'all' && value.second !== 'all') {
      dispatch(
        customerActions.onGetCustomer({
          customer_type: '',
          customer_group: value.second,
        }),
      );
    } else {
    }
  }, [value]);

  const onEndReachedThreshold = useCallback(() => {
    const totalPage = Math.ceil(
      listCustomerResult?.total / listCustomerResult?.page_size,
    );
    if (page < totalPage && listCustomer.length >= 20) {
      startTransition(() => {
        if (value.first !== 'all' && value.second !== 'all') {
          dispatch(
            customerActions.getCustomerNewPage({
              page_number: page + 1,
              customer_type: value.first,
              customer_group: value.second,
            }),
          );
        } else if (value.first !== 'all' && value.second === 'all') {
          dispatch(
            customerActions.getCustomerNewPage({
              page_number: page + 1,
              customer_type: value.first,
              customer_group: '',
            }),
          );
        } else if (value.first === 'all' && value.second !== 'all') {
          dispatch(
            customerActions.getCustomerNewPage({
              page_number: page + 1,
              customer_type: '',
              customer_group: value.first,
            }),
          );
        } else {
          dispatch(
            customerActions.getCustomerNewPage({
              page_number: page + 1,
            }),
          );
        }
      });
    } else {
      return null;
    }
  }, [page, value, listCustomerResult]);

  const onPressAdding = useCallback(() => {
    dispatch(customerActions.setMainAddress({}));
    dispatch(customerActions.setMainContactAddress({}));
    navigation.navigate(ScreenConstant.ADDING_NEW_CUSTOMER);
  }, []);

  const _renderFilter = () => {
    const Item = (isCustomerType: boolean) => {
      return (
        <TouchableOpacity
          style={styles.touchableButton}
          onPress={() => {
            if (isCustomerType) {
              setFilterType(true);
            } else {
              setFilterType(false);
            }
            bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0);
          }}>
          <Text style={styles.titleTextFilter}>
            {isCustomerType ? 'Loại KH' : 'Nhóm KH'}
            {': '}
            <Text style={styles.contentText}>
              {isCustomerType ? getLabel(value.first) : getLabel(value.second)}
            </Text>
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.filterContainer}>
        {Item(true)}
        {Item(false)}
      </View>
    );
  };
  // console.log(customerData,'dd')

  return (
    <SafeAreaView style={styles.backgroundRoot} edges={['bottom', 'top']}>
      <StatusBar barStyle={'dark-content'} />
      <Block paddingHorizontal={16} block paddingBottom={bottom + 50}>
        <View style={styles.rootHeader}>
          <Text style={styles.labelStyle}>{getLabel('customer')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenConstant.SEARCH_CUSTOMER)}
            style={styles.iconSearch}>
            <AppImage source="IconSearch" style={styles.iconSearch} />
          </TouchableOpacity>
        </View>
        {_renderFilter()}
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
            data={customerData}
            loading={loading}
            onRefresh={onRefreshData}
            onEndReachedThreshold={onEndReachedThreshold}
            onScroll={onScroll}
            currentIndex={currentIndex.current}
          />
        )}
      </Block>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: bottom + 16, paddingHorizontal: 16}}
          onLayout={handleContentLayout}>
          <FilterListComponent
            title={isFilterType ? 'Loại khách hàng' : 'Nhóm khách hàng'}
            data={isFilterType ? filterTypeData : filterGroupData}
            handleItem={handleItemFilter}
            isSearch={false}
            onClose={() =>
              bottomSheetRef.current && bottomSheetRef.current.close()
            }
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
      <TouchableOpacity onPress={onPressAdding} style={styles.fab}>
        <AppIcons
          iconType="IonIcon"
          name="add-outline"
          size={40}
          color={theme.colors.white}
        />
      </TouchableOpacity>
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
      // marginRight: 16,
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
    touchableButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.divider,
      borderWidth: 1,
      padding: 6,
      borderRadius: 16,
      borderColor: theme.colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      // marginRight: 2,
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
    filterItem: {
      padding: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 16,
      marginBottom: 16,
    } as ViewStyle,
    titleTextFilter: {
      color: theme.colors.text_secondary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    contentText: {
      color: '#000',
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
  });
const CustomerTypeFilterData: IFilterType[] = [
  {
    label: 'all',
    value: 1,
    isSelected: true,
  },
  {
    label: 'Company',
    value: 2,
    isSelected: false,
  },
  {
    label: 'Individual',
    value: 3,
    isSelected: false,
  },
];

const CustomerGroupFilterData: IFilterType[] = [
  {
    label: 'all',
    value: 1,
    isSelected: true,
  },
  {
    label: 'Loyal',
    value: 2,
    isSelected: false,
  },
];
