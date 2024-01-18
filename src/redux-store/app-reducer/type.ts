import { ThemeType } from "../../layouts/theme";


interface ListCustomerType  {
  name:string,
  customer_group_name:string
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
    mainAddress:any[],
    mainContactAddress:any[],
    newCustomer:any[],
    loadingApp?:boolean,
    systemConfig?:any,
   
  }



export enum SLICE_NAME {
  CHECKIN = 'CHECKIN_' ,
  SET_ERROR = 'SET_ERROR_',
  SET_PROCESSING_STATUS = 'SET_PROCESSING_STATUS_',
  SET_FAILURE = 'SET_FAILURE_',
  APP ='APP_',
  GET_SYSTEM_CONFIG = 'GET_SYSTEM_CONFIG_',
  GET_CUSTOMER = 'GET_CUSTOMER_',
  GET_CUSTOMER_BY_NAME = 'GET_CUSTOMER_BY_NAME_',
  GET_CUSTOMER_TYPE = 'GET_CUSTOMER_TYPE_',
  GET_CUSTOMER_BY_DATE = 'GET_CUSTOMER_BY_DATE_',
  GET_TYPE_CUSTOMER = 'GET_TYPE_CUSTOMER_',
  CUSTOMER = 'CUSTOMER_',
  GET_CUSTOMER_VISIT = 'GET_CUSTOMER_VISIT_',
}



  
  
  export const RESET_APP = 'RESET_APP_RESET_APP';
  export const SET_SHOW_ERROR_MODAL = 'SET_SHOW_ERROR_MODAL_SET_SHOW_ERROR';
  export const SET_SEARCH_VISIT_VALUE = 'SET_SEARCH_VISIT_VALUE_SET_SEARCH_VISIT_VALUE';;
  export const SET_APP_THEME = 'SET_APP_THEME_SET_APP_THEME';
  export const SET_MAIN_ADDRESS = 'SET_MAIN_ADDRESS_SET_MAIN_ADDRESS';
  export const SET_MAIN_CONTACT_ADDRESS = 'SET_MAIN_CONTACT_ADDRESS_SET_MAIN_CONTACT_ADDRESS';
  export const SET_NEW_CUSTOMER = 'SET_NEW_CUSTOMER_SET_NEW_CUSTOMER';
  export const SET_SHOW_MODAL = 'SET_SHOW_MODAL_SET_SHOW_MODAL';
  export const REMOVE_CONTACT_ADDRESS = 'REMOVE_CONTACT_ADDRESS_REMOVE_CONTACT_ADDRESS';
  export const REMOVE_ADDRESS = 'REMOVE_ADDRESS_REMOVE_ADDRESS';
  export const SET_SEARCH_CUSTOMER_VALUE ='SET_SEARCH_CUSTOMER_VALUE_SET_SEARCH_CUSTOMER_VALUE';
  export const CHECKIN =  SLICE_NAME.CHECKIN + 'CHECKIN'
  export const GET_SYSTEM_CONFIG = SLICE_NAME.GET_SYSTEM_CONFIG + 'GET_SYSTEM_CONFIG';
  export const GET_CUSTOMER = SLICE_NAME.GET_CUSTOMER + 'GET_CUSTOMER';
  export const GET_CUSTOMER_BY_NAME = SLICE_NAME.GET_CUSTOMER_BY_NAME + 'GET_CUSTOMER_BY_NAME';
  export const GET_CUSTOMER_BY_DATE = SLICE_NAME.GET_CUSTOMER_BY_NAME + "GET_CUSTOMER_BY_DATE";
  export const GET_CUSTOMER_TYPE = SLICE_NAME.GET_CUSTOMER_TYPE + "GET_CUSTOMER_TYPE";
  export const GET_CUSTOMER_VISIT = SLICE_NAME.GET_CUSTOMER_VISIT + 'GET_CUSTOMER_VISIT';
