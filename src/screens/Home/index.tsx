import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  View,
  Text,
  Linking,
  Platform,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  VirtualizedList,
  CellRendererProps,
} from 'react-native';
import codePush, {DownloadProgress} from 'react-native-code-push';
import {IconButton} from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {ApiConstant, AppConstant, ScreenConstant} from '../../const';
import ItemNotification from '../../components/Notification/ItemNotification';
import BarChartStatistical from './BarChart';
import {AppAvatar, Block} from '../../components/common';
import {useTheme} from '../../layouts/theme';
import {DataConstant} from '../../const';

import {
  IKpi,
  IReportVisit,
  IReportRevenue,
  IReportSales,
  IResOrganization,
  IUser,
  IWidget,
  VisitListItemType,
} from '../../models/types';
import ItemWidget from '../../components/Widget/ItemWidget';
import NotificationScreen from './Notification';
import Mapbox from '@rnmapbox/maps';
import {rootStyles} from './styles';

import {dispatch} from '../../utils/redux';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {useDeepCompareEffect, useSelector} from '../../config/function';
import ModalUpdate from './components/ModalUpdate';
import {AppService, ReportService} from '../../services';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '../../navigation/screen-type';
import ModalErrorLocation from './components/ModalErrorLocation';
import {getCustomerVisit, IListVisitParams} from '../../services/appService';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {CommonUtils} from '../../utils';
import {onResetSearchValueOfVisit} from '../Visit/VisitList/SearchVisit';
import isEqual from 'react-fast-compare';
import TimeKeep from './components/TimeKeep';
import MapView from './components/MapView';
import CircleChartView from './components/CircleChartView';
import {shallowEqual} from 'react-redux';

