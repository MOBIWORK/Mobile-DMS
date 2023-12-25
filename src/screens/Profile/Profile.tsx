import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useCallback} from 'react';
import {MainLayout} from '../../layouts';
import {
  AppAvatar,
  AppHeader,
  AppSwitch,
  AppText,
  SvgIcon,
} from '../../components/common';
import {AppTheme, useTheme} from '../../layouts/theme';
import {useDispatch, useSelector} from 'react-redux';
import {AppActions, AppSelector} from '../../redux-store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import ContentList from './components/ContentList';
import {ContentProfile} from './ultil/config';
type Props = {};

const Profile = (props: Props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const appTheme = useSelector(AppSelector.getTheme);
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();

  const onSwitch = useCallback(() => {
    // 'worklet';
    if (theme.dark) {
      dispatch(AppActions.setAppTheme('default'));
    } else {
      dispatch(AppActions.setAppTheme('dark'));
    }
  }, [appTheme]);

  return (
    <MainLayout style={styles.root}>
      <AppHeader
        label=""
        backButtonIcon={
          <SvgIcon
            source="arrowLeft"
            size={24}
            onPress={() => navigation.goBack()}
          />
        }
      />
      {/* <AppSwitch onSwitch={onSwitch} /> */}
      <View style={styles.containView}>
        <AppAvatar
          size={48}
          name="Văn Hiếu"
          url="https://picture.vn/wp-content/uploads/2015/12/da-lat.png"
        />
        <View style={styles.containLabel}>
          <AppText fontSize={16} fontWeight="500">
            Thân Văn Hiếu
          </AppText>
          <View style={styles.containSecondView}>
            <SvgIcon source="AccountIcon" size={16} />
            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
              {' '}
              Nhân viên lập trình |
            </AppText>
            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
              {' '}
              NV-199{' '}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.containContentView}>
        <ContentList data={ContentProfile} />
      </View>
    </MainLayout>
  );
};

export default Profile;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      // paddingTop:0,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    containView: {
      marginTop: 12,
      // backgroundColor: theme.colors.bg_default,
      flexDirection: 'row',
      // justifyContent: 'center',
      paddingVertical: 10,
    } as ViewStyle,
    containLabel: {
      paddingLeft: 8,
      // backgroundColor:'red',
      justifyContent: 'center',
    } as ViewStyle,
    containSecondView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containContentView: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      marginTop: 16,
      // padding:8
    } as ViewStyle,
  });
