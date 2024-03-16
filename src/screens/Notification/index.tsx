import React, {useEffect, useState} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {MainLayout} from '../../layouts';
import {Text} from 'react-native';
import AppContainer from '../../components/AppContainer';
import {AppHeader} from '../../components/common';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '../../navigation/screen-type';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ItemNotification from '../../components/Notification/ItemNotification';
import {AppTheme, useTheme} from '../../layouts/theme';

const InternalNotificationScreen = () => {
  const {colors} = useTheme();
  const styles = createSheetStyle(useTheme());
  const navigate = useNavigation<NavigationProp>();
  const [isRead, setRead] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<any[]>([
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

  const {t: getLabel} = useTranslation();

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
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
              {color: isRead ? colors.text_primary : colors.action},
            ]}>
            {getLabel('Tất cả')}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 8,
            backgroundColor: !isRead ? colors.bg_neutral : colors.bg_default,
            borderRadius: 20,
          }}>
          <Text
            onPress={() => setRead(true)}
            style={[
              styles.action,
              {color: !isRead ? colors.text_primary : colors.action},
            ]}>
            {getLabel('Chưa đọc')}
          </Text>
        </View>
      </View>
      <AppContainer>
        <View style={styles.containerItem}>
          {notifications &&
            notifications.map((item, i) => (
              <TouchableOpacity key={i}>
                <ItemNotification
                  title={item.name}
                  description={item.description}
                  time={item.time}
                  avatar={
                    'https://www.elleman.vn/app/uploads/2019/05/20/4-buc-anh-dep-hinh-gau-truc.jpg'
                  }
                  isSend={true}
                />
              </TouchableOpacity>
            ))}
        </View>
      </AppContainer>
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
