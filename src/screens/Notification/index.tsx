import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { MainLayout } from '../../layouts';
import { Text, TouchableOpacity } from 'react-native';

import AppContainer from '../../components/AppContainer';
import { AppHeader, Block } from '../../components/common';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '../../navigation/screen-type';
import ItemNotification from '../../components/Notification/ItemNotification';
import { AppTheme, useTheme } from '../../layouts/theme';
import { useDeepCompareEffect } from '../../config/function';
import { AppService } from '../../services';
import { AppConstant, ScreenConstant } from '../../const';
import { useMMKVString } from 'react-native-mmkv';

const InternalNotificationScreen = () => {
  const { colors } = useTheme();
  const theme = useTheme()
  const styles = createSheetStyle(theme);
  const navigate = useNavigation<NavigationProp>();
  const [isRead, setRead] = useState<boolean>(false);
  const { t: getLabel } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [notificationData, setNotificationData] = useMMKVString(AppConstant.NotificationData);

  useDeepCompareEffect(() => {
    getNotification();
  }, []);
  const getNotification = async () => {
    const response: any = await AppService.getNotification();
    if (response?.message === 'Thành công') {
      setNotificationData(JSON.stringify(response.result.data))
    }
  }
  const renderUiNoti = useCallback(() => {
    if (!notificationData) return;
    const filterData = JSON.parse(notificationData).filter((notification: any) => {
      if (isRead) {
        return !notification.is_watched;
      } else {
        return notification;
      }
    })
    return (
      <AppContainer>
        <View style={styles.containerItem}>
          {filterData.map((item: any, i: any) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate(ScreenConstant.NOTIFY_DETAIL, item.name)}>
              <ItemNotification
                title={item.notice_title}
                description={item.description}
                time={item.from_date}
                avatar={item.user_image}
                isSend={item.is_watched}
              />
            </TouchableOpacity>
          ))}
        </View>
      </AppContainer>
    );
  }, [notificationData, isRead]);

  return (
    <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
      <AppHeader
        label={getLabel('Thông báo nội nộ')}
        onBack={() => navigate.goBack()}
        labelStyle={styles.headeLb}
      />
      <View style={styles.rowBtt}>
        <View
          style={{
            backgroundColor: isRead ? colors.bg_neutral : colors.bg_default,
            borderRadius: 20,
          }}>
          <Text
            onPress={() => setRead(false)}
            style={[
              styles.action,
              { color: isRead ? colors.text_primary : colors.action },
            ]}>
            {getLabel('Tất cả')}
          </Text>
        </View>
        <Block
          marginLeft={8}
          colorTheme={!isRead ? 'bg_neutral' : 'bg_default'}
          borderRadius={20}>
          <Text
            onPress={() => setRead(true)}
            style={[
              styles.action,
              { color: !isRead ? colors.text_primary : colors.action },
            ]}>
            {getLabel('Chưa đọc')}
          </Text>
        </Block>
      </View>
      {renderUiNoti()}
    </MainLayout>
  );
};

export default InternalNotificationScreen;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    headeLb: {
      textAlign: 'left',
      marginLeft: 5,
    } as TextStyle,
    rowBtt: {
      flexDirection: 'row',
      marginTop: 22,
      marginBottom: 8,
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
    } as TextStyle,
    containerItem: {
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
  });
