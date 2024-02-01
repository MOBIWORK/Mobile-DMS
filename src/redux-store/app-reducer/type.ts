import {ThemeType} from '../../layouts/theme';
import {
  MainAddress,
  MainContactAddress,
} from '../../screens/Customer/components/CardAddress';

interface ListCustomerType {
  name: string;
  customer_group_name: string;
}

interface ListCity {
  ma_tinh: string;
  ten_tinh: string;
}

interface ListDistrict {
  ma_huyen: string;
  ten_huyen: string;
  ma_tinh_thanh: string;
}
interface ListWard {
  ma_xa: string;
  ten_xa: string;
  ma_quan_huyen: string;
}

export interface IAppRedux {
  error?: {
    title: string;
    message: string;
    viewOnly?: boolean;
    status?: number;
  };
  isProcessing: boolean;
  showModal: boolean;
  searchProductValue: string;
  searchVisitValue: string;
  searchCustomerValue: string;
  theme: ThemeType;
  newCustomer: any[];
  loadingApp?: boolean;
  systemConfig?: any;
  currentLocation?: any;
  listDataCity: {
    city: ListCity[];
    district: ListDistrict[];
    ward: ListWard[];
  };
  dataCheckIn: any;
}

export enum SLICE_NAME {
  CHECKIN = 'CHECKIN_',
  SET_ERROR = 'SET_ERROR_',
  SET_PROCESSING_STATUS = 'SET_PROCESSING_STATUS_',
  SET_FAILURE = 'SET_FAILURE_',
  APP = 'APP_',
  GET_SYSTEM_CONFIG = 'GET_SYSTEM_CONFIG_',
  GET_CUSTOMER = 'GET_CUSTOMER_',
  GET_CUSTOMER_BY_NAME = 'GET_CUSTOMER_BY_NAME_',
  GET_CUSTOMER_TYPE = 'GET_CUSTOMER_TYPE_',
  GET_CUSTOMER_BY_DATE = 'GET_CUSTOMER_BY_DATE_',
  GET_TYPE_CUSTOMER = 'GET_TYPE_CUSTOMER_',
  CUSTOMER = 'CUSTOMER_',
  GET_CUSTOMER_VISIT = 'GET_CUSTOMER_VISIT_',
  GET_LIST_TERRITORY = 'GET_LIST_TERRITORY_',
  GET_LIST_CITY = 'GET_LIST_CITY_',
  GET_LIST_DISTRICT = 'GET_LIST_DISTRICT_',
  GET_LIST_WARD = 'GET_LIST_WARD_',
  GET_LIST_ROUTE = 'GET_LIST_ROUTE_',
  POST_NEW_ROUTE = 'POST_NEW_ROUTE_',
}

export const RESET_APP = 'RESET_APP_RESET_APP';
export const SET_SHOW_ERROR_MODAL = 'SET_SHOW_ERROR_MODAL_SET_SHOW_ERROR';
export const SET_SEARCH_VISIT_VALUE =
  'SET_SEARCH_VISIT_VALUE_SET_SEARCH_VISIT_VALUE';
export const SET_APP_THEME = 'SET_APP_THEME_SET_APP_THEME';
export const SET_MAIN_ADDRESS = 'SET_MAIN_ADDRESS_SET_MAIN_ADDRESS';
export const SET_MAIN_CONTACT_ADDRESS =
  'SET_MAIN_CONTACT_ADDRESS_SET_MAIN_CONTACT_ADDRESS';
export const SET_NEW_CUSTOMER = 'SET_NEW_CUSTOMER_SET_NEW_CUSTOMER';
export const SET_SHOW_MODAL = 'SET_SHOW_MODAL_SET_SHOW_MODAL';
export const REMOVE_CONTACT_ADDRESS =
  'REMOVE_CONTACT_ADDRESS_REMOVE_CONTACT_ADDRESS';
export const REMOVE_ADDRESS = 'REMOVE_ADDRESS_REMOVE_ADDRESS';
export const SET_SEARCH_CUSTOMER_VALUE =
  'SET_SEARCH_CUSTOMER_VALUE_SET_SEARCH_CUSTOMER_VALUE';
export const CHECKIN = SLICE_NAME.CHECKIN + 'CHECKIN';
export const GET_SYSTEM_CONFIG =
  SLICE_NAME.GET_SYSTEM_CONFIG + 'GET_SYSTEM_CONFIG';
export const GET_CUSTOMER = SLICE_NAME.GET_CUSTOMER + 'GET_CUSTOMER';
export const GET_CUSTOMER_BY_NAME =
  SLICE_NAME.GET_CUSTOMER_BY_NAME + 'GET_CUSTOMER_BY_NAME';
export const GET_CUSTOMER_BY_DATE =
  SLICE_NAME.GET_CUSTOMER_BY_NAME + 'GET_CUSTOMER_BY_DATE';
export const GET_CUSTOMER_TYPE =
  SLICE_NAME.GET_CUSTOMER_TYPE + 'GET_CUSTOMER_TYPE';
export const GET_CUSTOMER_VISIT =
  SLICE_NAME.GET_CUSTOMER_VISIT + 'GET_CUSTOMER_VISIT';
export const GET_LIST_DISTRICT =
  SLICE_NAME.GET_LIST_DISTRICT + 'GET_LIST_DISTRICT';
export const GET_LIST_TERRITORY =
  SLICE_NAME.GET_LIST_TERRITORY + 'GET_LIST_TERRITORY';
export const GET_LIST_CITY = SLICE_NAME.GET_LIST_CITY + 'GET_LIST_CITY';
export const GET_LIST_WARD = SLICE_NAME.GET_LIST_WARD + 'GET_LIST_WARD';
export const GET_LIST_ROUTE = SLICE_NAME.GET_LIST_ROUTE + 'GET_LIST_ROUTE';
export const POST_NEW_ROUTE = SLICE_NAME.POST_NEW_ROUTE + 'POST_NEW_ROUTE';
