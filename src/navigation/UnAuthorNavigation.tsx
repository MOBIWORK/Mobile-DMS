import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UnAuthorizeParamList} from './screen-type';
import {ScreenConstant} from '../const';
import {
  ForgotPassword,
  SelectOrganization,
  SignIn,
  SuccessChanged,
} from '../screens';

const UnAuthorNavigation = () => {
  const UnAuthStack = createNativeStackNavigator<UnAuthorizeParamList>();

  return (
    <UnAuthStack.Navigator>
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

const styles = StyleSheet.create({});
