import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useCallback} from 'react';
import {MainLayout} from '../../layouts';
import {
  AppAvatar,
  AppButton,
  AppHeader,
  AppText,
  SvgIcon,
} from '../../components/common';
import {AppTheme, useTheme} from '../../layouts/theme';
import {dispatch} from '../../utils/redux';

import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/screen-type';
import ContentList from './components/ContentList';
import {ContentProfile, ProfileContent} from './ultil/config';
import {useSelector} from '../../config/function';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {IUser} from '../../models/types';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {noteActions} from '../../redux-store/note-reducer/reducer';
import {customerActions} from '../../redux-store/customer-reducer/reducer';
import {orderAction} from '../../redux-store/order-reducer/reducer';

const Profile = () => {
  const theme = useTheme();
  const appTheme = useSelector(state => state.app.theme);
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const userInfo: IUser = useSelector(state => state.app.userProfile);

  const onSwitch = useCallback(() => {
    // 'worklet';
    if (theme.dark) {
      dispatch(appActions.onSetAppTheme('default'));
    } else {
      dispatch(appActions.onSetAppTheme('dark'));
    }
  }, [appTheme]);
  const onLogout = useCallback(() => {
    dispatch(appActions.resetDataApp());
    dispatch(checkinActions.resetDataState());
    dispatch(noteActions.setLogoutNote());
    dispatch(customerActions.resetDataCustomer());
    dispatch(orderAction.setLogoutData());
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'UNAUTHORIZED',
          state: {
            routes: [{name: 'SIGN_IN'}],
          },
        },
      ],
    });
  }, [dispatch]);

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
      <AppButton
        style={{marginTop: 32, backgroundColor: theme.colors.bg_default}}
        onPress={onLogout}
        label={'Đăng xuất'}
        styleLabel={{color: theme.colors.error}}
      />
    </MainLayout>
  );
};

export default Profile;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    containView: {
      marginTop: 12,
      flexDirection: 'row',
      paddingVertical: 10,
    } as ViewStyle,
    containLabel: {
      paddingLeft: 8,
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
    } as ViewStyle,
  });
