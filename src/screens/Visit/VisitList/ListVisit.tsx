import React, {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  AppBottomSheet,
  Block,
  AppImage,
  AppText as Text,
} from '../../../components/common';
import {
  FlatList,
  Image,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation/screen-type';
import {
  ListCustomerRoute,
  ListCustomerType,
  VisitListItemResult,
  VisitListItemType,
} from '../../../models/types';
import {LocationProps} from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import {AppConstant, ScreenConstant} from '../../../const';
import Mapbox from '@rnmapbox/maps';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  backgroundErrorListener,
  calculateDistance,
  useSelector,
} from '../../../config/function';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {
  customerActions,
  setListCustomerType,
} from '../../../redux-store/customer-reducer/reducer';

import {
  CheckinData,
  DMSConfigMobile,
  getCustomerType,
  getCustomerVisit,
  IListVisitParams,
} from '../../../services/appService';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {CustomerService} from '../../../services';
import {CommonUtils} from '../../../utils';
import {shallowEqual, useDispatch} from 'react-redux';
import {GeolocationResponse} from '@react-native-community/geolocation';
import isEqual from 'react-fast-compare';
import ModalAlert from './Component/ModalAlert';
import {navigate} from '../../../navigation/navigation-service';
import moment from 'moment';
import {useBatteryLevel} from 'expo-battery';
import ModalUpdateLocation from './Component/ModalUpdateLocation';
import {ObjectId} from 'bson';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import RenderContent from './Component/RenderContent';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';

//config Mapbox

export interface ModalType {
  status: boolean;
  type: 'warn' | 'loading';
  cal?: number;
}
export interface ModalUpdateType {
  status: boolean;
  isDetail: boolean;
}

