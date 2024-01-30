import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, Home, Visits, WidgetScreen} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';

export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.WIDGET_SCREEN]: undefined;
};

const Tab = createBottomTabNavigator();

const MainTab = () => {
 

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <BottomTabDisplay {...props} />}>
      <Tab.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
      <Tab.Screen name={ScreenConstant.VISIT} component={Visits} />
      <Tab.Screen name={ScreenConstant.CUSTOMER} component={Customer} />
      <Tab.Screen
        name={ScreenConstant.WIDGET_SCREEN}
        component={WidgetScreen}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
