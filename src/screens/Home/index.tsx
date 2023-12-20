import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TextStyle } from 'react-native';
import { AppAvatar, AppContainer, AppIcons, AppText } from '../../components/common';
import { IconButton } from 'react-native-paper';
import { ImageAssets } from '../../assets';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AppConstant, ScreenConstant } from '../../const';
import ItemWidget from '../../components/Widget/ItemWidget';
import ProgressCircle from 'react-native-progress-circle';
import BarChartStatistical from './BarChart';
import ItemNotification from '../../components/Notification/ItemNotification';
import { MainLayout } from '../../layouts';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme, useTheme } from '../../layouts/theme';
import { useMMKVString } from 'react-native-mmkv';
import { DataConstant } from '../../const';
import { IWidget } from '../../models/types';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation';
import NotificationScreen from './Notification';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';


const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = rootStyles(useTheme());
  const bottomSheetNotification = useRef<BottomSheet>(null);
  const snapPoint = useMemo(() => ['100%'],[])
  const navigation = useNavigation<NavigationProp>();
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

  const [widgets ,setWidgets] = useMMKVString(AppConstant.Widget);
  
  const getWidget = ()=>{
    if(!widgets){
      const arrWg = DataConstant.DataWidget.slice(0, 8);
      setWidgets(JSON.stringify(arrWg))
    }
  }
  getWidget();

  const renderUiWidget = () => {
    return (
      <View>
        <View
          style={styles.widgetView}>
          <Text style={[styles.tilteSection]}>
            Tiện ích
          </Text>
          <TouchableOpacity onPress={()=> navigation.navigate(ScreenConstant.WIDGET_FVR_SCREEN)}>
            <Text style={[styles.tilteSection, { color: colors.action }]}>
              Tuỳ chỉnh
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={[
              styles.shadow,
              {
                backgroundColor: colors.bg_default,
                borderRadius: 16,
              },
            ]}>
            <View
              style={{
                marginLeft: -16,
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingTop: 8,
              }}>
              
              {widgets && JSON.parse(widgets).map((item: IWidget,i:any)=>(
                <View key={i}
                  style={{
                    marginBottom: 16,
                    marginLeft: 16,
                    width: (AppConstant.WIDTH - 80) / 4,
                  }}>
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
      </View>
    );
  };

  const renderUiStatistical = () => {
    return (
      <View>
        <View style={[styles.flexSpace]}>
          <Text style={[styles.tilteSection]}>Thống kê</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

          <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3, }]}>
            <Text style={[styles.worksheetLb]} >
              Doanh thu
            </Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.action}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt,{ color: colors.action}]}>
                15 %
              </Text>
            </View>
          </View>

          <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3, marginHorizontal: 15 }]}>
            <Text style={[styles.worksheetLb]} >
              Doanh số
            </Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.success}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt,{ color: colors.success}]}>
                15 %
              </Text>
            </View>
          </View>

          <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 64) / 3 }]}>
            <Text style={[styles.worksheetLb]} >
              Đơn hàng
            </Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={65}
                radius={16}
                borderWidth={5}
                color={colors.info}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt,{ color: colors.info}]}>
                65 %
              </Text>
            </View>
          </View>

          <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 48) / 2, marginRight: 16 ,marginBottom :0 }]}>
            <Text style={[styles.worksheetLb]} >
              Viếng thăm
            </Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.primary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt,{ color: colors.primary}]}>
                15 %
              </Text>
            </View>
          </View>

          <View style={[styles.itemWorkSheet, { width: (AppConstant.WIDTH - 48) / 2 ,marginBottom :0}]}>
            <Text style={[styles.worksheetLb]} >
              Khách hàng mới
            </Text>
            <View style={[styles.worksheetBar]}>
              <ProgressCircle
                percent={18}
                radius={16}
                borderWidth={5}
                color={colors.secondary}
                shadowColor={colors.bg_disable}
                bgColor={colors.bg_default}></ProgressCircle>
              <Text style={[styles.worksheetDt,{ color: colors.secondary}]}>
                15 %
              </Text>
            </View>
          </View>

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1}} edges={['top']}>
      <View
        style={[
          styles.shadow,
          styles.header
        ]}>
        <View style={{ flexDirection: 'row' }}>
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
            onPress={() => bottomSheetNotification.current && bottomSheetNotification.current.snapToIndex(0)}
          />
        </View>
      </View>
      <AppContainer>
        <View style={styles.mainLayout}>

          <View
            style={[
              styles.shadow,
              styles.containerTimekeep
            ]}>
            <View>
              <Text style={[styles.userName]}>Chấm công vào</Text>
              <View style={[styles.flex, { marginTop: 8, }]}>
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
              <Text style={[styles.tilteSection]}>
                Doanh số
              </Text>
            </View>
            <View>
              <BarChartStatistical color={colors.action} />
            </View>
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>
                Doanh thu
              </Text>
            </View>
            <View>
              <BarChartStatistical color={colors.main} />
            </View>
          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>
                Viếng thăm
              </Text>
            </View>
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
                  <Text style={[styles.textProcessDesc]}>{' '}{`(Đạt 6 %)`}{' '}</Text>
                </View>
              </ProgressCircle>
              <Text style={[styles.checkinDesc]}>
                Số lượt viếng thăm khách hàng/tháng
              </Text>
            </View>
          </View>

          <View>

            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>
                Bản đồ viếng thăm
              </Text>
            </View>

            <View
              style={{
                marginBottom: 8,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                backgroundColor: colors.bg_default,
                borderRadius: 16,
                minHeight: 360,
              }}>
              <Text>Map</Text>
            </View>

          </View>

          <View>
            <View style={[styles.flexSpace]}>
              <Text style={[styles.tilteSection]}>
                Thông báo nội bộ
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate(ScreenConstant.NOTIFYCATION)}>
                <Text style={[styles.tilteSection, { color: colors.action }]}>
                  Tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.containerNtf}>
              {notifiCations?.map((item, i) => (
                <View key={i}>
                  <ItemNotification
                    isSend={true}
                    title={item.name}
                    time={item.time}
                    description={item.description}
                    avatar={
                      'https://picture.vn/wp-content/uploads/2015/12/da-lat.png'
                    }
                  />
                </View>
              ))}
            </View>
          </View>

        </View>
      </AppContainer>
      <NotificationScreen bottomSheetRef={bottomSheetNotification} snapPointsCustom={snapPoint}/>
    </SafeAreaView>
  );
};

