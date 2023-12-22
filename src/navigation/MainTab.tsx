import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, Home, Visits, WidgetScreen, Index, ListVisit} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import BottomTabDisplay from './BottomTabDisplay';


export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]:undefined,
  [ScreenConstant.VISIT]:undefined;
  [ScreenConstant.CUSTOMER]:undefined;
  [ScreenConstant.LOOKING_MORE]:undefined
}


const Tab = createBottomTabNavigator();

const MainTab = () => {
  const {t: getLable} = useTranslation();

  return (
    <Tab.Navigator
    screenOptions={{headerShown:false}}
    tabBar={props => <BottomTabDisplay {...props}/>}
    >
      <Tab.Screen
        name={ScreenConstant.HOME_SCREEN}
        component={Home}
      />
      <Tab.Screen
        name={ScreenConstant.VISIT}
        component={Visits}
      />
      <Tab.Screen
        name={ScreenConstant.CUSTOMER}
        component={Customer}
      />
      <Tab.Screen
        name={ScreenConstant.WIDGET_SCREEN}
        component={WidgetScreen}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
