import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {ForgotPassword} from '../screens';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const {t: getLable} = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={ScreenConstant.FORGOT_PASSWORD}
        component={ForgotPassword}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
