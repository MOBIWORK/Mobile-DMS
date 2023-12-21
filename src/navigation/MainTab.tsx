import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, ForgotPassword, HomeScreen, Index, ListVisit} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';


export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]:undefined,
  [ScreenConstant.VISIT]:undefined;
  [ScreenConstant.CUSTOMER]:undefined;
  [ScreenConstant.LOOKING_MORE]:undefined
}


const Tab = createBottomTabNavigator();

const MainTab = () => {
  const {t: getLabel} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTabDisplay {...props} />}>
      <Tab.Screen name={ScreenConstant.HOME_SCREEN} component={HomeScreen} />
      <Tab.Screen name={ScreenConstant.LIST_VISIT} component={ListVisit} />
      <Tab.Screen name={ScreenConstant.CUSTOMER} component={Customer} />
      <Tab.Screen
        name={ScreenConstant.HOME_SCREEN}
        component={HomeScreen}
      />
       <Tab.Screen
        name={ScreenConstant.VISIT}
        component={Index}
      />
       <Tab.Screen
        name={ScreenConstant.CUSTOMER}
        component={Customer}
      />
       <Tab.Screen
        name={ScreenConstant.LOOKING_MORE}
        component={ForgotPassword}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
