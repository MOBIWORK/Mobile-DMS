import { ThemeType } from "../../layouts/theme";

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
    loadingApp?:boolean
  }



export enum SLICE_NAME {
  CHECKIN = 'CHECKIN_' ,
  SET_ERROR = 'SET_ERROR_',
  SET_PROCESSING_STATUS = 'SET_PROCESSING_STATUS_',
  SET_FAILURE = 'SET_FAILURE_',
  APP ='APP_'

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