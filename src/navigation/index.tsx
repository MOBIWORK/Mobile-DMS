import React, {FC} from 'react';
import type {RouteProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {useMMKVBoolean, useMMKVObject} from 'react-native-mmkv';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import {AppConstant, ScreenConstant} from '../const';
import {IResOrganization} from '../models/types';
import {
  AddingNewCustomer,
  ForgotPassword,
  ImageView,
  ListProduct,
  ProductDetail,
  SearchProduct,
  SelectOrganization,
  SignIn,
  SuccessChanged,
  
} from '../screens';
// import { MAIN_TAB } from '../const/screen.const';
import MainTab from './MainTab';
import { MyAppTheme } from '../layouts/theme';

import {  IAppReduxState } from '../redux-store';
// import PushNotification from 'react-native-push-notification';

const AppNavigationContainer: FC<AppNavigationContainerProps> = ({
  children,
}) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {theme} = useSelector((state:IAppReduxState) => state.appRedux)
  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );
  // const [theme, setTheme] = useMMKVString(AppConstant.Theme);
  const [loginFirst] = useMMKVBoolean(AppConstant.FirstLogin);

 

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
      theme={MyAppTheme[theme]}>
      <Stack.Navigator
        initialRouteName={
          loginFirst && organiztion?.company_name
            ? ScreenConstant.SIGN_IN
            : ScreenConstant.CUSTOMER
        }
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
        <Stack.Screen name={ScreenConstant.ADDING_NEW_CUSTOMER}  component={AddingNewCustomer} />
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
  [ScreenConstant.SUCCESS_CHANGE]: undefined;
  [ScreenConstant.LIST_PRODUCT]: undefined;
  [ScreenConstant.SEARCH_PRODUCT]: undefined;
  [ScreenConstant.PRODUCT_DETAIL]: undefined;
  [ScreenConstant.IMAGE_VIEW]: {data: any};
  [ScreenConstant.CUSTOMER]:undefined;
  [ScreenConstant.MAIN_TAB]:undefined
  [ScreenConstant.ADDING_NEW_CUSTOMER]:undefined
};

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
