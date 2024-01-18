import axios from 'axios';
import {createApi} from '../api';
import {ApiConstant} from '../const';
import {BASE_URL, BASE_URL_MAP, API_EK_KEY, API_URL} from '@env';
import {client} from '../config/client';

export type ILogin = {
  usr: string;
  pwd: string;
  device_name: string;
  device_id: string;
};

export type IProfile = {
  image?: string;
  full_name?: string;
  gender?: string;
  date_of_birth?: number;
  cell_number?: string;
  current_address?: string;
};

export type CustomerParams = {
  name: string;
  customer_type: string;
  customer_name: string;
  from_date: number;
  to_date: number;
};

export type CheckinData = {
  kh_ma: string;
  kh_ten: string;
  kh_diachi: string;
  kh_long?: number;
  kh_lat?: number;
  checkin_giovao: string;
  checkin_giora: string;
  checkin_pinvao: string;
  checkin_pinra?: string;
  checkin_khoangcach?: number;
  checkin_trangthaicuahang?: boolean;
  checkin_donhang?: string;
  checkin_hinhanh: any[];
  checkin_long?: number;
  checkin_lat?: number;
  checkin_timegps?: string;
  checkin_dochinhxac?: number;
  checkout_khoangcach?: number;
  checkinvalidate_khoangcachcheckin?: number;
  checkinvalidate_khoangcachcheckout?: number;
  createdDate: number;
  createdByEmail?: string;
  createByName?: string;
};

export const login = (data: ILogin, deleteHeader: boolean) =>
  createApi(deleteHeader).post(ApiConstant.POST_USER_LOGIN, data);

export const logout = (device_id: string) =>
  createApi().post(ApiConstant.POST_USER_LOGOUT, {device_id});

export const resetPassword = (email: string, deleteHeader: boolean) =>
  createApi(deleteHeader).post(ApiConstant.POST_RESET_PASSWORD, {
    user: email,
  });

export const verifyOrganization = (data: object) =>
  createApi(true).get(ApiConstant.POST_USER_ORGANIZATION, data, {
    baseURL: BASE_URL,
  });
export const verifyOrganizations = (data: object) =>
  client.get(ApiConstant.POST_USER_ORGANIZATION, data);

export const updateProfile = (data: IProfile) =>
  createApi().put(ApiConstant.PUT_USER_PROFILE, data);

export const postChecking = (data: any) =>
  createApi()
    .post(ApiConstant.POST_CHECKIN, data, {
      baseURL: BASE_URL,
    })
    .then(res => res.data);

export const getCustomer = () =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER)
    .then(res => res.data);

    
export const getCustomerByName = (name: string) =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER + `?customer_name=${name}`)
    .then(res => res.data);

export const getCustomerByType = (name: string) =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER + `?customer_type=${name}`)
    .then(res => res.data);

export const getCustomerType = () =>
  createApi()
    .get(ApiConstant.GET_TYPE_CUSTOMER)
    .then(res => res.data);

export const getDetailLocation = (lat?: number, lon?: number) =>
  client
    .get(
      BASE_URL_MAP + `?point.lon=${lon}&point.lat=${lat}&api_key=${API_EK_KEY}`,
    )
    .then(res => res.data);

export const getCustomerVisit = () =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER_VISIT)
    .then(res => res.data);

export const getSystemConfig = () =>
  createApi()
    .get(ApiConstant.GET_SYSTEM_CONFIG)
    .then(res => res.data);
