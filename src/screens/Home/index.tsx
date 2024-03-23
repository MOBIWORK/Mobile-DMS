import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import codePush, {DownloadProgress} from 'react-native-code-push';
import {IconButton} from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import {ImageAssets} from '../../assets';
import {AppConstant, ScreenConstant} from '../../const';
import ItemNotification from '../../components/Notification/ItemNotification';
import BarChartStatistical from './BarChart';
import {
  AppAvatar,
  AppContainer,
  AppIcons,
  Block,
} from '../../components/common';

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
import ItemLoading from './components/ItemLoading';
import CardLoading from './components/CardLoading';
import ItemNotiLoading from './components/ItemNotiLoading';
import UpdateScreen from '../UpdateScreen/UpdateScreen';

import {dispatch, getState} from '../../utils/redux';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {useSelector} from '../../config/function';
import ModalUpdate from './components/ModalUpdate';
import {AppService, ReportService} from '../../services';
import {useTranslation} from 'react-i18next';
import {LocationProps} from '../Visit/VisitList/VisitItem';
import MarkerItem from '../../components/common/MarkerItem';
import {NavigationProp} from '../../navigation/screen-type';
import ModalErrorLocation from './components/ModalErrorLocation';
import {getCustomerVisit, IListVisitParams} from '../../services/appService';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {CommonUtils} from '../../utils';

