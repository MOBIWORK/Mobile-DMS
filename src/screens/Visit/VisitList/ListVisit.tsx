import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppBottomSheet,
  AppHeader,
  FilterView,
} from '../../../components/common';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation/screen-type';
import {ListCustomerType, VisitListItemType} from '../../../models/types';
import VisitItem, {LocationProps} from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import {AppConstant, ScreenConstant} from '../../../const';
import Mapbox from '@rnmapbox/maps';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import SkeletonLoading from '../SkeletonLoading';
import {calculateDistance, useSelector} from '../../../config/function';
import {useTranslation} from 'react-i18next';

import {appActions} from '../../../redux-store/app-reducer/reducer';
import {
  customerActions,
  setListCustomerType,
} from '../../../redux-store/customer-reducer/reducer';

import {
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
// @ts-ignore
import StringFormat from 'string-format';
import MarkerItem from '../../../components/common/MarkerItem';
import {GeolocationResponse} from '@react-native-community/geolocation';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const ListVisit = () => {
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const styles = rootStyles(useTheme());

  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const filterRef = useRef<BottomSheet>(null);
  const distanceRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const systemConfig = useSelector(state => state.app.systemConfig);
  const listCustomer: VisitListItemType[] = useSelector(
    state => state.customer.listCustomerVisit,
  );
  const lisCustomerRoute = useSelector(
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

  const [distanceFilterValue, setDistanceFilterValue] = useState<string>(
    getLabel('nearest'),
  );
  const [distanceFilterData, setDistanceFilterData] = useState<IFilterType[]>(
    AppConstant.DistanceFilterData,
  );
  const dispatch = useDispatch();

  //refresh data
  const filterDataRef = useRef<IListVisitParams>({});

  const [filterParams, setFilterParams] = useState<IListVisitParams>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isShowListVisit, setShowListVisit] = useState<boolean>(true);
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [error, setError] = useState<string>('');
  const mounted = useRef<boolean>(true);
  const [visitItemSelected, setVisitItemSelected] =
    useState<VisitListItemType | null>(null);

  const backgroundErrorListener = useCallback((errorCode: number) => {
    // Handle background location errors
    switch (errorCode) {
      case 0:
        setError(
          'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
        );
        break;
      case 1:
        setError('GPS đã bị tắt. Vui lòng bật lại.');
        break;
      default:
        setError('Kết nỗi mạng không ổn định. Bạn nên kết nối lại và thử lại');
    }
  }, []);

  const customerCheckinCount = useMemo(() => {
    if (listCustomer && customerDataSort && customerDataSort.length > 0) {
      return customerDataSort.filter(item => item.is_checkin).length;
    } else {
      return '';
    }
  }, [listCustomer, customerDataSort]);

  const onRefreshData = useCallback(async () => {
    try {
      setLoading(true);
      await getCustomer(filterDataRef.current);
    } catch (er) {
      console.log('errDispatch: ', er);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleItemDistanceFilter = (itemData: IFilterType) => {
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
    sortDataCustomer(getLabel(itemData.label));
  };

  const presentMap = (item: VisitListItemType) => {
    const item_location: any = JSON.parse(item.customer_location_primary);
    console.log('item_location', item_location.long);
    CommonUtils.sleep(100).then(() => {
      mapboxCameraRef.current &&
        mapboxCameraRef.current.moveTo(
          [Number(item_location.long), Number(item_location.lat)],
          1000,
        );
    });

    setShowListVisit(false);
    setVisitItemSelected(item);
  };

  const _renderHeader = () => {
    return (
      <View style={{paddingHorizontal: 16}}>
        <AppHeader
          hiddenBackButton
          label={getLabel('visit')}
          labelStyle={{textAlign: 'left'}}
          rightButton={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  setShowListVisit(!isShowListVisit);
                  setVisitItemSelected(null);
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
                onPress={() =>
                  navigation.navigate(ScreenConstant.SEARCH_VISIT)
                }>
                <Image
                  source={ImageAssets.SearchIcon}
                  style={{width: 28, height: 28, marginLeft: 16}}
                  tintColor={colors.text_secondary}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 16,
          }}>
          <TouchableOpacity
            onPress={() =>
              distanceRef.current && distanceRef.current.snapToIndex(0)
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              maxWidth: 180,
            }}>
            <Text style={{color: colors.text_secondary}}>
              {getLabel('distance')}:
            </Text>
            <Text style={{color: colors.text_primary, marginLeft: 8}}>
              {distanceFilterValue}
            </Text>
          </TouchableOpacity>
          <FilterView
            style={{marginLeft: 12}}
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
            }
          />
        </View>
      </View>
    );
  };

  const _renderContent = () => {
    return (
      <View style={{marginTop: 8}}>
        {isShowListVisit ? (
          <View style={{marginTop: 16, paddingHorizontal: 16}}>
            <Text style={{color: colors.text_secondary}}>
              {StringFormat(getLabel('customerVisitedCount'), {
                customerCheckinCount: customerCheckinCount,
                allCustomer: customerDataSort?.length,
              })}
            </Text>
            {loading ? (
              <SkeletonLoading />
            ) : (
              <FlatList
                style={{height: '85%'}}
                showsVerticalScrollIndicator={false}
                data={customerDataSort ?? listCustomer}
                keyExtractor={(item, index) =>
                  `${item.customer_code} - ${index}`
                }
                decelerationRate={'fast'}
                // bounces={false}
                initialNumToRender={5}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefreshData}
                  />
                }
                maxToRenderPerBatch={2}
                updateCellsBatchingPeriod={20}
                contentContainerStyle={{rowGap: 16}}
                renderItem={({item}) => (
                  <VisitItem
                    item={item}
                    handleOpenMap={() => presentMap(item)}
                    // onPress={handleBackground}
                  />
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.map as ViewStyle}>
            <Mapbox.MapView
              pitchEnabled={false}
              attributionEnabled={false}
              scaleBarEnabled={false}
              styleURL={Mapbox.StyleURL.Street}
              logoEnabled={false}
              style={{flex: 1}}>
              <Mapbox.RasterSource
                id="adminmap"
                tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
                <Mapbox.RasterLayer
                  id={'adminmap'}
                  sourceID={'admin'}
                  style={{visibility: 'visible'}}
                />
              </Mapbox.RasterSource>
              {location?.coords && (
                <Mapbox.Camera
                  ref={mapboxCameraRef}
                  centerCoordinate={[
                    location?.coords.longitude,
                    location?.coords.latitude,
                  ]}
                  animationMode={'flyTo'}
                  animationDuration={500}
                  zoomLevel={12}
                />
              )}
              {customerDataSort &&
                customerDataSort.map((item, index) => {
                  if (item.customer_location_primary) {
                    const newLocation: LocationProps = JSON.parse(
                      item.customer_location_primary!,
                    );
                    return (
                      <Mapbox.MarkerView
                        key={index}
                        coordinate={[
                          Number(newLocation.long),
                          Number(newLocation.lat),
                        ]}>
                        <MarkerItem
                          item={item}
                          index={index}
                          onPress={() => setVisitItemSelected(item)}
                        />
                      </Mapbox.MarkerView>
                    );
                  } else {
                    return null;
                  }
                })}
              <Mapbox.UserLocation
                visible={true}
                animated
                androidRenderMode="gps"
                showsUserHeadingIndicator={true}
              />
            </Mapbox.MapView>
            <TouchableOpacity
              onPress={handleRegainLocation}
              style={styles.regainPosition}>
              <Image
                source={ImageAssets.MapIcon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
                tintColor={colors.bg_default}
              />
              <Text style={{color: colors.bg_default, marginLeft: 4}}>
                {getLabel('currentPosition')}
              </Text>
            </TouchableOpacity>
            {visitItemSelected && (
              <View
                style={{
                  position: 'absolute',
                  bottom: bottom + 70,
                  left: 24,
                  right: 24,
                }}>
                <VisitItem
                  item={visitItemSelected}
                  handleClose={() => setVisitItemSelected(null)}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  useLayoutEffect(() => {
    if (Object.keys(systemConfig).length < 0) {
      dispatch(appActions.onGetSystemConfig());
    }
    CommonUtils.getCurrentLocation(locations => setLocation(locations));
  }, []);

  const getCustomer = async (params?: IListVisitParams) => {
    await getCustomerVisit(params).then((res: any) => {
      if (Object.keys(res.result).length > 0) {
        const data: VisitListItemType[] = res?.result.data;
        // const newData = data.filter(item => item.customer_location_primary);
        dispatch(customerActions.setCustomerVisit(data));
      }
    });
  };

  const sortDataCustomer = (distanceLabel: string) => {
    if (listCustomer && listCustomer.length > 0) {
      const filteredData = listCustomer.filter(
        item => item.customer_location_primary != null,
      );
      const noLocationCustomer = listCustomer.filter(
        item => item.customer_location_primary === null,
      );
      const sortedData = () => {
        return filteredData.slice().sort((a, b) => {
          const locationA: LocationProps = JSON.parse(
            a.customer_location_primary,
          );
          const locationB: LocationProps = JSON.parse(
            b.customer_location_primary,
          );
          const distance1 = calculateDistance(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            locationA.lat,
            locationA.long,
          );
          const distance2 = calculateDistance(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            locationB.lat,
            locationB.long,
          );
          return distanceLabel === getLabel('nearest')
            ? distance1 - distance2
            : distance2 - distance1;
        });
      };
      setCustomerData([...sortedData(), ...noLocationCustomer]);
    } else {
      getCustomer();
    }
  };

  const getCustomerRoute = async () => {
    if (lisCustomerRoute.length === 0) {
      const response: any = await CustomerService.getCustomerRoute();
      if (response?.result.length > 0) {
        dispatch(customerActions.setListCustomerRoute(response.result));
      }
    }
  };

  const getDataGroup = async () => {
    if (customerType.length === 0) {
      const response: any = await getCustomerType();
      if (response?.result?.length > 0) {
        dispatch(setListCustomerType(response?.result));
      }
    }
  };

  const getData = async () => {
    setLoading(true);
    await sortDataCustomer(distanceFilterValue);
    await getCustomerRoute();
    await getDataGroup();
    setLoading(false);
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await getCustomer();
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleFilterData = async () => {
    bottomSheetRef.current && bottomSheetRef.current.close();
    try {
      setLoading(true);
      if (Object.keys(filterParams).length > 0) {
        const birthDayObj: any =
          filterParams?.birthDay && filterParams.birthDay === getLabel('today')
            ? CommonUtils.dateToDate('today')
            : filterParams.birthDay === getLabel('thisWeek')
            ? CommonUtils.dateToDate('weekly')
            : filterParams.birthDay === getLabel('thisMonth')
            ? CommonUtils.dateToDate('monthly')
            : undefined;
        const params: IListVisitParams = {
          router: filterParams?.router && filterParams.router.channel_code,
          // status:
          //   filterParams?.status && filterParams.status === getLabel('visited')
          //     ? 'active'
          //     : 'lock',
          order_by:
            filterParams?.order_by && filterParams.order_by === 'A -> Z'
              ? 'asc'
              : 'desc',
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
        };
        filterDataRef.current = params;
        await getCustomer(params);
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleRegainLocation = async () => {
    CommonUtils.getCurrentLocation(locations => {
      setLocation(locations);
      mapboxCameraRef.current &&
        mapboxCameraRef.current.moveTo(
          [locations.coords.longitude, locations.coords.latitude],
          1000,
        );
    },err => backgroundErrorListener(err.code));
  };

  useEffect(() => {
    mounted.current = true;
    getData().then();
    return () => {
      mounted.current = false;
    };
  }, [listCustomer]);

  return (
    <SafeAreaView
      style={{backgroundColor: colors.bg_neutral, paddingHorizontal: 0}}>
      {_renderHeader()}
      {_renderContent()}
      <FilterContainer
        bottomSheetRef={bottomSheetRef}
        filterRef={filterRef}
        filterValue={filterParams}
        setFilter={setFilterParams}
        channelData={lisCustomerRoute}
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
    </SafeAreaView>
  );
};
export default memo(ListVisit);

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
  });
