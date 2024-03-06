import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ScreenConstant} from '../const';
import {Customer, Home, Visits, WidgetScreen} from '../screens';
import BottomTabDisplay from './BottomTabDisplay';
import {AppState, AppStateStatus} from 'react-native';
import {navigate} from './index';
import {CheckinData} from '../services/appService';
import {useSelector} from '../config/function';
import {shallowEqual} from 'react-redux';

export type TabParamList = {
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.WIDGET_SCREEN]: undefined;
};

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log(nextAppState, 'app state');
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    console.log('dataCheckIn', dataCheckIn);
    const appState = AppState.addEventListener('change', handleAppStateChange);
    if (dataCheckIn && Object.keys(dataCheckIn)?.length > 0) {
      navigate(ScreenConstant.CHECKIN, {item: dataCheckIn});
    } else {
      return;
    }
    return () => {
      appState.remove();
    };
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
