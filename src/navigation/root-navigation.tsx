import {AppState, AppStateStatus, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './screen-type';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppConstant, ScreenConstant} from '../const';
import {CommonUtils} from '../utils';
import AuthNavigation from './AuthNavigation';
import UnAuthorNavigation from './UnAuthorNavigation';
import {navigate} from './navigation-service';
import {useSelector} from '../config/function';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const theme = useSelector(state => state.app.theme);

  const validate = CommonUtils.storage.getString(AppConstant.Api_key);
  const [appState, setAppState] = useState<any>(AppState.currentState);
  const dataCheckIn = useSelector(state => state.app.dataCheckIn);
  // const [organiztion] = useMMKVObject<IResOrganization>(
  //   AppConstant.Organization,
  // );

  // const [loginFirst] = useMMKVBoolean(AppConstant.FirstLogin);

  // useEffect(() => {
  //   PushNotification.configure({
  //     onNotification: notification => {
  //       if (notification.userInteraction) {
  //         console.log('312');
  //       }
  //     },
  //   });
  // }, []);
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      setAppState(nextAppState);
    }
  };

  useEffect(() => {
    const appStateEvent = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    if (
      dataCheckIn &&
      Object.keys(dataCheckIn)?.length > 0 &&
      AppState.currentState === 'background'
    ) {
      navigate(ScreenConstant.CHECKIN, {item: dataCheckIn});
    } else {
      return;
    }
    return () => {
      appStateEvent.remove();
    };
  }, [dataCheckIn, appState]);

  return (
    <SafeAreaProvider>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}>
        {!validate ? (
          <Stack.Screen
            name={ScreenConstant.UNAUTHORIZED}
            component={UnAuthorNavigation}
          />
        ) : (
          <Stack.Screen
            name={ScreenConstant.AUTHORIZED}
            component={AuthNavigation}
          />
        )}
      </RootStack.Navigator>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