const HomeScreen = () => {
  const {colors} = useTheme();
  const styles = rootStyles(useTheme());
  const bottomSheetNotification = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ['100%'], []);
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const isFocus = useIsFocused();

  const location = useRef<GeolocationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = React.useState(false);
  // const showModal = useSelector(state => state.app.showModal);
  const userProfile: IUser = useSelector(state => state.app.userProfile);
  const listCustomerVisit: VisitListItemType[] = useSelector(
    state => state.customer.listCustomerVisit,
  );

  const [updateMessage, setUpdateMessage] = React.useState('');
  const [updateStatus, setUpdateStatus] = React.useState(-1);
  const [updatePercent, setUpdatePercentage] = React.useState<number>(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalHotUpdate, setShowModalHotUpdate] = useState(false);
  const [error, setError] = useState(
    'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
  );
  const [screen, setScreen] = useState(false);

  const syncWithCodePush = (status: number) => {
    console.log('Codepush sync status', status);
  };

  const [currentShit, setCurrentShit] = useState<any>(null);

  const [notifiCations, setNotifications] = useState([
    {
      id: 1,
      name: 'Thông báo nghỉ lễ Quốc Khánh 02/09',
      description: 'Quyết định có hiệu lực kể từ ngày ký',
      time: '17:00 - 20/09/2023',
    },
    {
      id: 1,
      name: 'Khen thưởng nhân viên xuất sắc tháng',
      description:
        'Căn cứ vào chức năng, quyền hạn của Chủ tịch HĐQT Công ty được quy định tại Điều lệ Công ty Cổ phần Công nghệ MobiWork Việt Nam được thông qua bởi các thành viên sáng lập;',
      time: '17:00 - 20/09/2023',
    },
    {
      id: 1,
      name: 'Khen thưởng KD xuất sắc',
      description:
        'Phòng KT-TC, phòng HCNS và nhân viên/trưởng nhóm có tên trong danh sách có trách nhiệm thi hành theo quyết định này.',
      time: '17:00 - 20/09/2023',
    },
  ]);

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
      <View>
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
            {loading ? (
              <ItemLoading loading={loading} />
            ) : (
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
            )}
          </View>
        </View>
      </View>
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
      <View>
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
      </View>
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

  useEffect(() => {
    mapboxCameraRef.current?.fitBounds


    const getLocation = () => {
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
      );
    };
    if (isFocus) {
      getLocation();
      getProfile();
      getCurrentShit();
      getReportKPI();
      getReportSales();
      getReportRevenue();
      getReportVisit();
    }
  }, [isFocus]);

  useEffect(() => {
    getSystemConfig();
    getWidget();
    getCustomer();
  }, []);

  const getSystemConfig = () => {
    const {systemConfig} = getState('app');
    if (Object.keys(systemConfig).length > 0) {
      return;
    } else {
      dispatch(appActions.onGetSystemConfig());
    }
  };

  const onSyncStatusChanged = React.useCallback((syncStatus: number) => {
    console.log(
      'syncStatus',
      syncStatus,
      codePush.SyncStatus.CHECKING_FOR_UPDATE,
    );
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE: {
        setUpdateMessage('Đang kiểm tra bản cập nhật...');

        break;
      }
      case codePush.SyncStatus.DOWNLOADING_PACKAGE: {
        setShowModalHotUpdate(true);

        setUpdateMessage('Đang tải xuống bản cập nhật...');
        break;
      }
      case codePush.SyncStatus.INSTALLING_UPDATE: {
        setUpdateMessage('Đang cài đặt bản cập nhật...');
        // setShowModalHotUpdate(false);
        break;
      }
      case codePush.SyncStatus.UPDATE_INSTALLED: {
        codePush.notifyAppReady();
        setUpdateMessage('Hoàn tất cập nhật. Xin vui lòng đợi trong giây lát!');
        setShowModalUpdate(false);
        break;
      }
      case codePush.SyncStatus.UNKNOWN_ERROR: {
        setUpdateMessage('Cập nhật thất bại!');

        // setTimeout(() => {
        //   codePush.restartApp();
        // }, 800);
        break;
      }
      case codePush.SyncStatus.UP_TO_DATE: {
        codePush.notifyAppReady();
        // setTimeout(() => {
        VersionCheck.needUpdate({}).then(res => {
          if (res.isNeeded != undefined) {
            setShowModalUpdate(res.isNeeded);
          } else {
            return;
          }
        });

        // codePush.restartApp();
        // }, 800);
        break;
      }
      default: {
        break;
      }
    }
    setUpdateStatus(syncStatus);
  }, []);

  const onDownloadProgress = useCallback(
    (downloadProgress: DownloadProgress): void => {
      setUpdatePercentage(
        Math.floor(
          (downloadProgress.receivedBytes * 100) / downloadProgress.totalBytes,
        ),
      );
      setShowModalHotUpdate(false);
    },
    [],
  );
  useEffect(() => {
    // codePush.sync(
    //   {
    //     updateDialog: {
    //       appendReleaseDescription: true,
    //       descriptionPrefix: 'Release',
    //       title: 'Update Available',
    //       optionalUpdateMessage: updateMessage,
    //     },
    //     installMode: codePush.InstallMode.ON_NEXT_RESTART,
    //     mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
    //   },
    //   onSyncStatusChanged,
    //   onDownloadProgress,
    // );
    // syncWithCodePush;
  }, [onDownloadProgress, onSyncStatusChanged]);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <Block block>
        {!screen ? (
          <>
            <View style={[styles.shadow, styles.header]}>
              <View style={{flexDirection: 'row'}}>
                {Object.keys(userProfile).length > 0 && userProfile?.image ? (
                  <AppAvatar url={userProfile.image} size={48} />
                ) : (
                  <AppAvatar name={userProfile.employee_name ?? ''} size={48} />
                )}
                <View style={[styles.containerIfU]}>
                  <Text style={[styles.userName]}> Xin chào ,</Text>
                  <Text style={[styles.userName]}>
                    {Object.keys(userProfile) &&
                    Object.keys(userProfile!)?.length > 0
                      ? userProfile?.employee_name
                      : ''}
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
            </View>
            <AppContainer style={{marginBottom: 100}}>
              <View style={styles.mainLayout}>
                <View style={[styles.shadow, styles.containerTimekeep]}>
                  <View>
                    <Text style={[styles.userName]}>
                      {currentShit?.shift_status ||
                      currentShit?.shift_status === 'Vào'
                        ? getLabel('timeKeepOut')
                        : getLabel('timeKeepIn')}
                    </Text>
                    <View style={[styles.flex, {marginTop: 8}]}>
                      <AppIcons
                        iconType={
                          currentShit?.shift_type_now
                            ? AppConstant.ICON_TYPE.AntIcon
                            : AppConstant.ICON_TYPE.MateriallIcon
                        }
                        name={
                          currentShit?.shift_type_now
                            ? 'clockcircleo'
                            : 'report-problem'
                        }
                        size={16}
                        color={
                          currentShit?.shift_type_now
                            ? colors.text_secondary
                            : colors.error
                        }
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          color: currentShit?.shift_type_now
                            ? colors.text_secondary
                            : colors.error,
                        }}>
                        {currentShit?.shift_type_now
                          ? `${currentShit.shift_type_now.start_time} - ${currentShit.shift_type_now.end_time}`
                          : getLabel('noShirtNow')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.btnTimekeep,
                      {
                        backgroundColor: !currentShit?.shift_type_now
                          ? colors.bg_disable
                          : currentShit?.shift_status ||
                            currentShit?.shift_status === 'Vào'
                          ? colors.error
                          : colors.success,
                      },
                    ]}
                    onPress={openToDeeplink}
                    disabled={currentShit?.shift_type_now === false}>
                    <Image
                      source={ImageAssets.Usercheckin}
                      resizeMode={'cover'}
                      style={styles.iconBtnTk}
                    />
                  </TouchableOpacity>
                </View>

                <View>{renderUiWidget()}</View>

                <View>{renderUiStatistical()}</View>

                <View>
                  <View style={[styles.flexSpace]}>
                    <Text style={[styles.tilteSection]}>
                      {getLabel('sales')}
                    </Text>
                  </View>
                  <View>
                    {loading ? (
                      <CardLoading />
                    ) : (
                      <BarChartStatistical
                        color={colors.action}
                        isSales
                        data={salesValue}
                      />
                    )}
                  </View>
                </View>

                <View>
                  <View style={[styles.flexSpace]}>
                    <Text style={[styles.tilteSection]}>
                      {getLabel('revenue')}
                    </Text>
                  </View>
                  <View>
                    {loading ? (
                      <CardLoading />
                    ) : (
                      <BarChartStatistical
                        isSales={false}
                        color={colors.main}
                        data={revenueValue}
                      />
                    )}
                  </View>
                </View>

                <View>
                  <View style={[styles.flexSpace]}>
                    <Text style={[styles.tilteSection]}>
                      {getLabel('visit')}
                    </Text>
                  </View>
                  {loading ? (
                    <CardLoading />
                  ) : (
                    <View style={[styles.containerCheckin]}>
                      <ProgressCircle
                        percent={
                          visitValue ? visitValue.phan_tram_thuc_hien : 0
                        }
                        radius={80}
                        borderWidth={30}
                        color={colors.action}
                        shadowColor={colors.bg_disable}
                        bgColor={colors.bg_default}>
                        <View>
                          <Text style={[styles.textProcess]}>
                            {visitValue?.dat_duoc}/{visitValue?.chi_tieu}
                          </Text>
                          <Text style={[styles.textProcessDesc]}>
                            {' '}
                            (Đạt {visitValue?.phan_tram_thuc_hien}
                            %)
                          </Text>
                        </View>
                      </ProgressCircle>
                      <Text style={[styles.checkinDesc]}>
                        {getLabel('visitPerMonth')}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[styles.flexSpace]}>
                  <Text style={[styles.tilteSection]}>
                    {getLabel('visitMap')}
                  </Text>
                </View>

                <View style={styles.map}>
                  <Mapbox.MapView
                    pitchEnabled={false}
                    attributionEnabled={false}
                    scaleBarEnabled={false}
                    zoomEnabled
                    scrollEnabled
                    logoEnabled={false}
                    styleURL={Mapbox.StyleURL.Street}
                    style={{
                      width: '100%',
                      height: '100%',
                      zIndex: 10,
                      position: 'absolute',
                    }}>
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
                      ref={mapboxCameraRef}
                      centerCoordinate={[
                        location.current !== null
                          ? location.current.coords.longitude
                          : 0,
                        location.current !== null
                          ? location.current.coords.latitude
                          : 0,
                      ]}
                      animationMode={'flyTo'}
                      animationDuration={500}
                      zoomLevel={11}
                    />
                    {listCustomerVisit.length > 0 &&
                      listCustomerVisit.map((item, index) => {
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
                              <MarkerItem item={item} index={index} />
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
                </View>
                <View>
                  <View style={[styles.flexSpace]}>
                    <Text style={[styles.tilteSection]}>Thông báo nội bộ</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(ScreenConstant.NOTIFYCATION)
                      }>
                      <Text
                        style={[styles.tilteSection, {color: colors.action}]}>
                        {getLabel('all')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.containerNtf}>
                    {notifiCations?.map((item, i) => (
                      <View key={i}>
                        {loading ? (
                          <ItemNotiLoading />
                        ) : (
                          <ItemNotification
                            isSend={true}
                            title={item.name}
                            time={item.time}
                            description={item.description}
                            avatar={
                              'https://picture.vn/wp-content/uploads/2015/12/da-lat.png'
                            }
                          />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </AppContainer>
            <NotificationScreen
              bottomSheetRef={bottomSheetNotification}
              snapPointsCustom={snapPoint}
            />
          </>
        ) : (
          <UpdateScreen progress={updatePercent} setScreen={setScreen} />
        )}
      </Block>

      <ModalUpdate
        show={showModalHotUpdate}
        onPress={() => {
          setScreen(true);
          setShowModalHotUpdate(false);
          // dispatch(AppActions.setShowModal(true));
        }}
      />
      <ModalErrorLocation
        show={enabled}
        text={error}
        onPress={() => console.log('fuck')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
