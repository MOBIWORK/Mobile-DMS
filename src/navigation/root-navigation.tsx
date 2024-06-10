import {AppState, AppStateStatus} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './screen-type';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppConstant, ScreenConstant} from '../const';
import {CommonUtils} from '../utils';
import AuthNavigation from './AuthNavigation';
import UnAuthorNavigation from './UnAuthorNavigation';
import {navigate} from './navigation-service';
import {useSelector} from '../config/function';
import {CheckinData} from '../services/appService';
import {useDispatch} from 'react-redux';
import {appActions} from '../redux-store/app-reducer/reducer';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const validate = CommonUtils.storage.getString(AppConstant.Api_key);
  const isLogout = CommonUtils.storage.getBoolean(AppConstant.isLogOut);
  const dataCheckIn: CheckinData = useSelector(state => state.app.dataCheckIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.setProcessingStatus(false));
    if (
      dataCheckIn &&
      Object.keys(dataCheckIn)?.length > 0 
      // dataCheckIn.isDetail === false || dataCheckIn.isDetail === true
    ) {
      navigate(ScreenConstant.CHECKIN, {item: dataCheckIn});
    } else {
      return;
    }
  }, []);

  return (
    <SafeAreaProvider>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}
        initialRouteName={
          !validate || isLogout ? 'UNAUTHORIZED' : 'AUTHORIZED'
        }>
        <Stack.Screen
          name={ScreenConstant.UNAUTHORIZED}
          component={UnAuthorNavigation}
        />
        <Stack.Screen
          name={ScreenConstant.AUTHORIZED}
          component={AuthNavigation}
        />
      </RootStack.Navigator>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
