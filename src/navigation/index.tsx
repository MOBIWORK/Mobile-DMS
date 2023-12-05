import React, {FC, useEffect} from 'react';
import type {RouteProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useColorScheme} from 'react-native';

import {AppConstant, ScreenConstant} from '../const';

import {AppDarkTheme, AppLightTheme} from '../layouts';
// import MainTab from "./MainTab";
import {useMMKVBoolean, useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {IResOrganization} from '../models/types';
// import PushNotification from 'react-native-push-notification';

const AppNavigationContainer: FC<AppNavigationContainerProps> = ({
  children,
}) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const colorScheme = useColorScheme();
  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );
  const [theme, setTheme] = useMMKVString(AppConstant.Theme);
  const [loginFirst] = useMMKVBoolean(AppConstant.FirstLogin);

  useEffect(() => {
    // @ts-ignore
    setTheme(colorScheme);
  }, [colorScheme]);

  // useEffect(() => {
  //   PushNotification.configure({
  //     onNotification: notification => {
  //       if (notification.userInteraction) {
  //         console.log('312');
  //       }
  //     },
  //   });
  // }, []);

  return (
    <NavigationContainer
      // @ts-ignore
      theme={theme === 'light' ? AppLightTheme : AppDarkTheme}>
      <Stack.Navigator
        // @ts-ignore
        initialRouteName={
          loginFirst && organiztion?.company_name
            ? ScreenConstant.SIGN_IN
            : ScreenConstant.SELECT_ORGANIZATION
        }
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}
      />
      {children}
    </NavigationContainer>
  );
};

interface AppNavigationContainerProps {
  children?: any;
}

export default AppNavigationContainer;

export type RootStackParamList = {};

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
