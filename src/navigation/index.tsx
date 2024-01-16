import React, {FC, createRef} from 'react';
import type {
  NavigationAction,
  NavigationContainerRef,
  RouteProp,
} from '@react-navigation/native';
import {
  CommonActions,
  NavigationContainer,
  StackActions,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppConstant, ScreenConstant} from '../const';

import {useMMKVObject} from 'react-native-mmkv';
import {
  IDataCustomer,
  IProduct,
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
  TakePicture,
  TravelDiary,
  WidgetFavouriteScreen,
  NotificationScreen,
  CheckinOrder,
  CheckinOrderCreated,
  Index,
  AddingNewCustomer,
  DetailCustomer,
  ReportOrderDetail,
  Home,
  Profile,
  CheckinNote,
  NoteDetail,
  AddNote,
  CheckInLocation,
  CheckIn,
  SearchCustomer,
  UpdateScreen,
  Report,
  NonOrderCustomer,
  Statistical,
  VisitResult,
  NewCustomer,
  ReportDebt,
  KPI,
  Inventory,
  InventoryAddProduct,
  RouteResult,
  SearchSreen,
} from '../screens';
import {MyAppTheme} from '../layouts/theme';
import {IAppReduxState} from '../redux-store';

// import PushNotification from 'react-native-push-notification';
import {useSelector} from 'react-redux';
import MainTab, {TabParamList} from './MainTab';
import linking from '../utils/linking.utils';

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
      theme={MyAppTheme[theme]}
      linking={linking}
      ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}
        initialRouteName={ScreenConstant.MAIN_TAB}>
        <Stack.Screen name={ScreenConstant.MAIN_TAB} component={MainTab} />
        <Stack.Screen
          name={ScreenConstant.SELECT_ORGANIZATION}
          component={SelectOrganization}
        />
        <Stack.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
        <Stack.Screen
          name={ScreenConstant.WIDGET_FVR_SCREEN}
          component={WidgetFavouriteScreen}
        />
        <Stack.Screen
          name={ScreenConstant.NOTIFYCATION}
          component={NotificationScreen}
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
        <Stack.Screen name={ScreenConstant.IMAGE_VIEW} component={ImageView} />
        <Stack.Screen
          name={ScreenConstant.SEARCH_VISIT}
          component={SearchVisit}
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
        <Stack.Screen name={ScreenConstant.LIST_VISIT} component={ListVisit} />
        <Stack.Screen
          name={ScreenConstant.ORDER_SCREEN}
          component={OrderList}
        />
        <Stack.Screen
          name={ScreenConstant.ORDER_DETAIL_SCREEN}
          component={OrderDetail}
        />
        <Stack.Screen
          name={ScreenConstant.CHECKIN_INVENTORY}
          component={Inventory}
        />
        <Stack.Screen
          name={ScreenConstant.INVENTORY_ADD_PRODUCT}
          component={InventoryAddProduct}
        />
        <Stack.Screen
          name={ScreenConstant.ADDING_NEW_CUSTOMER}
          component={AddingNewCustomer}
        />
        <Stack.Screen
          name={ScreenConstant.CKECKIN_ORDER}
          component={CheckinOrder}
        />
        <Stack.Screen
          name={ScreenConstant.CKECKIN_ORDER_CREATE}
          component={CheckinOrderCreated}
        />
        <Stack.Screen name={ScreenConstant.VISIT} component={Index} />
        <Stack.Screen name={ScreenConstant.VISIT_DETAIL} component={Index} />
        <Stack.Screen
          name={ScreenConstant.DETAIL_CUSTOMER}
          component={DetailCustomer}
        />
        <Stack.Screen
          name={ScreenConstant.REPORT_ORDER_DETAIL}
          component={ReportOrderDetail}
        />
        <Stack.Screen name={ScreenConstant.CHECKIN} component={CheckIn} />
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
        <Stack.Screen name={ScreenConstant.PROFILE} component={Profile} />
        <Stack.Screen
          name={ScreenConstant.SEARCH_CUSTOMER}
          component={SearchCustomer}
        />
        <Stack.Screen name={ScreenConstant.REPORT_SCREEN} component={Report} />
        <Stack.Screen
          name={ScreenConstant.STATISTICAL}
          component={Statistical}
        />
        <Stack.Screen
          name={ScreenConstant.NON_ORDER_CUSTOMER}
          component={NonOrderCustomer}
        />
        <Stack.Screen
          name={ScreenConstant.TRAVEL_DIARY}
          component={TravelDiary}
        />
        <Stack.Screen
          name={ScreenConstant.ROUTE_RESULT}
          component={RouteResult}
        />
        <Stack.Screen
          name={ScreenConstant.VISIT_RESULT}
          component={VisitResult}
        />
        <Stack.Screen
          name={ScreenConstant.NEW_CUSTOMER}
          component={NewCustomer}
        />
        <Stack.Screen
          name={ScreenConstant.REPORT_DEBT}
          component={ReportDebt}
        />
        <Stack.Screen name={ScreenConstant.REPORT_KPI} component={KPI} />
        <Stack.Screen name={ScreenConstant.SEARCH_COMMON_SCREEN} component={SearchSreen} />
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
  [ScreenConstant.PRODUCT_DETAIL]: {
    item: IProduct;
  };
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
  [ScreenConstant.CKECKIN_ORDER]: {type: string};
  [ScreenConstant.CKECKIN_ORDER_CREATE]: {type: string};
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.ADDING_NEW_CUSTOMER]: undefined;
  [ScreenConstant.DETAIL_CUSTOMER]: {data: IDataCustomer};
  [ScreenConstant.VISIT_DETAIL]: {data: VisitListItemType};
  [ScreenConstant.REPORT_ORDER_DETAIL]: {item: ReportOrderItemType};
  [ScreenConstant.MAIN_TAB]: NavigatorScreenParams<TabParamList> | undefined;
  [ScreenConstant.DROP_DRAG]: undefined;
  [ScreenConstant.PROFILE]: undefined;
  [ScreenConstant.CHECKIN]: {
    item: any;
  };
  [ScreenConstant.UPDATE_SCREEN]: any;
  [ScreenConstant.TAKE_PICTURE_VISIT]: undefined;
  [ScreenConstant.CHECKIN_NOTE_VISIT]: undefined;
  [ScreenConstant.NOTE_DETAIL]: {data: ItemNoteVisitDetail};
  [ScreenConstant.ADD_NOTE]: undefined;
  [ScreenConstant.CHECKIN_LOCATION]: undefined;
  [ScreenConstant.SEARCH_CUSTOMER]: undefined;
  [ScreenConstant.CHECKIN_ORDER]: undefined;
  [ScreenConstant.REPORT_SCREEN]: undefined;
  [ScreenConstant.STATISTICAL]: undefined;
  [ScreenConstant.NON_ORDER_CUSTOMER]: undefined;
  [ScreenConstant.TRAVEL_DIARY]: undefined;
  [ScreenConstant.ROUTE_RESULT]: undefined;
  [ScreenConstant.VISIT_RESULT]: undefined;
  [ScreenConstant.NEW_CUSTOMER]: undefined;
  [ScreenConstant.REPORT_DEBT]: undefined;
  [ScreenConstant.REPORT_KPI]: undefined;
  [ScreenConstant.SEARCH_COMMON_SCREEN]: {type :string};
};

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...arg: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamList[RouteName]]
    : [screen: RouteName, params?: RootStackParamList[RouteName]]
) {
  navigationRef.current?.navigate(
    arg[0] as any,
    arg.length > 1 ? arg[1] : undefined,
  );
}
export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack);
}

export function pop(screenCount: number) {
  navigationRef?.current?.dispatch(StackActions.pop(screenCount));
}

export function dispatch(action: NavigationAction) {
  navigationRef.current?.dispatch(action);
}
export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}
