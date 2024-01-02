import React, {FC, useEffect} from 'react';
import type {RouteProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigatorScreenParams} from '@react-navigation/native';
import {AppConstant, ScreenConstant} from '../const';

import {useMMKVBoolean, useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {
  IDataCustomer,
  IResOrganization,
  ItemNoteVisitDetail,
  ReportOrderItemType,
  VisitListItemType,
} from '../models/types';
import {
  ForgotPassword,
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
  WidgetFavouriteScreen,
  NotificationScreen,
  CheckinOrder,
  CheckinOrderCreated,
  Index,
  AddingNewCustomer,
  DetailCustomer,
  ReportOrderDetail,
  Home,
  DropDrag,
  Profile,
  TakePicture,
  CheckinNote,
  NoteDetail,
  AddNote,
  CheckInLocation,
  CheckIn,
  SearchCustomer
} from '../screens';
// import { MAIN_TAB } from '../const/screen.const';
import {MyAppTheme} from '../layouts/theme';

// import { MAIN_TAB } from '../const/screen.const';

import {IAppReduxState} from '../redux-store';

// import PushNotification from 'react-native-push-notification';
import {useSelector} from 'react-redux';
import MainTab, {TabParamList} from './MainTab';


const AppNavigationContainer: FC<AppNavigationContainerProps> = ({
  children,
}) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {theme} = useSelector((state: IAppReduxState) => state.appRedux);
  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );

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

  return (
    <NavigationContainer
      theme={MyAppTheme[theme]}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}>
          {/* <Stack.Screen name={ScreenConstant.DROP_DRAG} component={DropDrag}  /> */}
        <Stack.Screen name={ScreenConstant.MAIN_TAB} component={MainTab} />
        <Stack.Screen name={ScreenConstant.SELECT_ORGANIZATION} component={SelectOrganization}/>
        <Stack.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
        <Stack.Screen name={ScreenConstant.WIDGET_FVR_SCREEN} component={WidgetFavouriteScreen} />
        <Stack.Screen name={ScreenConstant.NOTIFYCATION} component={NotificationScreen} />
        <Stack.Screen name={ScreenConstant.SIGN_IN} component={SignIn} />
        <Stack.Screen name={ScreenConstant.FORGOT_PASSWORD} component={ForgotPassword}/>
        <Stack.Screen name={ScreenConstant.SUCCESS_CHANGE} component={SuccessChanged}/>
        <Stack.Screen name={ScreenConstant.IMAGE_VIEW} component={ImageView} />
        <Stack.Screen name={ScreenConstant.SEARCH_VISIT} component={SearchVisit}/>
        <Stack.Screen name={ScreenConstant.LIST_PRODUCT} component={ListProduct}/>
        <Stack.Screen name={ScreenConstant.SEARCH_PRODUCT} component={SearchProduct}/>
        <Stack.Screen name={ScreenConstant.PRODUCT_DETAIL} component={ProductDetail}/>
        <Stack.Screen name={ScreenConstant.LIST_VISIT} component={ListVisit} />
        <Stack.Screen name={ScreenConstant.ORDER_SCREEN} component={OrderList} />
        <Stack.Screen name={ScreenConstant.ORDER_DETAIL_SCREEN} component={OrderDetail} />
        <Stack.Screen name={ScreenConstant.CHECKIN_INVENTORY} component={Inventory}/>
        <Stack.Screen name={ScreenConstant.INVENTORY_ADD_PRODUCT} component={InventoryAddProduct}/>
        <Stack.Screen name={ScreenConstant.ADDING_NEW_CUSTOMER}  component={AddingNewCustomer} />
        <Stack.Screen name={ScreenConstant.CKECKIN_ORDER}  component={CheckinOrder} />
        <Stack.Screen name={ScreenConstant.CKECKIN_ORDER_CREATE}  component={CheckinOrderCreated} />
        <Stack.Screen name={ScreenConstant.VISIT} component={Index} />
        <Stack.Screen   name={ScreenConstant.VISIT_DETAIL}   component={Index}   />
        <Stack.Screen name={ScreenConstant.DETAIL_CUSTOMER} component={DetailCustomer}/>
        <Stack.Screen name={ScreenConstant.REPORT_ORDER_DETAIL} component={ReportOrderDetail}/>
        <Stack.Screen   name={ScreenConstant.CHECKIN} component={CheckIn} />
        <Stack.Screen
          name={ScreenConstant.TAKE_PICTURE_VISIT}
          component={TakePicture}
        />
        <Stack.Screen
          name={ScreenConstant.CHECKIN_NOTE_VISIT}
          component={CheckinNote}
        />
        <Stack.Screen
          name={ScreenConstant.NOTE_DETAIL}
          component={NoteDetail}
        />
        <Stack.Screen name={ScreenConstant.ADD_NOTE} component={AddNote} />
        <Stack.Screen
          name={ScreenConstant.CHECKIN_LOCATION}
          component={CheckInLocation}
        />
        <Stack.Screen  name={ScreenConstant.PROFILE} component={Profile}  />
        <Stack.Screen  name={ScreenConstant.SEARCH_CUSTOMER} component={SearchCustomer}  />
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
  [ScreenConstant.NOTIFYCATION]: undefined;
  [ScreenConstant.WIDGET_FVR_SCREEN]: undefined;
  [ScreenConstant.SUCCESS_CHANGE]: undefined;
  [ScreenConstant.LIST_PRODUCT]: undefined;
  [ScreenConstant.SEARCH_PRODUCT]: undefined;
  [ScreenConstant.PRODUCT_DETAIL]: undefined;
  [ScreenConstant.IMAGE_VIEW]: {data: any};
  [ScreenConstant.ORDER_SCREEN]: undefined;
  [ScreenConstant.ORDER_DETAIL_SCREEN]: undefined;
  [ScreenConstant.LIST_VISIT]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.SEARCH_VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.ADDING_NEW_CUSTOMER]: undefined;
  [ScreenConstant.CHECKIN_INVENTORY]: undefined;
  [ScreenConstant.INVENTORY_ADD_PRODUCT]: undefined;
  [ScreenConstant.CKECKIN_ORDER]: undefined;
  [ScreenConstant.CKECKIN_ORDER_CREATE]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.ADDING_NEW_CUSTOMER]: undefined;
  [ScreenConstant.DETAIL_CUSTOMER]: {data: IDataCustomer};
  [ScreenConstant.VISIT_DETAIL]: {data: VisitListItemType};
  [ScreenConstant.REPORT_ORDER_DETAIL]: {item: ReportOrderItemType};
  [ScreenConstant.MAIN_TAB]: NavigatorScreenParams<TabParamList>;
  [ScreenConstant.DROP_DRAG]: undefined;
  [ScreenConstant.PROFILE]: undefined;
  [ScreenConstant.CHECKIN]:{
    item:any
  }
  [ScreenConstant.TAKE_PICTURE_VISIT]: undefined;
  [ScreenConstant.CHECKIN_NOTE_VISIT]: undefined;
  [ScreenConstant.NOTE_DETAIL]: {data: ItemNoteVisitDetail};
  [ScreenConstant.ADD_NOTE]: undefined;
  [ScreenConstant.CHECKIN_LOCATION]: undefined;
  [ScreenConstant.SEARCH_CUSTOMER]:undefined;
  [ScreenConstant.CHECKIN_ORDER]:undefined
};

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