export default HomeScreen;

const rootStyles = (theme: AppTheme) => StyleSheet.create({
  mainLayout :{
    backgroundColor: theme.colors.bg_neutral,
    flex: 1,
    rowGap: 20,
    paddingHorizontal :16
  } as ViewStyle,
  flexSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  } as ViewStyle,
  flex: {
    flexDirection: 'row',
    alignItems: "center"
  } as ViewStyle,
  tilteSection: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: theme.colors.text_disable,
    marginBottom: 8
  } as TextStyle,
  shadow: {
    shadowColor: '#919EAB',

    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  } as ViewStyle,
  widgetView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  header: {
    backgroundColor: theme.colors.bg_default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg_disable,
    overflow: 'hidden'
    // marginBottom:10
    // overflow:'hidden'
  } as ViewStyle,
  containerIfU: {
    marginTop: -3,
    marginLeft: 8
  } as ViewStyle,
  userName: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    color: theme.colors.text_primary
  } as TextStyle,
  containerTimekeep: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.bg_default,
    marginTop: 20
  } as ViewStyle,
  containerCheckin: {
    marginBottom: 8,
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.bg_default
  } as ViewStyle,
  checkinDesc: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    marginTop: 12,
    color: theme.colors.text_secondary
  } as TextStyle,
  btnTimekeep: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  } as ViewStyle,
  iconBtnTk: {
    width: 32,
    height: 32,
    tintColor: theme.colors.bg_default,
  },
  containerNtf: {
    marginBottom: 8,
    paddingVertical: 16,
    backgroundColor: theme.colors.bg_default,
    borderRadius: 16,
    minHeight: 360,
  } as ViewStyle,
  textProcess: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: theme.colors.text_primary,
  } as TextStyle,
  textProcessDesc: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: '400',
    color: theme.colors.main,
  } as TextStyle,
  itemWorkSheet: {
    backgroundColor: theme.colors.bg_default,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  } as ViewStyle,
  worksheetLb: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: theme.colors.text_primary,
  } as TextStyle,
  worksheetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  } as ViewStyle,
  worksheetDt: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '500',
    marginLeft: 8,
  } as TextStyle,
});
