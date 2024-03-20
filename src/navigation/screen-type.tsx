import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenConstant} from '../const';
import {
  IDataCustomers,
  IProduct,
  NoteType,
  ReportOrderItemType,
  VisitListItemType,
} from '../models/types';
import {CheckinData} from '../services/appService';
import {TabParamList} from './MainTab';

export type UnAuthorizeParamList = {
  [ScreenConstant.SIGN_IN]: {organizationName?: string};
  [ScreenConstant.SELECT_ORGANIZATION]: {data?: string};
  [ScreenConstant.SCANNER]: undefined;
  [ScreenConstant.FORGOT_PASSWORD]: undefined;
  [ScreenConstant.SUCCESS_CHANGE]: undefined;
};
export type AuthorizeParamsList = {
  [ScreenConstant.HOME_SCREEN]: undefined;
  [ScreenConstant.NOTIFYCATION]: undefined;
  [ScreenConstant.WIDGET_FVR_SCREEN]: undefined;
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
  [ScreenConstant.DETAIL_CUSTOMER]: {data: IDataCustomers};
  [ScreenConstant.VISIT_DETAIL]: {data: VisitListItemType};
  [ScreenConstant.REPORT_ORDER_DETAIL]: {item: ReportOrderItemType};
  [ScreenConstant.MAIN_TAB]: NavigatorScreenParams<TabParamList> | undefined;
  [ScreenConstant.DROP_DRAG]: undefined;
  [ScreenConstant.PROFILE]: undefined;
  [ScreenConstant.CHECKIN]: {item: CheckinData};
  [ScreenConstant.UPDATE_SCREEN]: any;
  [ScreenConstant.TAKE_PICTURE_VISIT]: {data: any};
  [ScreenConstant.CHECKIN_NOTE_VISIT]: undefined;
  [ScreenConstant.NOTE_DETAIL]: {data: NoteType};
  [ScreenConstant.ADD_NOTE]: undefined;
  [ScreenConstant.CHECKIN_LOCATION]: {type: string; data: CheckinData};
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
  [ScreenConstant.TAKE_PICTURE_SCORE]: {
    data: any;
    screen: any;
  };
  [ScreenConstant.LIST_ALBUM_SCORE]: {
    data: any;
  };
  [ScreenConstant.USER_INFO_SCREEN]: undefined;
  [ScreenConstant.EDIT_ACCOUNT]: {title: string; content: string};
  [ScreenConstant.ACCOUNT_SETTING]: undefined;
  [ScreenConstant.CURRENT_PASSWORD]: undefined;
  [ScreenConstant.CHANGE_PASSWORD]: {isForgotPassword: boolean};
  [ScreenConstant.NOTIFY_SETTING]: undefined;
};

export type RootStackParamList = {
  [ScreenConstant.UNAUTHORIZED]: NavigatorScreenParams<UnAuthorizeParamList>;
  [ScreenConstant.AUTHORIZED]: NavigatorScreenParams<AuthorizeParamsList>;
} & UnAuthorizeParamList &
  AuthorizeParamsList;

// Define prop type for useNavigation and useRoute
export type NavigationProp =
  NativeStackScreenProps<RootStackParamList>['navigation'];
export type RouterProp<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
