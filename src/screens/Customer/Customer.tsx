import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useRef, useMemo, useCallback, useEffect} from 'react';
import {TextInput} from 'react-native-paper';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

import {AppConstant, ScreenConstant} from '../../const';
import {Colors} from '../../assets';
import MainLayout from '../../layouts/MainLayout';
import AppImage from '../../components/common/AppImage';
import FilterHandle from './components/FilterHandle';
import {listFilter} from './components/data';
import ListCard from './components/ListCard';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
  AppInput,
  AppFAB,
  Block,
} from '../../components/common';
import ListFilter from './components/ListFilter';
import {NavigationProp} from '../../navigation';
import {AppTheme, useTheme} from '../../layouts/theme';
import {useNavigation} from '@react-navigation/native';
import {
  calculateDistance,
  handleBackgroundLocation,
  useSelector,
} from '../../config/function';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {shallowEqual, useDispatch} from 'react-redux';
import {Location} from 'react-native-background-geolocation';
import {IDataCustomers, ListCustomerType} from '../../models/types';
import {LocationProps} from '../Visit/VisitList/VisitItem';


export type IValueType = {
  customerType: string;
  customerGroupType: string;
  customerBirthday: string;
};

const Customer = () => {
  const {t: getLabel} = useTranslation();
  const theme = useTheme();
  const styles = rootStyles(theme);
  const dispatch = useDispatch();
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
  const appLoading = useSelector(state => state.app.loadingApp, shallowEqual);
  const page = useSelector(state => state.customer.listCustomer.page_number,shallowEqual)


  const location: Location = useSelector(
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
  const [valueFilter, setValueFilter] = React.useState<IValueType>({
    customerType: getLabel('all'),
    customerGroupType: getLabel('all'),
    customerBirthday: getLabel('all'),
  });

  const [typeFilter, setTypeFilter] = React.useState<string>(
    AppConstant.CustomerFilterType.loai_khach_hang,
  );
  const [customerData, setCustomerData] = React.useState<IDataCustomers[]>(
    listCustomer ? listCustomer : [],
  );

  const navigation = useNavigation<NavigationProp>();
  const bottomRef = useRef<BottomSheetMethods>(null);
  const bottomRef2 = useRef<BottomSheetMethods>(null);
  const filterRef = useRef<BottomSheetMethods>(null);

  const snapPoints = useMemo(() => ['100%'], []);
  const totalPage = useRef<number>(
    Math.ceil(listCustomerResult.total / listCustomerResult.page_size),
  );

  const onPressType1 = () => {
    bottomRef.current?.snapToIndex(0);
  };
  const onPressType2 = () => {
    bottomRef2.current?.snapToIndex(0);
  };

  useEffect(() => {
    handleBackgroundLocation();
    let newData: IDataCustomers[] =
      listCustomer?.length > 0 ? [...listCustomer] : [];
    if (value.first === getLabel('nearest') ) {
      // console.log(newData,'data')

      const sortData = newData?.sort((a, b) => {
        const locationA: LocationProps = JSON.parse(
           a.customer_location_primary !== null && a?.customer_location_primary,
        );
        const locationB: LocationProps = JSON.parse(
          b.customer_location_primary !== null && b?.customer_location_primary,
        );
        const distance1 = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          locationA != null ? locationA.lat : 0,
          locationA != null ? locationA.long : 0,
        );
        const distance2 = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          locationB != null ? locationB.lat : 0,
          locationB != null ? locationB.long : 0,
        );
        return distance1 - distance2;
      });
      setCustomerData(sortData);
    } else {
      const sortData = newData?.sort((a, b) => {
        const locationA: LocationProps = JSON.parse(
          a.customer_location_primary,
        );
        const locationB: LocationProps = JSON.parse(
          b.customer_location_primary,
        );
        const distance1 = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          locationA != null ? locationA.lat : 0,
          locationA != null ? locationA.long : 0,
        );
        const distance2 = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          locationB != null ? locationB.lat : 0,
          locationB != null ? locationB.long : 0,
        );
        return distance2 - distance1;
      });
      setCustomerData(sortData);
    }
  }, [listCustomer?.length, value]);

  React.useEffect(() => {
    let mounted: boolean;
    mounted = true;

    const getDataType = () => {
      dispatch(customerActions.getCustomerType());
    };

    getDataType();
    if (listCustomer?.length > 0) {
      let newData =
        listCustomer && listCustomer.length > 0 ? [...listCustomer] : [];
      setCustomerData(
        newData?.filter(item => item.customer_location_primary != null),
      );
    } else {
      dispatch(customerActions.onGetCustomer());
    }
    mounted = false;

    return () => {
      mounted = false;
    };
  }, []);

  const handleApplyFilter = useCallback(() => {
    if (
      valueFilter.customerType === getLabel('all') &&
      valueFilter.customerGroupType === getLabel('all') &&
      valueFilter.customerBirthday === getLabel('all')
    ) {
      bottomRef2.current?.close();
    } else if (
      valueFilter.customerType !== getLabel('all') &&
      valueFilter.customerType === getLabel('all') &&
      valueFilter.customerBirthday === getLabel('all')
    ) {
      const newData = listCustomer?.filter(
        item => item.customer_type === valueFilter.customerType,
      );
      console.log(newData, 'customerType');
      setCustomerData(newData);
      bottomRef2.current?.close();
    } else if (
      valueFilter.customerGroupType !== getLabel('all') &&
      valueFilter.customerType !== getLabel('all') &&
      valueFilter.customerBirthday === getLabel('all')
    ) {
      const newData = listCustomer?.filter(
        item =>
          item.customer_group === valueFilter.customerGroupType &&
          item.customer_type === valueFilter.customerType,
      );
      setCustomerData(newData);
    } else if (
      valueFilter.customerGroupType !== getLabel('all') &&
      valueFilter.customerType === getLabel('all') &&
      valueFilter.customerBirthday === getLabel('all')
    ) {
      const newData = listCustomer?.filter(
        item => item.customer_group === valueFilter.customerGroupType,
      );
      setCustomerData(newData);
      bottomRef2.current?.close();
    } else {
      console.log('fuck ?');
    }
  }, [valueFilter, listCustomer]);
  const handleCancel = () => {
    bottomRef2.current && bottomRef2.current.close();
    setValueFilter({
      customerType: getLabel('all'),
      customerBirthday: getLabel('all'),
      customerGroupType: getLabel('all'),
    });
  };

  const listFooter = useMemo(() => {
    return (
      <Block justifyContent="center" alignItems="center" marginTop={8} marginBottom={8}>
        <ActivityIndicator size={'small'} color={theme.colors.primary} />
      </Block>
    );
  }, []);

  const onEndReachedThreshold = useCallback(() => {
    if (page <= totalPage.current) {
      dispatch(customerActions.getCustomerNewPage(page + 1));
      console.log('runnnnnnn')
    }else{
      return null
    }
    // dispatch(customerActions.getCustomerNewPage(1));

  }, [listCustomerResult]);

  const renderBottomView = () => {
    return (
      <MainLayout>
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
              setTypeFilter(AppConstant.CustomerFilterType.nhom_khach_hang);
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
              setTypeFilter(AppConstant.CustomerFilterType.loai_khach_hang);
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
            label={getLabel('customerBirthDay')}
            value={valueFilter.customerBirthday}
            editable={false}
            onPress={() => {
              filterRef.current?.snapToIndex(0);
              setTypeFilter(AppConstant.CustomerFilterType.ngay_sinh_nhat);
            }}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={theme.colors.text_secondary}
              />
            }
          />
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
      </MainLayout>
    );
  };

  return (
    <Block block>
      <MainLayout style={styles.backgroundRoot}>
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
          <Text style={styles.numberCustomer}>{listCustomer?.length} </Text>
          {getLabel('customer')}
        </Text>
        <ListCard
          data={customerData}
          appLoading={appLoading!}
          listFooter={listFooter}
          onLoadData={onEndReachedThreshold}
        />
      </MainLayout>

      <AppBottomSheet
        bottomSheetRef={bottomRef}
        useBottomSheetView={show.firstModal}
        onAnimated={(index, toIndex) => {
          if (index != undefined && toIndex != undefined) {
            let cal = index - toIndex;
            if (cal > 0) {
              setShow(prev => ({...prev, firstModal: false}));
              //  dispatch(appActions.setShowModal(false))
            } else {
              setShow(prev => ({...prev, firstModal: true}));
              //  dispatch(appActions.setShowModal(true))
            }
          }
        }}
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
                  // console.log(item,'item')
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
        onAnimated={(index, toIndex) => {
          if (index != undefined && toIndex != undefined) {
            let cal = index - toIndex;
            if (cal > 0) {
              setShow(prev => ({...prev, secondModal: false}));
              //  dispatch(appActions.setShowModal(false))
            } else {
              setShow(prev => ({...prev, secondModal: true}));
              //  dispatch(appActions.setShowModal(true))
            }
          }
        }}
        enablePanDownToClose={true}>
        {renderBottomView()}
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={filterRef}
        enablePanDownToClose={true}
        snapPointsCustom={['30%']}>
        <ListFilter
          type={typeFilter}
          filterRef={filterRef}
          customerType={customerType}
          setValueFilter={setValueFilter}
          valueFilter={valueFilter}
        />
      </AppBottomSheet>

      <AppFAB
        icon="plus"
        style={styles.fab}
        color="white"
        customIconSize={32}
        mode="flat"
        visible={!(show.firstModal || show.secondModal)}
        onPress={() => navigation.navigate(ScreenConstant.ADDING_NEW_CUSTOMER)}
      />
    </Block>
  );
};

export default React.memo(Customer);

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
      color: Colors.darker,
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
      backgroundColor: Colors.gray_100,
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
      color: Colors.white,
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
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: Colors.white,
    } as ViewStyle,
    backgroundRoot: {
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
  });
