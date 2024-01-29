import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, Home, Visits, WidgetScreen} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
  MockLocationDetectorError,
} from 'react-native-turbo-mock-location-detector';

export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.WIDGET_SCREEN]: undefined;
};

const Tab = createBottomTabNavigator();

const MainTab = () => {
  useEffect(() => {
    isMockingLocation()
      .then(({isLocationMocked}) => {
        console.log('isLocationMocked', isLocationMocked);
        // isLocationMocked: boolean
        // boolean result for Android and iOS >= 15.0
      })
      .catch((error: MockLocationDetectorError) => {
        // error.message - descriptive message
        switch (error.code) {
          case MockLocationDetectorErrorCode.GPSNotEnabled: {
            // user disabled GPS
            console.log('user disabled GPS');
            return;
          }
          case MockLocationDetectorErrorCode.NoLocationPermissionEnabled: {
            // user has no permission to access location
            console.log('user has no permission to access location');
            return;
          }
          case MockLocationDetectorErrorCode.CantDetermine: {
            // always for iOS < 15.0
            // for android and iOS if couldn't fetch GPS position
            console.log("for android and iOS if couldn't fetch GPS position");
          }
        }
      });
  }, []);

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
