import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './screen-type';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppConstant, ScreenConstant} from '../const';
import {CommonUtils} from '../utils';
import AuthNavigation from './AuthNavigation';
import UnAuthorNavigation from './UnAuthorNavigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const validate = CommonUtils.storage.getString(AppConstant.Api_key);
  const isLogout = CommonUtils.storage.getBoolean(AppConstant.isLogOut);

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
