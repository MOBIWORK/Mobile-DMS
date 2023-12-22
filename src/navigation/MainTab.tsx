import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, ForgotPassword, HomeScreen,  ListVisit} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import Home from '../screens/Home';


export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]:undefined,
  [ScreenConstant.VISIT]:undefined;
  [ScreenConstant.CUSTOMER]:undefined;
  [ScreenConstant.LOOKING_MORE]:undefined
}


const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false,}}
      // sceneContainerStyle={{backgroundColor:'red'}}
      tabBar={props => <BottomTabDisplay {...props} />}>
      <Tab.Screen name={ScreenConstant.HOME_SCREEN} component={HomeScreen} />
       <Tab.Screen
        name={ScreenConstant.VISIT}
        component={ListVisit}
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
