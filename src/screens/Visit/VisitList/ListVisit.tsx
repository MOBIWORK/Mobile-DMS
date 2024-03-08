import React, {
  FC,
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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import {ListCustomerType, VisitListItemType} from '../../../models/types';
import VisitItem, {LocationProps} from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import {AppConstant, ScreenConstant} from '../../../const';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import SkeletonLoading from '../SkeletonLoading';
import {useSelector} from '../../../config/function';
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
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import MarkerItem from '../../../components/common/MarkerItem';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const ListVisit = () => {
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const styles = rootStyles(useTheme());

  const mapboxCameraRef = useRef<CameraRef>(null);
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

  const [distanceFilterValue, setDistanceFilterValue] = useState<string>(
    getLabel('nearest'),
  );
  const [distanceFilterData, setDistanceFilterData] = useState<IFilterType[]>(
    AppConstant.DistanceFilterData,
  );
  const dispatch = useDispatch();

  const [filterParams, setFilterParams] = useState<IListVisitParams>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isShowListVisit, setShowListVisit] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
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
    if (listCustomer && listCustomer.length > 0) {
      return listCustomer.filter(item => item.is_checkin).length;
    } else {
      return '';
    }
  }, [listCustomer]);

  const handleBackground = () => {
    BackgroundGeolocation.getCurrentPosition(
      {samples: 1, timeout: 3},
      location => {
        console.log('location: ', location);
      },
      backgroundErrorListener,
    );
  };

  const handleItemDistanceFilter = (itemData: IFilterType) => {
    setDistanceFilterValue(getLabel(itemData.label));
    const newData = distanceFilterData.map(item => {
      if (itemData.value === item.value) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setDistanceFilterData(newData);
  };

  const presentMap = (item: VisitListItemType) => {
    const item_location: any = JSON.parse(item.customer_location_primary);
    mapboxCameraRef.current &&
      mapboxCameraRef.current.moveTo(
        [item_location.long, item_location.lat],
        1000,
      );
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
                onPress={() => setShowListVisit(!isShowListVisit)}>
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
                allCustomer: listCustomer?.length,
              })}
            </Text>
            {loading ? (
              <SkeletonLoading />
            ) : (
              <FlatList
                style={{height: '85%'}}
                showsVerticalScrollIndicator={false}
                data={listCustomer}
                keyExtractor={(item, index) => item.customer_code}
                decelerationRate={'fast'}
                bounces={false}
                initialNumToRender={5}
                contentContainerStyle={{rowGap: 16}}
                renderItem={({item}) => (
                  <VisitItem
                    item={item}
                    handleOpenMap={() => presentMap(item)}
                    onPress={handleBackground}
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
              <Mapbox.Camera
                centerCoordinate={[
                  location?.coords.longitude ?? 0,
                  location?.coords.latitude ?? 0,
                ]}
                animationMode={'flyTo'}
                animationDuration={500}
                zoomLevel={12}
              />
              {listCustomer &&
                listCustomer.map((item, index) => {
                  const location: LocationProps = JSON.parse(
                    item.customer_location_primary!,
                  );
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      coordinate={[
                        Number(location.long),
                        Number(location.lat),
                      ]}>
                      <MarkerItem
                        item={item}
                        index={index}
                        onPress={item => setVisitItemSelected(item)}
                      />
                    </Mapbox.MarkerView>
                  );
                })}
              <Mapbox.UserLocation
                visible={true}
                animated
                androidRenderMode="gps"
                showsUserHeadingIndicator={true}
              />
            </Mapbox.MapView>
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
    BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      timeout: 3,
    })
      .then(location => setLocation(location))
      .catch(e => console.log('err', e));
  }, []);

  const getCustomer = async (params?: IListVisitParams) => {
    await getCustomerVisit(params).then((res: any) => {
      if (Object.keys(res.result).length > 0) {
        const data: VisitListItemType[] = res?.result.data;
        const newData = data.filter(item => item.customer_location_primary);
        dispatch(customerActions.setCustomerVisit(newData));
      }
    });
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
    await getCustomerRoute();
    await getDataGroup();
    setLoading(false);
  };

  const handleFilterData = async () => {
    bottomSheetRef.current && bottomSheetRef.current.close();
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
        route: filterParams?.route && [`${filterParams.route.name}`],
        status:
          filterParams?.status && filterParams.status === getLabel('visited')
            ? 'active'
            : 'lock',
        orderby:
          filterParams?.orderby && filterParams.orderby === 'A -> Z'
            ? 'asc'
            : 'desc',
        birthday_from:
          birthDayObj && new Date(birthDayObj.from_date).getTime() / 1000,
        birthday_to:
          birthDayObj && new Date(birthDayObj.to_date).getTime() / 1000,
        customer_group:
          filterParams?.customer_group && filterParams.customer_group,
        customer_type:
          filterParams?.customer_type && filterParams.customer_type,
      };
      await getCustomer(params);
    }
  };

  useEffect(() => {
    mounted.current = true;
    getData().then();
    return () => {
      mounted.current = false;
    };
  }, []);

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
  });
