import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, ForgotPassword, Visits} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import HomeScreen from '../screens/Home';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  

  return (
    <Tab.Navigator
    screenOptions={{headerShown:false}}
    tabBar={props => <BottomTabDisplay {...props}/>}
    >
      <Tab.Screen
        name={ScreenConstant.HOME_SCREEN}
        component={HomeScreen}
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
        name={ScreenConstant.FORGOT_PASSWORD}
        component={ForgotPassword}
      />
    </Tab.Navigator>
  );
};
export default MainTab;