const HomeScreen = () => {
  const {colors} = useTheme();
  const styles = rootStyles(useTheme());
  const bottomSheetNotification = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ['100%'], []);
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const isFocus = useIsFocused();

  const location = useRef<GeolocationResponse | null>(null);
  const [enabled, setEnabled] = React.useState(false);
  const userProfile: IUser = useSelector(
    state => state.app.userProfile,
    shallowEqual,
  );
  const listCustomerVisit: VisitListItemType[] = useSelector(
    state => state.customer.listCustomerVisit,
  );
  const [isPending, startCompare] = useTransition();
  const [updatePercent, setUpdatePercentage] = React.useState<number>(0);
  const [showModalHotUpdate, setShowModalHotUpdate] = useState(false);
  const [error, setError] = useState(
    'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
  );

  const syncWithCodePush = (status: number) => {
    console.log('Codepush sync status', status);
  };

  const [currentShit, setCurrentShit] = useState<any>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

  const [KpiValue, setKpiValue] = useState<IKpi | null>(null);
  const [salesValue, setSaleValue] = useState<IReportSales | null>(null);
  const [revenueValue, setRevenueValue] = useState<IReportRevenue | null>(null);
  const [visitValue, setVisitValue] = useState<IReportVisit>();
  const [widgets, setWidgets] = useMMKVString(AppConstant.Widget);
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);

  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );

  const [userNameStore] = useMMKVString(AppConstant.userNameStore);
  const [passwordStore] = useMMKVString(AppConstant.passwordStore);

  const getWidget = () => {
    if (!widgets) {
      const arrWg = DataConstant.DataWidget.slice(0, 4);
      setWidgets(JSON.stringify(arrWg));
    }
  };

  const renderUiWidget = useCallback(() => {
    return (
      <Block marginTop={16} marginBottom={16}>
        <View style={styles.widgetView}>
          <Text style={[styles.tilteSection]}>{getLabel('utilities')}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ScreenConstant.WIDGET_FVR_SCREEN)
            }>
            <Text style={[styles.tilteSection, {color: colors.action}]}>
              {getLabel('custom')}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={[styles.shadow, styles.editView]}>
            <View style={styles.containWidgetView}>
              {widgets &&
                JSON.parse(widgets).map((item: IWidget, i: any) => (
                  <View key={i} style={styles.containItemWidget}>
                    <ItemWidget
                      name={item.name}
                      source={item.icon}
                      navigate={item.navigate}
                    />
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Block>
    );
  }, [widgets]);

  const backgroundErrorListener = useCallback(
    (errorCode: number) => {
      // Handle background location errors
      switch (errorCode) {
        case 1:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          setEnabled(true);
          break;
        case 2:
          setError('GPS đã bị tắt. Vui lòng bật lại.');
          setEnabled(true);

          break;
        default:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          setEnabled(true);
          break;
      }
    },
    [location],
  );

  const renderUiStatistical = useCallback(() => {
    return (
      <Block marginTop={16} marginBottom={16}>
        <View style={[styles.flexSpace]}>
          <Text style={[styles.tilteSection]}>{getLabel('statistical')}</Text>
        </View>
        <View style={styles.containProgressView}>
          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3},
            ]}>
            <Text style={[styles.worksheetLb]}>{getLabel('revenue')}</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={KpiValue ? KpiValue.doanh_thu : 0}
                radius={16}
                borderWidth={5}
                color={colors.action}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}
              />
              <Text style={[styles.worksheetDt, {color: colors.action}]}>
                {KpiValue ? `${KpiValue.doanh_thu}` : 0} %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3, marginHorizontal: 15},
            ]}>
            <Text style={[styles.worksheetLb]}>{getLabel('sales')}</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={KpiValue ? KpiValue.doanh_so : 0}
                radius={16}
                borderWidth={5}
                color={colors.success}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}
              />
              <Text style={[styles.worksheetDt, {color: colors.success}]}>
                {KpiValue ? `${KpiValue.doanh_so}` : 0} %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3},
            ]}>
            <Text style={[styles.worksheetLb]}>{getLabel('order')}</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={KpiValue ? KpiValue.don_hang : 0}
                radius={16}
                borderWidth={5}
                color={colors.info}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}
              />
              <Text style={[styles.worksheetDt, {color: colors.info}]}>
                {KpiValue ? `${KpiValue.don_hang}` : 0} %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {
                width: (AppConstant.WIDTH - 48) / 2,
                marginRight: 16,
                marginBottom: 0,
              },
            ]}>
            <Text style={[styles.worksheetLb]}>{getLabel('visit')}</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={KpiValue ? KpiValue.vieng_tham : 0}
                radius={16}
                borderWidth={5}
                color={colors.primary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}
              />
              <Text style={[styles.worksheetDt, {color: colors.primary}]}>
                {KpiValue ? `${KpiValue.vieng_tham}` : 0} %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 48) / 2, marginBottom: 0},
            ]}>
            <Text style={[styles.worksheetLb]}>{getLabel('newCustomer')}</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={KpiValue ? KpiValue.kh_moi : 0}
                radius={16}
                borderWidth={5}
                color={colors.secondary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}
              />
              <Text style={[styles.worksheetDt, {color: colors.secondary}]}>
                {KpiValue ? `${KpiValue.kh_moi}` : 0} %
              </Text>
            </View>
          </View>
        </View>
      </Block>
    );
  }, [KpiValue]);

  const openToDeeplink = () => {
    const link = `mbwess://sign_in/${userNameStore?.toLocaleLowerCase()}/${passwordStore}/${organiztion?.company_name?.toLocaleLowerCase()}`;
    Linking.canOpenURL(link)
      .then(supported => {
        if (supported) {
          Linking.openURL(link);
        } else {
          return openAppStore();
        }
      })
      .catch(() => openAppStore());
  };

  const openAppStore = () => {
    let link = '';
    if (Platform.OS === 'ios') {
      link = 'itms-apps://apps.apple.com/id/app/MBW ESS/id6473134079?l=id';
    } else {
      link = 'https://play.google.com/store/apps/details?id=mbw.next.ess';
    }
    Linking.canOpenURL(link)
      .then(supported => {
        supported && Linking.openURL(link);
      })
      .catch(err => console.log('err', err));
  };

  const getProfile = async () => {
    const response: any = await AppService.getUserProfile();
    if (Object.keys(response?.result).length > 0) {
      dispatch(appActions.setUserProfile(response.result));
    } else {
      dispatch(appActions.setUserProfile({}));
    }
  };

  const getCurrentShit = async () => {
    const response: any = await AppService.getCurrentShit();
    if (Object.keys(response?.result).length > 0) {
      setCurrentShit(response.result);
    }
  };

  const getReportKPI = async () => {
    const response: any = await ReportService.getKpi();
    if (Object.keys(response?.result).length > 0) {
      setKpiValue(response.result);
    }
  };

  const getReportSales = async () => {
    const response: any = await ReportService.getReportSales();
    if (Object.keys(response?.result).length > 0) {
      const data: IReportSales = response.result;
      setSaleValue(data);
    }
  };

  const getReportRevenue = async () => {
    const response: any = await ReportService.getReportRevenue();
    if (Object.keys(response?.result).length > 0) {
      const data: IReportRevenue = response.result;
      setRevenueValue(data);
    }
  };

  const getReportVisit = async () => {
    const response: any = await ReportService.getReportVisit();
    if (Object.keys(response?.result).length > 0) {
      setVisitValue(response.result);
    }
  };

  const getCustomer = async (params?: IListVisitParams) => {
    await getCustomerVisit(params).then((res: any) => {
      if (Object.keys(res.result).length > 0) {
        const data: VisitListItemType[] = res?.result.data;
        // const newData = data.filter(item => item.customer_location_primary);
        dispatch(customerActions.setCustomerVisit(data));
      }
    });
  };

  const handleRegainLocation = useCallback(async () => {
    CommonUtils.getCurrentLocation(
      locations => {
        location.current = locations;
        dispatch(appActions.onSetCurrentLocation(locations));
        mapboxCameraRef.current?.flyTo(
          [locations.coords.longitude, locations.coords.latitude],
          1000,
        );
      },
      err => backgroundErrorListener(err.code),
    );
  }, []);

  const getLocation = () => {
    Geolocation.requestAuthorization(() =>
      CommonUtils.getCurrentLocation(
        locations => {
          location.current = locations;
          dispatch(appActions.onSetCurrentLocation(locations));
          mapboxCameraRef.current?.flyTo(
            [locations.coords.longitude, locations.coords.latitude],
            1000,
          );
        },
        // err => backgroundErrorListener(err.code),
      ),
    );
  };
  const getNotification = async () => {
    const response: any = await AppService.getNotification();
    if (response?.message === 'Thành công') {
      setNotifications(response.result.data.slice(0, 3));
    }
  };

  useDeepCompareEffect(() => {
    if (isFocus) {
      dispatch(appActions.setProcessingStatus(false));
      //delete search visit value in ListVisit.tsx
      onResetSearchValueOfVisit();
      //get Data
      getLocation();
      getSystemConfig();
      getProfile();
      getCurrentShit();
      getReportKPI();
      getReportSales();
      getReportRevenue();
      getReportVisit();
      getNotification();
    }
  }, []);

  useDeepCompareEffect(() => {
    getWidget();
    getCustomer();
  }, []);

  const getSystemConfig = () => {
    dispatch(appActions.onGetSystemConfig());
  };

  const onSyncStatusChanged = React.useCallback(
    (syncStatus: number) => {
      switch (syncStatus) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE: {
          // Đang kiểm tra bản cập nhật...
          break;
        }
        case codePush.SyncStatus.DOWNLOADING_PACKAGE: {
          //Đang tải xuống bản cập nhật...
          break;
        }
        case codePush.SyncStatus.INSTALLING_UPDATE: {
          //Đang cài đặt bản cập nhật...
          break;
        }
        case codePush.SyncStatus.UPDATE_INSTALLED: {
          setShowModalHotUpdate(false);
          codePush.notifyAppReady();
          //'Hoàn tất cập nhật. Xin vui lòng đợi trong giây lát!'
          break;
        }
        case codePush.SyncStatus.UNKNOWN_ERROR: {
          //Cập nhật thất bại!
          setShowModalHotUpdate(false);

          // setTimeout(() => {
          //   codePush.restartApp();
          // }, 800);
          break;
        }
        case codePush.SyncStatus.UP_TO_DATE: {
          codePush.notifyAppReady();
          break;
        }
        default: {
          break;
        }
      }
    },
    [syncWithCodePush],
  );

  const onDownloadProgress = (downloadProgress: DownloadProgress): void => {
    setUpdatePercentage(
      Number(
        (
          (downloadProgress.receivedBytes * 100) /
          downloadProgress.totalBytes
        ).toFixed(2),
      ),
    );
  };

  useEffect(() => {
    startCompare(() => {
      codePush.checkForUpdate().then(update => {
        if (update) {
          setShowModalHotUpdate(true);
        }
      });
    });
    // Kiểm tra xem có phiên bản mới không
  }, []);

  const handleUpdateApp = () => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
      },
      onSyncStatusChanged,
      onDownloadProgress,
    );
  };

  const getItemCount = (data: any): number => 10;
  const cellRender: React.ComponentType<
    CellRendererProps<React.JSX.Element | null>
  > = React.useCallback(({item}) => item, []);

  const getItem = (data: any, index: number) => {
    switch (index) {
      case 0: {
        return (
          <Block block>
            <Pressable
              style={[styles.shadow, styles.header]}
              onPress={() => navigation.navigate(ScreenConstant.PROFILE)}>
              <View style={{flexDirection: 'row'}}>
                {Object.keys(userProfile).length > 0 && userProfile?.image ? (
                  <AppAvatar url={userProfile.image} size={48} />
                ) : (
                  <AppAvatar name={userProfile.employee_name ?? ''} size={48} />
                )}
                <View style={[styles.containerIfU]}>
                  <Text style={[styles.userName]}>{getLabel('welcome')},</Text>
                  <Text style={[styles.userName]}>
                    {Object.keys(userProfile) &&
                    Object.keys(userProfile!)?.length > 0
                      ? userProfile?.employee_name
                      : '---'}
                  </Text>
                </View>
              </View>
              <View>
                <IconButton
                  icon="bell-outline"
                  iconColor={colors.text_primary}
                  size={20}
                  mode="contained"
                  containerColor={colors.border}
                  onPress={() => {
                    bottomSheetNotification.current &&
                      bottomSheetNotification.current.snapToIndex(0);
                    // dispatch(AppActions.setShowModal(!showModal));
                  }}
                />
              </View>
            </Pressable>
          </Block>
        );
      }
      case 1: {
        return (
          <TimeKeep
            onPressDeepLink={openToDeeplink}
            currentShit={currentShit}
          />
        );
      }
      case 2: {
        return renderUiWidget();
      }
      case 3: {
        return renderUiStatistical();
      }
      case 4: {
        return (
          <Block marginTop={16} marginBottom={16}>
            <Block style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>{getLabel('sales')}</Text>
            </Block>
            <Block style={{marginHorizontal: 16}}>
              <BarChartStatistical
                color={colors.action}
                isSales
                data={salesValue}
              />
            </Block>
          </Block>
        );
      }
      case 5: {
        return (
          <Block marginTop={16} marginBottom={16}>
            <Block style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>{getLabel('revenue')}</Text>
            </Block>
            <Block style={{marginHorizontal: 16}}>
              <BarChartStatistical
                isSales={false}
                color={colors.main}
                data={revenueValue}
              />
            </Block>
          </Block>
        );
      }
      case 6: {
        return <CircleChartView visitValue={visitValue} />;
      }
      case 7: {
        return (
          <MapView
            mapboxCameraRef={mapboxCameraRef}
            handleRegainPosition={handleRegainLocation}
            location={location}
            listCustomerVisit={listCustomerVisit}
          />
        );
      }
      case 8: {
        return (
          <Block marginTop={16} marginBottom={16}>
            <Block style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>
                {getLabel('internalNotifi')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ScreenConstant.NOTIFYCATION)
                }>
                <Text style={[styles.tilteSection, {color: colors.action}]}>
                  {getLabel('all')}
                </Text>
              </TouchableOpacity>
            </Block>
            <Block style={styles.containerNtf}>
              {notifications?.map((item, i) => (
                <Block key={i}>
                  <ItemNotification
                    isSend={true}
                    title={item.notice_title}
                    time={item.from_date}
                    description={item.description}
                    avatar={item.user_image}
                  />
                </Block>
              ))}
            </Block>
          </Block>
        );
      }
      case 9: {
        return (
          <NotificationScreen
            bottomSheetRef={bottomSheetNotification}
            snapPointsCustom={snapPoint}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <Block
      style={{
        flex: 1,
        backgroundColor: colors.bg_neutral,
      }}
      // edges={['top']}
    >
      {isPending ? (
        <Block block justifyContent="center" alignItems="center">
          {' '}
          <ActivityIndicator size="large" color={colors.primary} />{' '}
        </Block>
      ) : (
        <React.Fragment>
          <VirtualizedList
            data={[]}
            renderItem={() => null}
            getItemCount={getItemCount}
            stickyHeaderIndices={[0]}
            bounces={true}
            decelerationRate={'fast'}
            keyExtractor={(item, index) => index.toString()}
            getItem={getItem}
            contentContainerStyle={styles.root}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="never"
            // stickyHeaderHiddenOnScroll={true}
            stickyHeaderIndices={[0]}
            CellRendererComponent={cellRender}
          />
          <ModalUpdate
            show={showModalHotUpdate}
            progress={updatePercent}
            onPress={() => {
              startCompare(() => {
                handleUpdateApp();
                handleUpdateApp();
              });
            }}
          />
          <ModalErrorLocation
            show={enabled}
            text={error}
            onPress={() => setEnabled(false)}
          />
        </React.Fragment>
      )}
    </Block>
  );
};

export default React.memo(HomeScreen, isEqual);
