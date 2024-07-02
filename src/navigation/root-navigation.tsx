import React, {useEffect} from 'react';
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
import {shallowEqual, useDispatch} from 'react-redux';
import {appActions} from '../redux-store/app-reducer/reducer';
import {CheckIn} from '../screens';
import ErrorFallBack from '../layouts/ErrorFallBack';
import Error from '../layouts/Error';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const validate = CommonUtils.storage.getString(AppConstant.Api_key);
  const isLogout = CommonUtils.storage.getBoolean(AppConstant.isLogOut);


  // useEffect(() => {
  //   dispatch(appActions.setProcessingStatus(false));
  //   if (dataCheckIn && Object.keys(dataCheckIn)?.length > 0) {
  //     navigate(ScreenConstant.CHECKIN, {item: dataCheckIn});
  //     console.log('categoriesCheckin', categoriesCheckin);
  //   } else {
  //     return;
  //   }
  // }, []);

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
     <Stack.Screen
          name={ScreenConstant.ERROR}
          component={Error}
        />
      </RootStack.Navigator>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
