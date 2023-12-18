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
import {
  AddingNewCustomer,
  ForgotPassword,
  Home,
  ImageView,
  ListProduct,
  OrderDetail,
  OrderList,
  ListVisit,
  ProductDetail,
  SearchProduct,
  SearchVisit,
  SelectOrganization,
  SignIn,
  SuccessChanged,
  Inventory,
  InventoryAddProduct,
  
} from '../screens';
import { MAIN_TAB } from '../const/screen.const';
import MainTab from './MainTab';
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
    if (colorScheme) {
      setTheme(colorScheme);
    }
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
        // initialRouteName={
        //   loginFirst && organiztion?.company_name
        //     ? ScreenConstant.SIGN_IN
        //     : ScreenConstant.LIST_VISIT
        // }
        initialRouteName={ScreenConstant.CHECKIN_INVENTORY}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}>
          <Stack.Screen
          name={ScreenConstant.MAIN_TAB}
          component={MainTab}
          
          />
        <Stack.Screen
          name={ScreenConstant.SELECT_ORGANIZATION}
          component={SelectOrganization}
        />
        <Stack.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
        <Stack.Screen name={ScreenConstant.SIGN_IN} component={SignIn} />
        <Stack.Screen
          name={ScreenConstant.FORGOT_PASSWORD}
          component={ForgotPassword}
        />
        <Stack.Screen
          name={ScreenConstant.SUCCESS_CHANGE}
          component={SuccessChanged}
        />
        <Stack.Screen
          name={ScreenConstant.LIST_PRODUCT}
          component={ListProduct}
        />
        <Stack.Screen
          name={ScreenConstant.SEARCH_PRODUCT}
          component={SearchProduct}
        />
        <Stack.Screen
          name={ScreenConstant.PRODUCT_DETAIL}
          component={ProductDetail}
        />
        <Stack.Screen name={ScreenConstant.IMAGE_VIEW} component={ImageView} />
        <Stack.Screen
          name={ScreenConstant.ORDER_SCREEN}
          component={OrderList}
        />
        <Stack.Screen
          name={ScreenConstant.ORDER_DETAIL_SCREEN}
          component={OrderDetail}
        />
        <Stack.Screen name={ScreenConstant.LIST_VISIT} component={ListVisit} />

        <Stack.Screen name={ScreenConstant.SEARCH_VISIT} component={SearchVisit}/>

        <Stack.Screen name={ScreenConstant.CHECKIN_INVENTORY} component={Inventory}/>
        <Stack.Screen name={ScreenConstant.INVENTORY_ADD_PRODUCT} component={InventoryAddProduct}/>

      </Stack.Navigator>
      {children}
    </NavigationContainer>
  );
};

interface AppNavigationContainerProps {
  children?: any;
}

export default AppNavigationContainer;

export type RootStackParamList = {
  [ScreenConstant.SIGN_IN]: {organizationName?: string};
  [ScreenConstant.SELECT_ORGANIZATION]: {data?: string};
  [ScreenConstant.SCANNER]: undefined;
  [ScreenConstant.FORGOT_PASSWORD]: undefined;
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.SUCCESS_CHANGE]: undefined;
  [ScreenConstant.LIST_PRODUCT]: undefined;
  [ScreenConstant.SEARCH_PRODUCT]: undefined;
  [ScreenConstant.PRODUCT_DETAIL]: undefined;
  [ScreenConstant.IMAGE_VIEW]: {data: any};
  [ScreenConstant.ORDER_SCREEN]: undefined;
  [ScreenConstant.ORDER_DETAIL_SCREEN]: undefined;
  [ScreenConstant.LIST_VISIT]: undefined;
  [ScreenConstant.SEARCH_VISIT]: undefined;
  [ScreenConstant.CUSTOMER]:undefined;
  [ScreenConstant.MAIN_TAB]:undefined
  [ScreenConstant.ADDING_NEW_CUSTOMER]:undefined
  [ScreenConstant.CHECKIN_INVENTORY]:undefined
  [ScreenConstant.INVENTORY_ADD_PRODUCT]:undefined
};

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