const ListVisit = () => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const styles = rootStyles(useTheme());
  const dispatch = useDispatch();

  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const filterRef = useRef<BottomSheet>(null);
  const distanceRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
  );
  const searchVisit = useSelector(state => state.app.searchVisitValue);
  const [_, startEffect] = useTransition();
  const [modalErrorGPS, setModalErrorGPS] = useState(false);

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
    shallowEqual,
  );

  const isRefreshVisitWhenCheckOut = useSelector(
    state => state.checkin.isRefreshVisitWhenCheckOut,
  );
  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const listCustomer: VisitListItemResult = useSelector(
    state => state.customer.listCustomerVisit,
    shallowEqual,
  );
  const listCustomerRoute = useSelector(
    state => state.customer.listCustomerRoute,
    shallowEqual,
  );
  const customerType: ListCustomerType[] = useSelector(
    state => state.customer.listCustomerType,
  );

  const currentLocation = useSelector(
    state => state.app.currentLocation,
    shallowEqual,
  );

  const [customerDataSort, setCustomerData] = useState<VisitListItemType[]>();
  const [modalAlert, setModalAlert] = useState<ModalType>({
    status: false,
    type: 'warn',
  });
  const [modalUpdateLocation, setModalUpdateLocation] =
    useState<ModalUpdateType>({
      status: false,
      isDetail: false,
    });
  const [distanceFilterValue, setDistanceFilterValue] = useState<string>(
    getLabel('nearest'),
  );
  const [distanceFilterData, setDistanceFilterData] = useState<IFilterType[]>(
    AppConstant.DistanceFilterData,
  );

  const routeTodayRef = useRef<any>();
  const batteryLevel = useBatteryLevel();

  //refresh data
  const filterDataRef = useRef<IListVisitParams>({});

  const [filterParams, setFilterParams] = useState<IListVisitParams>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [bottomLoading, setBottomLoading] = useState<boolean>(false);
  const [isShowListVisit, setShowListVisit] = useState<boolean>(true);
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const mounted = useRef<boolean>(true);
  const [visitItemSelected, setVisitItemSelected] =
    useState<VisitListItemType | null>(null);
  const currentSelect = useRef<VisitListItemType>();
  const isEnable = useRef<boolean>(false);
  const slideSizeRef = useRef<number>(0);
  const flatlistRef = useRef<FlatList>(null);

  const handleEnabledPressed = useCallback(
    async (item?: VisitListItemType, type?: boolean) => {
      if (item && Object.keys(item).length > 0 && type != undefined) {
        if (Platform.OS === 'android') {
          const checkEnabled: boolean = await isLocationEnabled();
          isEnable.current = checkEnabled;
          if (checkEnabled === true) {
            handleCompareDistance(item!, type);
            setModalErrorGPS(false);
          } else {
            setModalErrorGPS(true);
          }
        } else {
          handleCompareDistance(item, type);
        }
      } else {
        if (Platform.OS === 'android') {
          const checkEnabled: boolean = await isLocationEnabled();
          isEnable.current = checkEnabled;
          if (checkEnabled === true) {
            setModalErrorGPS(false);
            // handleCompareDistance(item!, type);
          } else {
            setModalErrorGPS(true);
          }
        }
      }
    },
    [modalErrorGPS],
  );

  const onRefreshData = useCallback(async () => {
    dispatch(appActions.setSearchVisitValue(''));
    try {
      if (Object.keys(filterDataRef.current).length > 0) {
        await getCustomer({
          ...filterDataRef.current,
          search_key: '',
          lat: location?.coords?.latitude,
          long: location?.coords.longitude,
          field_order: 'distance',
          order_by: 'asc',
        });
        // await sortDataCustomer()
      } else {
        await getCustomer({
          ...filterParams,
          router: filterParams?.router?.channel_code,
          search_key: '',
          lat: location?.coords?.latitude,
          long: location?.coords.longitude,
          field_order: 'distance',
          order_by: 'asc',
        });
      }
    } catch (er) {
      console.log('errDispatch: ', er);
    }
  }, [filterParams, filterDataRef.current]);

  const onEndReachedThreshold = useCallback(() => {
    setBottomLoading(true);
    const totalPage = Math.ceil(listCustomer.total / 20);
    if (listCustomer.page_number < totalPage && listCustomer.data.length > 19) {
      if (Object.keys(filterDataRef.current).length > 0) {
        CommonUtils.getCurrentLocation(location =>
          getCustomer(
            {
              ...filterDataRef.current,
              page_number: listCustomer.page_number + 1,
              lat: location.coords.latitude,
              long: location.coords.longitude,
              field_order: 'customer_name',
              order_by: 'asc',
            },
            true,
          ),
        );

        setBottomLoading(false);
      } else {
        CommonUtils.getCurrentLocation(location =>
          getCustomer(
            {
              ...filterParams,
              router: filterParams?.router?.channel_code,
              page_number: listCustomer.page_number + 1,
              lat: location.coords.latitude,
              long: location.coords.longitude,
              field_order: 'customer_name',
              order_by: 'asc',
            },
            true,
          ),
        );

        setBottomLoading(false);
      }
    } else {
      setBottomLoading(false);
      return;
    }
    setBottomLoading(false);
  }, [listCustomer]);

  const handleItemDistanceFilter = useCallback(
    (itemData: IFilterType) => {
      distanceRef.current?.close();
      setDistanceFilterValue(getLabel(itemData.label));
      const newData = distanceFilterData.map(item => {
        if (itemData.value === item.value) {
          return {...item, isSelected: true};
        } else {
          return {...item, isSelected: false};
        }
      });
      setDistanceFilterData(newData);
      if (Object.keys(filterDataRef.current).length > 0) {
        CommonUtils.getCurrentLocation(
          locations => {
            getCustomer({
              ...filterDataRef.current,
              search_key: '',
              lat: locations.coords?.latitude,
              long: locations.coords?.longitude,
              field_order: 'distance',
              order_by: itemData.label === 'nearest' ? 'asc' : 'desc',
            });
          },
          () => {
            getCustomer({
              ...filterDataRef.current,
              search_key: '',
              field_order: 'customer_name',
              order_by: 'asc',
            });
          },
        );

        // await sortDataCustomer()
      } else {
        CommonUtils.getCurrentLocation(
          locations => {
            getCustomer({
              ...filterParams,
              router: filterParams?.router?.channel_code,
              search_key: '',
              lat: locations.coords?.latitude,
              long: locations.coords.longitude,
              field_order: 'distance',
              order_by: itemData.label === 'nearest' ? 'asc' : 'desc',
            });
          },
          () => {
            getCustomer({
              ...filterParams,
              router: filterParams?.router?.channel_code,
              search_key: '',
              field_order: 'customer_name',
              order_by: 'asc',
            });
          },
        );
      }
    },
    [filterParams, filterDataRef.current],
  );

  // const presentMap = (item: VisitListItemType) => {
  //   const item_location: any = JSON.parse(item.customer_location_primary);
  //   CommonUtils.sleep(100).then(() => {
  //     mapboxCameraRef.current &&
  //       mapboxCameraRef.current.moveTo(
  //         [Number(item_location.long), Number(item_location.lat)],
  //         1000,
  //       );
  //   });
  //   setShowListVisit(false);
  //   setVisitItemSelected(item);
  // };

  const _renderHeader = () => {
    return (
      <Block paddingHorizontal={16}>
        <Block style={styles.rootHeader}>
          <Text style={styles.labelStyle}>{getLabel('visit')}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setShowListVisit(!isShowListVisit);
                // setVisitItemSelected(null);
              }}>
              <Image
                source={
                  isShowListVisit ? ImageAssets.MapIcon : ImageAssets.ListIcon
                }
                style={{width: 28, height: 28}}
                tintColor={colors.text_secondary}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenConstant.SEARCH_VISIT)}>
              <Image
                source={ImageAssets.SearchIcon}
                style={{width: 28, height: 28, marginLeft: 16}}
                tintColor={colors.text_secondary}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        </Block>

        <Block direction="row" alignItems="center" justifyContent="flex-start">
          <TouchableOpacity
            onPress={() =>
              distanceRef.current && distanceRef.current.snapToIndex(0)
            }
            style={styles.touchableButton}>
            <Text style={styles.titleText}>
              {getLabel('distance')}:{'  '}
            </Text>
            <Text style={styles.contentText}>{distanceFilterValue}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchableButton}
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
            }>
            <AppImage source="IconFilter" style={styles.iconStyle} />
            <Text style={styles.contentSecondText}>
              {getLabel('otherFilters')}
            </Text>
          </TouchableOpacity>
          {/* <FilterView
            style={{marginLeft: 12}}
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
            }
          /> */}
        </Block>
      </Block>
    );
  };

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.height - 220;
      const index = event.nativeEvent.contentOffset.y / slideSize;
      const roundIndex = Math.ceil(index);
      setCurrentIndex(roundIndex);
      slideSizeRef.current = slideSize;
    },
    [],
  );

  const onPresClose = () => {
    setModalErrorGPS(false);
    // setTimeout(() => {
    //   flatlistRef?.current?.scrollToIndex({
    //     animated: true,
    //     viewOffset: 0,
    //     viewPosition: 1,
    //     index: currentIndex + 1,
    //   });
    // }, 500);
  };

  useLayoutEffect(() => {
    if (
      Object.keys(systemConfig).length === 0 ||
      categoriesCheckin?.length === 0
    ) {
      dispatch(appActions.onGetSystemConfig());
    }
    // handleEnabledPressed();
    CommonUtils.getCurrentLocation(
      locations => setLocation(locations),
      // error => backgroundErrorListener(error.code),
    );
  }, []);

  const getCustomer = useCallback(
    async (params?: IListVisitParams, isMore?: boolean) => {
      await getCustomerVisit(params).then((res: any) => {
        if (Object.keys(res.result).length > 0) {
          const data: VisitListItemResult = res?.result;
          if (isMore) {
            const newData: VisitListItemType[] = [
              ...listCustomer.data,
              ...data.data,
            ];
            dispatch(
              customerActions.setCustomerVisit({
                data: newData,
                total: data.total,
                page_size: data.page_size,
                page_number: params?.page_number,
                total_checkin: data.total_checkin,
              }),
            );
          } else {
            dispatch(customerActions.setCustomerVisit(data));
          }
        }
      });
    },
    [listCustomer, location],
  );

  const sortedData = (
    distanceLabel: string,
    filteredData: VisitListItemType[],
  ) => {
    return (
      filteredData.slice().sort((a, b) => {
        const locationA: LocationProps =
          JSON.parse(
            a.customer_location_primary
              ? a.customer_location_primary
              : '{"long": 0, "lat": 0}',
          ) || {};
        const locationB: LocationProps = JSON.parse(
          b.customer_location_primary
            ? b.customer_location_primary
            : '{"long": 0, "lat": 0}',
        );
        const distance1 = calculateDistance(
          currentLocation?.coords?.latitude
            ? currentLocation?.coords?.latitude
            : 0,
          currentLocation?.coords?.longitude
            ? currentLocation?.coords?.longitude
            : 0,
          locationA.lat != null ? locationA.lat : 0,
          locationA.long != null ? locationA.long : 0,
        );
        const distance2 = calculateDistance(
          currentLocation?.coords?.latitude,
          currentLocation?.coords?.longitude,
          locationB.lat != null ? locationB.lat : 0,
          locationB.long != null ? locationB.long : 0,
        );
        return distanceLabel === getLabel('nearest')
          ? distance1 - distance2
          : distance2 - distance1;
      }) || null
    );
  };

  const sortDataCustomer = (distanceLabel: string) => {
    if (listCustomer && listCustomer?.data?.length > 0) {
      const filteredData = listCustomer.data.filter(
        item => item.customer_location_primary != null,
      );
      const noLocationCustomer = listCustomer.data.filter(
        item => item.customer_location_primary === null,
      );
      setCustomerData([
        ...sortedData(distanceLabel, filteredData),
        ...noLocationCustomer,
      ]);
    } else {
      setCustomerData([]);
    }
  };

  useEffect(() => {
    sortDataCustomer(distanceFilterValue);
  }, [listCustomer]);

  const getCustomerRoute = useCallback(async () => {
    const all_route: ListCustomerRoute = {
      name: '',
      channel_name: 'Tất cả',
      channel_code: '',
      travel_date: '',
      is_today: false,
    };
    const response: any = await CustomerService.getCustomerRoute();
    if (response?.result?.length > 0) {
      //add "all" to list route:
      const newListRoute: ListCustomerRoute[] = [all_route].concat(
        response.result,
      );
      dispatch(customerActions.setListCustomerRoute(newListRoute));
      const route_today: ListCustomerRoute[] = response.result.filter(
        (item: ListCustomerRoute) => item.is_today,
      );
      if (route_today && route_today?.length > 0) {
        setFilterParams({router: route_today[0]});
        routeTodayRef.current = route_today[0];
        if (location?.coords && Object.keys(location?.coords).length > 0) {
          await getCustomer({
            router: route_today[0].channel_code,
            long: location.coords.longitude,
            lat: location.coords.latitude,
            field_order: 'distance',
            order_by: 'asc',
          });
        } else {
          CommonUtils.getCurrentLocation(
            async location => {
              await getCustomer({
                router: route_today[0].channel_code,
                field_order: 'distance',
                order_by: 'asc',
                long: location.coords.longitude,
                lat: location.coords.latitude,
              });
            },
            async () => {
              await getCustomer({
                router: route_today[0].channel_code,
              });
            },
          );
        }
      } else {
        setFilterParams({router: all_route});
        routeTodayRef.current = all_route;
        if (location?.coords && Object.keys(location?.coords).length > 0) {
          await getCustomer({
            long: location.coords.longitude,
            lat: location.coords.latitude,
            field_order: 'distance',
            order_by: 'asc',
          });
        } else {
          CommonUtils.getCurrentLocation(
            async location => {
              await getCustomer({
                long: location.coords.longitude,
                lat: location.coords.latitude,
                field_order: 'distance',
                order_by: 'asc',
              });
            },
            async () => {
              await getCustomer();
            },
          );
        }
      }
    } else {
      setFilterParams({router: all_route});
      routeTodayRef.current = all_route;
      if (location?.coords && Object.keys(location?.coords).length > 0) {
        await getCustomer({
          long: location.coords.longitude,
          lat: location.coords.latitude,
          field_order: 'distance',
          order_by: 'asc',
        });
      } else {
        CommonUtils.getCurrentLocation(
          async location => {
            await getCustomer({
              long: location.coords.longitude,
              lat: location.coords.latitude,
              field_order: 'distance',
              order_by: 'asc',
            });
          },
          async () => {
            await getCustomer();
          },
        );
      }
    }
  }, [customerType, listCustomer]);

  const getDataGroup = useCallback(async () => {
    if (customerType.length === 0) {
      const response: any = await getCustomerType();
      if (response?.result?.length > 0) {
        dispatch(setListCustomerType(response?.result));
      }
    }
  }, [[]]);

  const getData = useCallback(async () => {
    setLoading(true);
    if (listCustomerRoute && listCustomerRoute.length === 0) {
      await getCustomerRoute();
    } else {
      setLoading(false);
    }
    if (customerType && customerType.length === 0) {
      getDataGroup();
    } else {
      setLoading(false);
    }

    setLoading(false);
  }, [listCustomerRoute, customerType]);

  const handleReset = useCallback(async () => {
    try {
      setLoading(true);
      setFilterParams({router: routeTodayRef.current});
      if (location?.coords && Object.keys(location?.coords).length > 0) {
        await getCustomer({
          long: location.coords.longitude,
          lat: location.coords.latitude,
          field_order: 'distance',
          order_by: 'asc',
        });
      } else {
        CommonUtils.getCurrentLocation(async location => {
          await getCustomer({
            long: location.coords.longitude,
            lat: location.coords.latitude,
            router: routeTodayRef.current.channel_code,
            field_order: 'distance',
            order_by: 'asc',
          });
        });
      }
      // await getCustomerRoute();
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterData = useCallback(async () => {
    bottomSheetRef.current && bottomSheetRef.current.close();
    try {
      setLoading(true);

      if (
        Object.keys(filterParams).length > 0 &&
        location?.coords &&
        Object.keys(location?.coords).length > 0
      ) {
        const birthDayObj: any =
          filterParams?.birthDay && filterParams.birthDay === getLabel('today')
            ? CommonUtils.dateToDate('today')
            : filterParams.birthDay === getLabel('thisWeek')
            ? CommonUtils.dateToDate('weekly')
            : filterParams.birthDay === getLabel('thisMonth')
            ? CommonUtils.dateToDate('monthly')
            : undefined;
        const params: IListVisitParams = {
          router: filterParams?.router ? filterParams.router.channel_code : '',
          checkin_status:
            filterParams?.status && filterParams.status === getLabel('visited')
              ? 'is_checkin'
              : filterParams?.status &&
                filterParams.status === getLabel('notVisited')
              ? 'not_checkin'
              : 'all',
          // order_by:
          //   filterParams?.order_by && filterParams.order_by === 'A -> Z'
          //     ? 'asc'
          //     : 'desc',
          birthday_from: birthDayObj
            ? new Date(birthDayObj.from_date).getTime() / 1000
            : '',
          birthday_to: birthDayObj
            ? new Date(birthDayObj.to_date).getTime() / 1000
            : '',
          customer_group: filterParams?.customer_group
            ? filterParams.customer_group
            : '',
          customer_type: filterParams?.customer_type
            ? filterParams.customer_type
            : '',

          field_order: 'distance',
          long: location.coords.longitude,
          lat: location.coords.latitude,
        };
        filterDataRef.current = params;
        await getCustomer(params);
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  }, [filterParams, listCustomer]);

  const handleRegainLocation = useCallback(async () => {
    CommonUtils.getCurrentLocation(
      locations => {
        setLocation(locations);
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [locations.coords.longitude, locations.coords.latitude],
            1000,
          );
      },
      err => backgroundErrorListener(err.code),
    );
  }, [location]);

  // console.log(customerDataSort, 'â');

  const handleSearchVisit = useCallback(async () => {
    try {
      setLoading(true);
      if (Object.keys(filterDataRef.current).length > 0) {
        await getCustomer({
          ...filterDataRef.current,
          search_key: searchVisit,
        });
        // sortDataCustomer(distanceFilterValue);
      } else {
        await getCustomer({
          ...filterParams,
          router: filterParams?.router?.channel_code,
          search_key: searchVisit,
        });
        // sortDataCustomer(distanceFilterValue);
      }
    } catch (er) {
      console.log('errDispatch: ', er);
    } finally {
      setLoading(false);
    }
  }, [listCustomer, searchVisit]);

  const handleCheckin = useCallback(
    (
      item: VisitListItemType,
      isDetail: boolean,
      coords: any,
      detailAdd?: any,
    ) => {
      // let log: LocationProps = JSON.parse(item.customer_location_primary!);
      let uniqueID = new ObjectId();
      CommonUtils.getCurrentLocation(
        location => {
          let distanceCal = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            coords.lat,
            coords.lon,
          );
          let data: CheckinData = {
            checkin_id:
              dataCheckIn &&
              dataCheckIn?.kh_ma === item.customer_code &&
              dataCheckIn.checkin_id !== undefined
                ? dataCheckIn.checkin_id
                : uniqueID,
            kh_ma: item.customer_code,
            kh_ten: item.customer_name,
            kh_diachi:
              item.customer_primary_address === null
                ? detailAdd
                : item.customer_primary_address.address_title,
            kh_long: coords.lon || '',
            kh_lat: coords.lat || '',
            checkin_giovao: new Date().getTime() / 1000,
            checkin_pinvao:
              batteryLevel > 0
                ? Math.round(batteryLevel * 10000) / 100
                : -Math.round(batteryLevel * 10000) / 100,
            checkin_khoangcach: distanceCal,
            createdDate: moment(new Date()).valueOf(),
            checkin_timegps: moment(new Date(location.timestamp * 1000)).format(
              'hh:mm',
            ),
            checkin_dochinhxac: location.coords.accuracy,
            checkinvalidate_khoangcachcheckin:
              systemConfig.saiso_chophep_kb_vitringoaisaiso,
            checkinvalidate_khoangcachcheckout:
              systemConfig.saiso_chophep_checkout_ngoaisaiso,
            checkin_trangthaicuahang: true,
            checkin_donhang: '',
            checkin_giora: null,
            checkin_hinhanh: [],
            checkin_lat: location.coords.latitude,
            checkin_long: location.coords.longitude,
            checkin_pinra: 0,
            checkout_khoangcach: 0,
            createByName: '',
            createdByEmail: '',
            item: item,
            ...item,
          };
          setModalAlert(prev => ({...prev, status: false}));
          dispatch(appActions.setDataCheckIn(data));
          if (isDetail) {
            navigate(ScreenConstant.VISIT_DETAIL, {data});
          } else {
            //set CheckIn Time:
            CommonUtils.storage.set(
              AppConstant.CheckinTime,
              new Date().getTime(),
            );
            navigate(ScreenConstant.CHECKIN, {
              item: data,
              isLocation: false,
              screen: ScreenConstant.LIST_VISIT,
            });
          }
        },
        error => backgroundErrorListener(error.code),
      );
    },
    [],
  );

  const handleCompareDistance = useCallback(
    (item: VisitListItemType, isDetail: boolean) => {
      let location: LocationProps = JSON.parse(item.customer_location_primary!);
      currentSelect.current = item;
      startTransition(() => {
        // handleEnabledPressed();
      });
      if (!isEnable.current && Platform.OS === 'android') {
        setModalErrorGPS(true);
      } else if (item.customer_location_primary != null) {
        setModalAlert({
          type: 'loading',
          status: true,
        });
        setTimeout(() => {
          startEffect(() => {
            CommonUtils.getCurrentLocation(curLocation => {
              let data = calculateDistance(
                curLocation.coords.latitude,
                curLocation.coords.longitude,
                location?.lat,
                location.long,
              );
              if (
                data >
                  (systemConfig.saiso_chophep_kb_vitringoaisaiso +
                    AppConstant.additional_distance) /
                    1000 &&
                isDetail === false
              ) {
                currentSelect.current = item;
                setModalAlert(prev => ({
                  ...prev,
                  type: 'warn',
                  cal:
                    data -
                    (systemConfig.saiso_chophep_kb_vitringoaisaiso +
                      AppConstant.additional_distance) /
                      1000,
                }));
              } else {
                setModalAlert(prev => ({
                  ...prev,
                  status: false,
                }));
                setTimeout(() => handleBackground(item), 500);
              }
            });
          });
        }, 1000);
      } else {
        setModalUpdateLocation({
          status: true,
          isDetail: false,
        });
      }
    },
    [modalAlert.status, modalUpdateLocation.status, currentSelect.current],
  );

  const handleBackground = useCallback((item: VisitListItemType) => {
    let log: LocationProps = JSON.parse(item.customer_location_primary!);
    setModalAlert({status: true, type: 'loading'});
    let uniqueID = new ObjectId();
    CommonUtils.getCurrentLocation(
      location => {
        let distanceCal = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          log?.lat,
          log?.long,
        );
        let data: CheckinData = {
          checkin_id:
            dataCheckIn &&
            dataCheckIn?.kh_ma === item.customer_code &&
            dataCheckIn.checkin_id !== undefined
              ? dataCheckIn.checkin_id
              : uniqueID,
          kh_ma: item.customer_code,
          kh_ten: item.customer_name,
          kh_diachi: item.customer_primary_address?.address_title ?? null,
          kh_long: log.long ?? '',
          kh_lat: log.lat ?? '',
          checkin_giovao: new Date().getTime() / 1000,
          checkin_pinvao:
            batteryLevel > 0
              ? Math.round(batteryLevel * 10000) / 100
              : -Math.round(batteryLevel * 10000) / 100,
          checkin_khoangcach: distanceCal,
          createdDate: moment(new Date()).valueOf(),
          checkin_timegps: moment(new Date(location.timestamp * 1000)).format(
            'hh:mm',
          ),
          checkin_dochinhxac: location.coords.accuracy,
          checkinvalidate_khoangcachcheckin:
            systemConfig.saiso_chophep_kb_vitringoaisaiso,
          checkinvalidate_khoangcachcheckout:
            systemConfig.saiso_chophep_checkout_ngoaisaiso,
          checkin_trangthaicuahang: true,
          checkin_donhang: '',
          checkin_giora: null,
          checkin_hinhanh: [],
          checkin_lat: location.coords.latitude,
          checkin_long: location.coords.longitude,
          checkin_pinra: 0,
          checkout_khoangcach: 0,
          createByName: '',
          createdByEmail: '',
          item: item,
          isDetail: false,
          ...item,
        };

        dispatch(appActions.setDataCheckIn(data));
        setModalAlert(prev => ({...prev, status: false}));
        //set CheckIn Time:
        CommonUtils.storage.set(AppConstant.CheckinTime, new Date().getTime());
        //navigation
        navigate(ScreenConstant.CHECKIN, {
          item: data,
        });
      },
      error => backgroundErrorListener(error.code),
    );
  }, []);

  const onPressToDetail = useCallback(
    async (item: VisitListItemType) => {
      currentSelect.current = item;
      if (Platform.OS === 'android') {
        const checkEnabled: boolean = await isLocationEnabled();
        if (checkEnabled) {
          setModalErrorGPS(false);
          startEffect(() => {
            let log: LocationProps = JSON.parse(
              item.customer_location_primary!,
            );
            let uniqueID = new ObjectId();
            startEffect(() => {
              CommonUtils.getCurrentLocation(
                location => {
                  let distanceCal = calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    log?.lat || 0,
                    log?.long || 0,
                  );
                  let data: any = {
                    checkin_id:
                      dataCheckIn &&
                      dataCheckIn?.kh_ma === item.customer_code &&
                      dataCheckIn.checkin_id !== undefined
                        ? dataCheckIn.checkin_id
                        : uniqueID,
                    kh_ma: item.customer_code,
                    kh_ten: item.customer_name,
                    kh_diachi:
                      item.customer_primary_address?.address_title ?? null,
                    kh_long: log?.long ?? '',
                    kh_lat: log?.lat ?? '',
                    checkin_giovao: new Date().getTime() / 1000,
                    checkin_pinvao:
                      batteryLevel > 0
                        ? Math.round(batteryLevel * 10000) / 100
                        : -Math.round(batteryLevel * 10000) / 100,
                    checkin_khoangcach: distanceCal,
                    createdDate: moment(new Date()).valueOf(),
                    checkin_timegps: moment(
                      new Date(location.timestamp * 1000),
                    ).format('hh:mm'),
                    checkin_dochinhxac: location.coords.accuracy,
                    checkinvalidate_khoangcachcheckin:
                      systemConfig.saiso_chophep_kb_vitringoaisaiso,
                    checkinvalidate_khoangcachcheckout:
                      systemConfig.saiso_chophep_checkout_ngoaisaiso,
                    checkin_trangthaicuahang: true,
                    checkin_donhang: '',
                    checkin_giora: null,
                    checkin_hinhanh: [],
                    checkin_lat: location.coords.latitude,
                    checkin_long: location.coords.longitude,
                    checkin_pinra: 0,
                    checkout_khoangcach: 0,
                    createByName: '',
                    createdByEmail: '',
                    item: item,
                    isDetail: true,
                    ...item,
                  };

                  // setModalAlert(prev => ({...prev, status: false}));

                  navigate(ScreenConstant.VISIT_DETAIL, {
                    data: data,
                  });
                  dispatch(appActions.setDataCheckIn(data));
                },
                error => backgroundErrorListener(error.code),
              );
            });
          });
        } else {
          setModalErrorGPS(true);
        }
      } else {
        startEffect(() => {
          let log: LocationProps = JSON.parse(item.customer_location_primary!);
          let uniqueID = new ObjectId();
          startEffect(() => {
            CommonUtils.getCurrentLocation(
              location => {
                let distanceCal = calculateDistance(
                  location.coords.latitude,
                  location.coords.longitude,
                  log?.lat || 0,
                  log?.long || 0,
                );
                let data: any = {
                  checkin_id:
                    dataCheckIn &&
                    dataCheckIn?.kh_ma === item.customer_code &&
                    dataCheckIn.checkin_id !== undefined
                      ? dataCheckIn.checkin_id
                      : uniqueID,
                  kh_ma: item.customer_code,
                  kh_ten: item.customer_name,
                  kh_diachi:
                    item.customer_primary_address?.address_title ?? null,
                  kh_long: log?.long ?? '',
                  kh_lat: log?.lat ?? '',
                  checkin_giovao: new Date().getTime() / 1000,
                  checkin_pinvao:
                    batteryLevel > 0
                      ? Math.round(batteryLevel * 10000) / 100
                      : -Math.round(batteryLevel * 10000) / 100,
                  checkin_khoangcach: distanceCal,
                  createdDate: moment(new Date()).valueOf(),
                  checkin_timegps: moment(
                    new Date(location.timestamp * 1000),
                  ).format('hh:mm'),
                  checkin_dochinhxac: location.coords.accuracy,
                  checkinvalidate_khoangcachcheckin:
                    systemConfig.saiso_chophep_kb_vitringoaisaiso,
                  checkinvalidate_khoangcachcheckout:
                    systemConfig.saiso_chophep_checkout_ngoaisaiso,
                  checkin_trangthaicuahang: true,
                  checkin_donhang: '',
                  checkin_giora: null,
                  checkin_hinhanh: [],
                  checkin_lat: location.coords.latitude,
                  checkin_long: location.coords.longitude,
                  checkin_pinra: 0,
                  checkout_khoangcach: 0,
                  createByName: '',
                  createdByEmail: '',
                  item: item,
                  isDetail: true,
                  ...item,
                };

                // setModalAlert(prev => ({...prev, status: false}));

                navigate(ScreenConstant.VISIT_DETAIL, {
                  data: data,
                });
                dispatch(appActions.setDataCheckIn(data));
              },
              error => backgroundErrorListener(error.code),
            );
          });
        });
      }
    },
    [modalErrorGPS],
  );

  const onBackButtonPress = useCallback(() => {
    setModalUpdateLocation(prev => ({...prev, status: false}));
    // sortDataCustomer(distanceFilterValue);
  }, []);

  useEffect(() => {
    const checkGPS = async () => {
      if (Platform.OS === 'android') {
        const checkEnabled: boolean = await isLocationEnabled();
        if (checkEnabled) {
          isEnable.current = checkEnabled;
        }
      }
    };
    checkGPS();
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (searchVisit) {
      handleSearchVisit();
    } else {
      startEffect(() => {
        getData();
      });

      return () => {
        mounted.current = false;
      };
    }
  }, [searchVisit]);

  useEffect(() => {
    if (isRefreshVisitWhenCheckOut) {
      dispatch(checkinActions.setRefreshVisitWhenCheckOut(false));
      onRefreshData();
    }
  }, [isRefreshVisitWhenCheckOut]);

  useEffect(() => {
    if (listCustomer.data && listCustomer.data.length > 0) {
      // sortDataCustomer(distanceFilterValue);
    } else {
      setCustomerData([]);
    }
  }, [listCustomer, distanceFilterValue]);

  return (
    <SafeAreaView
      edges={['bottom', 'top']}
      style={{backgroundColor: colors.bg_neutral, paddingHorizontal: 0}}>
      {_renderHeader()}

      {modalErrorGPS ? (
        <>
          {/* <SkeletonLoading /> */}
          <Modal
            isVisible={modalErrorGPS}
            backdropOpacity={0.5}
            onBackButtonPress={() => setModalErrorGPS(false)}
            style={{marginHorizontal: 0}}
            onBackdropPress={() => setModalErrorGPS(false)}
            animationIn="slideInUp"
            animationOut="slideOutDown">
            <Block
              colorTheme="bg_default"
              height={230}
              marginLeft={16}
              marginRight={16}
              borderRadius={16}>
              <Block justifyContent="center" alignItems="center" marginTop={8}>
                <AppImage source="ErrorApiIcon" size={50} />
              </Block>
              <Block justifyContent="center" paddingVertical={8}>
                <Text
                  textAlign="center"
                  fontSize={16}
                  fontWeight="500"
                  lineHeight={27}
                  colorTheme="text_primary">
                  Vui lòng bật GPS để tiếp tục
                </Text>
              </Block>
              <Block
                paddingHorizontal={16}
                justifyContent="center"
                alignItems="center"
                direction="row">
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={onPresClose}>
                  <Text colorTheme="white" fontSize={16} fontWeight="500">
                    {getLabel('close')}
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </Modal>
        </>
      ) : (
        <>
          <RenderContent
            isShowListVisit={isShowListVisit}
            flatListRef={flatlistRef}
            customerDataSort={customerDataSort}
            listCustomer={listCustomer}
            loading={loading}
            visitItemSelected={visitItemSelected}
            location={location}
            mapboxCameraRef={mapboxCameraRef}
            onScroll={onScroll}
            onRefreshData={onRefreshData}
            setVisitItemSelected={setVisitItemSelected}
            slideSizeRef={slideSizeRef}
            onPressToDetail={onPressToDetail}
            handleCompareDistance={handleCompareDistance}
            handleRegainLocation={handleRegainLocation}
            handleEnabledPressed={handleEnabledPressed}
            setShowListVisit={setShowListVisit}
            onEndReachedThreshold={onEndReachedThreshold}
          />
          <FilterContainer
            bottomSheetRef={bottomSheetRef}
            filterRef={filterRef}
            filterValue={filterParams}
            setFilter={setFilterParams}
            channelData={listCustomerRoute}
            customerGroupData={customerType}
            handleFilter={handleFilterData}
            handleReset={handleReset}
          />
          <AppBottomSheet bottomSheetRef={distanceRef}>
            <FilterListComponent
              title={getLabel('distance')}
              data={distanceFilterData}
              handleItem={handleItemDistanceFilter}
            />
          </AppBottomSheet>

          <ModalAlert
            show={modalAlert}
            handleCheckin={handleBackground}
            setShow={setModalAlert}
            item={currentSelect.current}
            currentLocation={currentLocation}
          />
          <ModalUpdateLocation
            isVisible={modalUpdateLocation}
            handleCheckin={handleCheckin}
            // setVisible={setModalUpdateLocation}
            item={currentSelect.current}
            currentLocation={currentLocation}
            onBackButtonPress={onBackButtonPress}
          />
        </>
      )}
    </SafeAreaView>
  );
};
export default memo(ListVisit, isEqual);

const rootStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    map: {
      overflow: 'hidden',
      width: '100%',
      height: AppConstant.HEIGHT * 0.8,
    },
    distanceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxWidth: 180,
    },
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 16,
      right: 0,
      zIndex: 99999999,
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
      marginRight: 8,
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
    rootHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      marginBottom: 16,
    } as ViewStyle,
    labelStyle: {
      fontSize: 24,
      color: theme.colors.text_primary,
      lineHeight: 25,
      fontWeight: '500',
      textAlign: 'left',
      // alignSelf:'flex-end'
    } as TextStyle,
    titleText: {
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
    iconStyle: {
      width: 16,
      height: 16,
      marginRight: 4,
    } as ImageStyle,
    contentSecondText: {
      color: '#000',
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
  });
