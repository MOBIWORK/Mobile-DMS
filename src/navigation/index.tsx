import React, {
  createRef,
  FC,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import type {
  NavigationAction,
  NavigationContainerRef,
  RouteProp,
} from '@react-navigation/native';
import {
  CommonActions,
  NavigationContainer,
  NavigatorScreenParams,
  StackActions,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppConstant, ScreenConstant} from '../const';

import {
  IDataCustomer,
  IProduct,
  ItemNoteVisitDetail,
  ReportOrderItemType,
  VisitListItemType,
} from '../models/types';
import {
  AddingNewCustomer,
  AddNote,
  CheckIn,
  CheckInLocation,
  CheckinNote,
  CheckinOrder,
  CheckinOrderCreated,
  DetailCustomer,
  ForgotPassword,
  Home,
  ImageView,
  Index,
  KPI,
  ListProduct,
  ListVisit,
  NonOrderCustomer,
  NoteDetail,
  NotificationScreen,
  OrderDetail,
  OrderList,
  ProductDetail,
  Profile,
  Report,
  ReportOrderDetail,
  SearchCustomer,
  SearchProduct,
  SearchSreen,
  SearchVisit,
  SelectOrganization,
  SignIn,
  Statistical,
  SuccessChanged,
  TakePicture,
  TravelDiary,
  VisitResult,
  WidgetFavouriteScreen,
  NewCustomer,
  ReportDebt,
  Inventory,
  RouteResult,
  CheckinSelectProdct,
} from '../screens';
// import { MAIN_TAB } from '../const/screen.const';
import {MyAppTheme} from '../layouts/theme';

// import { MAIN_TAB } from '../const/screen.const';
import MainTab, {TabParamList} from './MainTab';
import linking from '../utils/linking.utils';
import {useSelector} from '../config/function';
import {RXStore} from '../utils/redux';
import {CommonUtils} from '../utils';
import {PortalHost} from '../components/common/portal';
import {shallowEqual} from 'react-redux';
import {CheckinData} from '../services/appService';
import {AppState, AppStateStatus} from 'react-native';

const AppNavigationContainer: FC<AppNavigationContainerProps> = ({
  children,
}) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const theme = useSelector(state => state.app.theme);
  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const validate = CommonUtils.storage.getString(AppConstant.Api_key);

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
      console.log(nextAppState, 'app state');
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    const appState = AppState.addEventListener('change', handleAppStateChange);
    if ( dataCheckIn && Object.keys(dataCheckIn)?.length > 0) {
      navigate(ScreenConstant.CHECKIN, {item: dataCheckIn});
    } else {
      return;
    }
    return () => {
      appState.remove();
    };
  }, [dataCheckIn]);

  return (
    <NavigationContainer
      theme={MyAppTheme[theme]}
      linking={linking}
      ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={
          validate
            ? ScreenConstant.MAIN_TAB
            : ScreenConstant.SELECT_ORGANIZATION
        }
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_left',
        }}>
        <Stack.Screen
          name={ScreenConstant.SELECT_ORGANIZATION}
          component={SelectOrganization}
        />
        <Stack.Screen name={ScreenConstant.SIGN_IN} component={SignIn} />

        <Stack.Screen name={ScreenConstant.MAIN_TAB} component={MainTab} />
        <Stack.Screen name={ScreenConstant.HOME_SCREEN} component={Home} />
        <Stack.Screen
          name={ScreenConstant.WIDGET_FVR_SCREEN}
          component={WidgetFavouriteScreen}
        />
        <Stack.Screen
          name={ScreenConstant.NOTIFYCATION}
          component={NotificationScreen}
        />
        {/* <Stack.Screen
        name={ScreenConstant.UPDATE_SCREEN}
        component={UpdateScreen}

        /> */}
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
          name={ScreenConstant.CHECKIN_SELECT_PRODUCT}
          component={CheckinSelectProdct}
        />
        <Stack.Screen
          name={ScreenConstant.ADDING_NEW_CUSTOMER}
          component={AddingNewCustomer}
        />
        <Stack.Screen
          name={ScreenConstant.CHECKIN_ORDER}
          component={CheckinOrder}
        />
        <Stack.Screen
          name={ScreenConstant.CHECKIN_ORDER_CREATE}
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
        <Stack.Screen name={ScreenConstant.ADD_NOTE} component={CheckinNote} />
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
        <Stack.Screen
          name={ScreenConstant.TRAVEL_DIARY}
          component={TravelDiary}
        />
        <Stack.Screen
          name={ScreenConstant.SEARCH_COMMON_SCREEN}
          component={SearchSreen}
        />
      </Stack.Navigator>
      {children}
      <RXStore />
      <PortalHost name={'Bottom-Sheet'} />
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
  [ScreenConstant.PRODUCT_DETAIL]: {item: IProduct};
  [ScreenConstant.IMAGE_VIEW]: {data: any};
  [ScreenConstant.ORDER_SCREEN]: undefined;
  [ScreenConstant.ORDER_DETAIL_SCREEN]: {name: string};
  [ScreenConstant.LIST_VISIT]: undefined;
  [ScreenConstant.VISIT]: undefined;
  [ScreenConstant.SEARCH_VISIT]: undefined;
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.ADDING_NEW_CUSTOMER]: undefined;
  [ScreenConstant.CHECKIN_INVENTORY]: undefined;
  [ScreenConstant.CHECKIN_SELECT_PRODUCT]: undefined;
  [ScreenConstant.CHECKIN_ORDER]: {type: string};
  [ScreenConstant.CHECKIN_ORDER_CREATE]: {type: string};
  [ScreenConstant.CUSTOMER]: undefined;
  [ScreenConstant.ADDING_NEW_CUSTOMER]: undefined;
  [ScreenConstant.DETAIL_CUSTOMER]: {data: IDataCustomer};
  [ScreenConstant.VISIT_DETAIL]: {data: VisitListItemType};
  [ScreenConstant.REPORT_ORDER_DETAIL]: {item: ReportOrderItemType};
  [ScreenConstant.MAIN_TAB]: NavigatorScreenParams<TabParamList> | undefined;
  [ScreenConstant.DROP_DRAG]: undefined;
  [ScreenConstant.PROFILE]: undefined;
  [ScreenConstant.CHECKIN]: {item: any};
  [ScreenConstant.UPDATE_SCREEN]: any;
  [ScreenConstant.TAKE_PICTURE_VISIT]: undefined;
  [ScreenConstant.CHECKIN_NOTE_VISIT]: undefined;
  [ScreenConstant.NOTE_DETAIL]: {data: ItemNoteVisitDetail};
  [ScreenConstant.ADD_NOTE]: undefined;
  [ScreenConstant.CHECKIN_LOCATION]: {type: string; data: VisitListItemType};
  [ScreenConstant.SEARCH_CUSTOMER]: undefined;
  [ScreenConstant.CHECKIN_ORDER]: {type: string};
  [ScreenConstant.REPORT_SCREEN]: undefined;
  [ScreenConstant.STATISTICAL]: undefined;
  [ScreenConstant.NON_ORDER_CUSTOMER]: undefined;
  [ScreenConstant.TRAVEL_DIARY]: undefined;
  [ScreenConstant.ROUTE_RESULT]: undefined;
  [ScreenConstant.VISIT_RESULT]: undefined;
  [ScreenConstant.NEW_CUSTOMER]: undefined;
  [ScreenConstant.REPORT_DEBT]: undefined;
  [ScreenConstant.REPORT_KPI]: undefined;
  [ScreenConstant.SEARCH_COMMON_SCREEN]: {type: string};
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
