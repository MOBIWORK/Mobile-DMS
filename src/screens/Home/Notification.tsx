import React, {FC, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Text} from 'react-native';
import AppContainer from '../../components/AppContainer';
import {AppAvatar, AppHeader, AppIcons, SvgIcon} from '../../components/common';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AppConstant} from '../../const';
import {AppBottomSheet} from '../../components/common';
import {NavigationProp} from '../../navigation';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppTheme, useTheme} from '../../layouts/theme';
import {useDispatch} from 'react-redux';
// import {AppActions, AppSelector} from '../../redux-store';
import { useSelector } from '../../config/function';
import { appActions } from '../../redux-store/app-reducer/reducer';

const arrNotification: any[] = [
  {
    id: 0,
    content: 'Bảng công của bạn dã được tạo!',
    user: '',
    isSend: true,
    time: '15 phút trước',
    type: 'work',
  },
  {
    id: 1,
    form: 'Chu Quỳnh Anh',
    content: 'đã gửi thông báo Nghỉ lễ 2/9 cho toàn thể CBNV công ty ',
    user: '',
    isSend: true,
    time: '20 phút trước',
    type: 'order',
  },
  {
    id: 2,
    form: 'Đỗ Anh Tùng',
    content: 'đã duyệt đơn xin nghỉ ngày 10/10/2023',
    user: '',
    isSend: true,
    time: '17:00 - 10/10/2023',
    type: 'order',
  },
  {
    id: 3,
    content:
      '[Nhắc việc]: Thời gian xử lý công việc đã qua 70%. Vui lòng thực hiện và báo cáo tiến độ công việc ',
    user: '',
    to: 'MBW_Frappe. [mobile] Thiết kế flow chấm công',
    isSend: true,
    time: '17:00 - 20/09/2023',
    type: 'work',
  },
];

const ItemNotificationCompo = (data: any) => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const styles = createSheetStyle(useTheme());

  const renderTypeNotification = (type: string) => {
    switch (type) {
      case 'work':
        return (
          <View style={styles.icon}>
            <SvgIcon source="iconContainer" size={16} />
          </View>
        );
      case 'order':
        return (
          <View style={styles.icon}>
            <SvgIcon source="iconCart" size={16} />
          </View>
        );
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.flex,
        {
          paddingVertical: 12,
          backgroundColor: data.isSend
            ? 'rgba(0, 184, 217, 0.08)'
            : colors.bg_default,
        },
      ]}>
      <View style={{marginRight: 16, paddingLeft: 16}}>
        <AppAvatar size={40} url="" name="T" />
      </View>
      <View style={{width: AppConstant.WIDTH - 120, overflow: 'hidden'}}>
        <Text style={[styles.description, {color: colors.text_primary}]}>
          {data.form && data.form !== '' ? (
            <Text style={{fontWeight: '500'}}>{data.form} </Text>
          ) : (
            ''
          )}
          {data.description}
          {data.to && data.to !== '' ? (
            <Text style={{fontWeight: '500'}}>{data.to} </Text>
          ) : (
            ''
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppIcons
              size={12}
              name="clockcircleo"
              iconType="AntIcon"
              color={colors.text_secondary}
            />
            <Text
              style={[
                styles.time,
                {marginLeft: 5, color: colors.text_secondary},
              ]}>
              {data.time}
            </Text>
          </View>
          {renderTypeNotification(data.type)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationScreen: FC<NotificationScreenProps> = ({
  bottomSheetRef,
  snapPointsCustom,
}) => {
  const {colors} = useTheme();
  const [isRead, setRead] = useState<boolean>(false);
  const [data, setData] = useState<any[]>(arrNotification);
  const {t: getLable} = useTranslation();
  const styles = createSheetStyle(useTheme());
  const dispatch = useDispatch();
  const showModal = useSelector(state => state.app.showModal);

  useEffect(() => {
    if (isRead) {
      const newArr = arrNotification.filter(item => item.isSend);
      setData(newArr);
    } else {
      setData(arrNotification);
    }
  }, [isRead]);
  return (
    <AppBottomSheet
      bottomSheetRef={bottomSheetRef}
      snapPointsCustom={snapPointsCustom}>
      <View style={styles.container}>
        <AppHeader
          label={getLable('Thông báo')}
          onBack={() => {
            bottomSheetRef.current && bottomSheetRef.current.close();
            dispatch(appActions.setShowModal(!showModal));
          }}
          backButtonIcon={
            <AppIcons
              size={24}
              iconType="AntIcon"
              name="close"
              color={colors.text_secondary}
            />
          }
        />
        <View style={styles.rowBtt}>
          <Pressable
            onPress={() => setRead(false)}
            style={{
              backgroundColor: isRead ? colors.bg_neutral : colors.bg_default,
              borderRadius: 20,
            }}>
            <Text
              style={[
                styles.action,
                {color: isRead ? colors.text_primary : colors.action},
              ]}>
              {getLable('Tất cả')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRead(true)}
            style={{
              marginLeft: 8,
              backgroundColor: !isRead ? colors.bg_neutral : colors.bg_default,
              borderRadius: 20,
            }}>
            <Text
              style={[
                styles.action,
                {color: !isRead ? colors.text_primary : colors.action},
              ]}>
              {getLable('Chưa đọc')}
            </Text>
          </Pressable>
        </View>
        <AppContainer>
          <View style={styles.containerNtf}>
            {data &&
              data.map((item, index) => (
                <ItemNotificationCompo
                  key={index + 'rc'}
                  title={item.title}
                  description={item.content}
                  time={item.time}
                  user={item.user}
                  form={item.form}
                  to={item.to}
                  isSend={false}
                  type={item.type}
                />
              ))}
          </View>
        </AppContainer>
      </View>
    </AppBottomSheet>
  );
};
interface NotificationScreenProps {
  bottomSheetRef: any;
  snapPointsCustom?: any;
}
export default NotificationScreen;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    rowBtt: {
      flexDirection: 'row',
      marginTop: 26,
      marginBottom: 8,
    } as ViewStyle,
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 16,
      marginTop: 16,
    } as ViewStyle,
    icon: {
      padding: 6,
      borderRadius: 11,
      backgroundColor: 'rgba(244, 246, 248, 1)',
    } as ViewStyle,
    containerNtf: {
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.colors.bg_default,
      height: '100%',
    } as ViewStyle,
    textHeader: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '500',
    } as TextStyle,
    action: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21,
      paddingHorizontal: 16,
      paddingVertical: 5,
      borderRadius: 20,
    } as TextStyle,
    flex: {
      flexDirection: 'row',
    } as ViewStyle,
    title: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    } as TextStyle,
    description: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } as TextStyle,
    time: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
  });
