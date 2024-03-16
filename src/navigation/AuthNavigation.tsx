import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthorizeParamsList} from './screen-type';
import {ScreenConstant} from '../const';
import {
  Home,
  WidgetFavouriteScreen,
  NotificationScreen,
  ImageView,
  SearchVisit,
  ListProduct,
  SearchProduct,
  ProductDetail,
  ListVisit,
  OrderList,
  OrderDetail,
  Inventory,
  CheckinSelectProdct,
  AddingNewCustomer,
  CheckinOrder,
  CheckinOrderCreated,
  AddNote,
  Index,
  DetailCustomer,
  ReportOrderDetail,
  CheckIn,
  TakePicture,
  NoteDetail,
  CheckinNote,
  CheckInLocation,
  Profile,
  SearchCustomer,
  Report,
  Statistical,
  NonOrderCustomer,
  RouteResult,
  VisitResult,
  NewCustomer,
  ReportDebt,
  KPI,
  TravelDiary,
  SearchSreen,
  TakePictureScore,
  ListAlbumScore,
  UserInfoScreen,
  EditAccount,
  AccountSetting,
  CurrentPassword,
  ChangePassword,
  NotifySetting,
} from '../screens';
import MainTab from './MainTab';

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator<AuthorizeParamsList>();
  return (
    <Stack.Navigator>
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
      <Stack.Screen name={ScreenConstant.ORDER_SCREEN} component={OrderList} />
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
      <Stack.Screen name={ScreenConstant.ADD_NOTE} component={AddNote} />
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
      <Stack.Screen name={ScreenConstant.NOTE_DETAIL} component={NoteDetail} />
      <Stack.Screen
        name={ScreenConstant.CHECKIN_NOTE_VISIT}
        component={CheckinNote}
      />
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
      <Stack.Screen name={ScreenConstant.STATISTICAL} component={Statistical} />
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
      <Stack.Screen name={ScreenConstant.REPORT_DEBT} component={ReportDebt} />
      <Stack.Screen name={ScreenConstant.REPORT_KPI} component={KPI} />
      <Stack.Screen
        name={ScreenConstant.TRAVEL_DIARY}
        component={TravelDiary}
      />
      <Stack.Screen
        name={ScreenConstant.SEARCH_COMMON_SCREEN}
        component={SearchSreen}
      />
      <Stack.Screen
        name={ScreenConstant.TAKE_PICTURE_SCORE}
        component={TakePictureScore}
      />
      <Stack.Screen
        name={ScreenConstant.LIST_ALBUM_SCORE}
        component={ListAlbumScore}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenConstant.USER_INFO_SCREEN}
        component={UserInfoScreen}
      />
      <Stack.Screen
        name={ScreenConstant.EDIT_ACCOUNT}
        component={EditAccount}
      />
      <Stack.Screen
        name={ScreenConstant.ACCOUNT_SETTING}
        component={AccountSetting}
      />
      <Stack.Screen
        name={ScreenConstant.CURRENT_PASSWORD}
        component={CurrentPassword}
      />
      <Stack.Screen
        name={ScreenConstant.CHANGE_PASSWORD}
        component={ChangePassword}
      />
      <Stack.Screen
        name={ScreenConstant.NOTIFY_SETTING}
        component={NotifySetting}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

const styles = StyleSheet.create({});
