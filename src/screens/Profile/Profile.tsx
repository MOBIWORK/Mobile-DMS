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
import {dispatch} from '../../utils/redux';

import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import ContentList from './components/ContentList';
import {ContentProfile, ProfileContent} from './ultil/config';
import {useSelector} from '../../config/function';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {IUser} from '../../models/types';

const Profile = () => {
  const theme = useTheme();
  const appTheme = useSelector(state => state.app.theme);
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();

  const userInfo: IUser = useSelector(state => state.app.userProfile);

  const onSwitch = useCallback(() => {
    // 'worklet';
    if (theme.dark) {
      dispatch(appActions.onSetAppTheme('default'));
    } else {
      dispatch(appActions.onSetAppTheme('dark'));
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
      <View style={styles.containView}>
        <AppAvatar
          size={48}
          name={userInfo?.employee_name}
          url={userInfo?.image}
        />
        <View style={styles.containLabel}>
          <AppText fontSize={16} fontWeight="500" colorTheme="text_primary">
            {userInfo?.employee_name}
          </AppText>
          <View style={styles.containSecondView}>
            <SvgIcon source="AccountIcon" size={16} />
            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
              {' '}
              {userInfo?.designation} |
            </AppText>
            <AppText fontSize={14} colorTheme="text_secondary" fontWeight="400">
              {' '}
              {userInfo?.employee}{' '}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.containContentView}>
        <ContentList
          data={ContentProfile(navigation) as ProfileContent[]}
          onSwitch={onSwitch}
        />
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
