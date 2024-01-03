import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {View, Text, Image} from 'react-native';
import {AppAvatar, AppContainer, AppIcons} from '../../components/common';
import {IconButton} from 'react-native-paper';
import {ImageAssets} from '../../assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppConstant, ScreenConstant} from '../../const';
import ProgressCircle from 'react-native-progress-circle';
import BarChartStatistical from './BarChart';
import ItemNotification from '../../components/Notification/ItemNotification';

import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../layouts/theme';
import {useMMKVString} from 'react-native-mmkv';
import {DataConstant} from '../../const';
import {IWidget, VisitListItemType} from '../../models/types';
import ItemWidget from '../../components/Widget/ItemWidget';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import NotificationScreen from './Notification';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import Mapbox from '@rnmapbox/maps';
import {VisitListData} from '../Visit/VisitList/ListVisit';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import MarkerItem from '../../components/common/MarkerItem';
import VisitItem from '../Visit/VisitList/VisitItem';
import {rootStyles} from './styles';
import ItemLoading from './components/ItemLoading';
import CardLoading from './components/CardLoading';
import ItemNotiLoading from './components/ItemNotiLoading';

const HomeScreen = () => {
  const {colors} = useTheme();
  const styles = rootStyles(useTheme());
  const bottomSheetNotification = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ['100%'], []);
  const navigation = useNavigation<NavigationProp>();
  const [visitItemSelected, setVisitItemSelected] =
    useState<VisitListItemType | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {bottom} = useSafeAreaInsets();

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

  const [widgets, setWidgets] = useMMKVString(AppConstant.Widget);
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);

  const getWidget = () => {
    if (!widgets) {
      const arrWg = DataConstant.DataWidget.slice(0, 8);
      setWidgets(JSON.stringify(arrWg));
    }
  };
  getWidget();

  const renderUiWidget = () => {
    return (
      <View>
        <View style={styles.widgetView}>
          <Text style={[styles.tilteSection]}>Tiện ích</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ScreenConstant.WIDGET_FVR_SCREEN)
            }>
            <Text style={[styles.tilteSection, {color: colors.action}]}>
              Tuỳ chỉnh
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
  };

  const renderUiStatistical = () => {
    return (
      <View>
        <View style={[styles.flexSpace]}>
          <Text style={[styles.tilteSection]}>Thống kê</Text>
        </View>
        <View style={styles.containProgressView}>
          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3},
            ]}>
            <Text style={[styles.worksheetLb]}>Doanh thu</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.action}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt, {color: colors.action}]}>
                15 %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3, marginHorizontal: 15},
            ]}>
            <Text style={[styles.worksheetLb]}>Doanh số</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.success}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt, {color: colors.success}]}>
                15 %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 64) / 3},
            ]}>
            <Text style={[styles.worksheetLb]}>Đơn hàng</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={65}
                radius={16}
                borderWidth={5}
                color={colors.info}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt, {color: colors.info}]}>
                65 %
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
            <Text style={[styles.worksheetLb]}>Viếng thăm</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.primary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt, {color: colors.primary}]}>
                15 %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.itemWorkSheet,
              {width: (AppConstant.WIDTH - 48) / 2, marginBottom: 0},
            ]}>
            <Text style={[styles.worksheetLb]}>Khách hàng mới</Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.secondary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt, {color: colors.secondary}]}>
                15 %
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useLayoutEffect(() => {
    setLoading(true);
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(location => {
        setLocation(location);
        mapboxCameraRef.current?.flyTo(
          [location.coords.longitude, location.coords.latitude],
          1000,
        );
      })
      .catch(e => console.log('err', e));
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <View style={[styles.shadow, styles.header]}>
        <View style={{flexDirection: 'row'}}>
          <AppAvatar name="Long" size={48} />
          <View style={[styles.containerIfU]}>
            <Text style={[styles.userName]}> Xin chào ,</Text>
            <Text style={[styles.userName]}>Khuất Thanh Long</Text>
          </View>
        </View>
        <View>
          <IconButton
            icon="bell-outline"
            iconColor={colors.text_primary}
            size={20}
            mode="contained"
            containerColor={colors.border}
            onPress={() =>
              bottomSheetNotification.current &&
              bottomSheetNotification.current.snapToIndex(0)
            }
          />
        </View>
      </View>
      <AppContainer>
        <View style={styles.mainLayout}>
          <View style={[styles.shadow, styles.containerTimekeep]}>
            <View>
              <Text style={[styles.userName]}>Chấm công vào</Text>
              <View style={[styles.flex, {marginTop: 8}]}>
                <AppIcons
                  iconType="AntIcon"
                  name="clockcircleo"
                  size={12}
                  color={colors.text_secondary}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    color: colors.text_secondary,
                  }}>
                  08:00 - 12:00
                </Text>
              </View>
            </View>
            <View style={styles.btnTimekeep}>
              <Image
                source={ImageAssets.Usercheckin}
                resizeMode={'cover'}
                style={styles.iconBtnTk}
              />
            </View>
          </View>

          <View>{renderUiWidget()}</View>

          <View>{renderUiStatistical()}</View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>Doanh số</Text>
            </View>
            <View>
              {loading ? (
                <CardLoading />
              ) : (
                <BarChartStatistical color={colors.action} />
              )}

              {/* <BarChartStatistical color={colors.action} /> */}
            </View>
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>Doanh thu</Text>
            </View>
            <View>
              {loading ? (
                <CardLoading />
              ) : (
                <BarChartStatistical color={colors.main} />
              )}
            </View>
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>Viếng thăm</Text>
            </View>
            {loading ? (
              <CardLoading />
            ) : (
              <View style={[styles.containerCheckin]}>
                <ProgressCircle
                  percent={18}
                  radius={80}
                  borderWidth={30}
                  color={colors.action}
                  shadowColor={colors.bg_disable}
                  bgColor={colors.bg_default}>
                  <View>
                    <Text style={[styles.textProcess]}>3/50</Text>
                    <Text style={[styles.textProcessDesc]}>
                      {' '}
                      {`(Đạt 6 %)`}{' '}
                    </Text>
                  </View>
                </ProgressCircle>
                <Text style={[styles.checkinDesc]}>
                  Số lượt viếng thăm khách hàng/tháng
                </Text>
              </View>
            )}
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>Bản đồ viếng thăm</Text>
            </View>

            <View style={styles.map}>
              <Mapbox.MapView
                pitchEnabled={false}
                attributionEnabled={false}
                scaleBarEnabled={false}
                styleURL={Mapbox.StyleURL.Street}
                logoEnabled={false}
                style={{width: '99%', height: 360}}>
                <Mapbox.Camera
                  ref={mapboxCameraRef}
                  centerCoordinate={[
                    location?.coords.longitude ?? 0,
                    location?.coords.latitude ?? 0,
                  ]}
                  animationMode={'flyTo'}
                  animationDuration={500}
                  zoomLevel={12}
                />
                {VisitListData.map((item, index) => {
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      coordinate={[Number(item.long), Number(item.lat)]}>
                      <MarkerItem
                        item={item}
                        index={index}
                        onPress={() => setVisitItemSelected(item)}
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
                {visitItemSelected && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: bottom + 16,
                      left: 24,
                      right: 24,
                    }}>
                    <VisitItem
                      item={visitItemSelected}
                      handleClose={() => setVisitItemSelected(null)}
                    />
                  </View>
                )}
              </Mapbox.MapView>
            </View>
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>Thông báo nội bộ</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ScreenConstant.NOTIFYCATION)
                }>
                <Text style={[styles.tilteSection, {color: colors.action}]}>
                  Tất cả
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
    </SafeAreaView>
  );
};

export default HomeScreen;
