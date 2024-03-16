import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UnAuthorizeParamList} from './screen-type';
import {AppConstant, ScreenConstant} from '../const';
import {
  ForgotPassword,
  SelectOrganization,
  SignIn,
  SuccessChanged,
} from '../screens';
import {useMMKVBoolean} from 'react-native-mmkv';

const UnAuthorNavigation = () => {
  const UnAuthStack = createNativeStackNavigator<UnAuthorizeParamList>();
  const [loginFirst] = useMMKVBoolean(AppConstant.FirstLogin);

  return (
    <UnAuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_left',
      }}
      initialRouteName={loginFirst ? 'SIGN_IN' : 'SELECT_ORGANIZATION'}>
      <UnAuthStack.Screen
        name={ScreenConstant.SELECT_ORGANIZATION}
        component={SelectOrganization}
      />
      <UnAuthStack.Screen name={ScreenConstant.SIGN_IN} component={SignIn} />
      <UnAuthStack.Screen
        name={ScreenConstant.FORGOT_PASSWORD}
        component={ForgotPassword}
      />
      <UnAuthStack.Screen
        name={ScreenConstant.SUCCESS_CHANGE}
        component={SuccessChanged}
      />
    </UnAuthStack.Navigator>
  );
};

export default UnAuthorNavigation;
