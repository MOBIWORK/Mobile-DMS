import {createApi} from '../api';
import {ApiConstant} from '../const';
import {BASE_URL, BASE_URL_MAP, API_EK_KEY, API_URL} from '@env';
import {client} from '../config/client';
import {VisitListItemType} from '../models/types';
import {GET_CUSTOMER_TERRITORY} from '../const/api.const';

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
  checkin_id: string;
  kh_ma: string;
  kh_ten: string;
  kh_diachi: string;
  kh_long?: number;
  kh_lat?: number;
  checkin_giovao: string;
  checkin_giora?: string;
  checkin_pinvao: number;
  checkin_pinra?: number;
  checkin_khoangcach?: number;
  checkin_trangthaicuahang?: boolean;
  checkin_donhang?: string;
  checkin_hinhanh?: any[];
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
  item: VisitListItemType;
};

export interface DMSConfigMobile {
  name: string;
  owner: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: string;
  config_name: string;
  vt_ngoaituyen: number;
  kb_vitringoaisaiso: number;
  saiso_chophep_kb_vitringoaisaiso: number;
  checkout_ngoaisaiso: number;
  saiso_chophep_checkout_ngoaisaiso: number;
  tgcheckin_toithieu: number;
  thoigian_toithieu: number;
  batbuoc_kiemton: number;
  batbuoc_chupanh: number;
  soluong_album: number;
  soluong_anh: number;
  batbuoc_ghichu: number;
  doctype: string;
}

export type ICheckFakeGPS = {
  datetime_fake: number;
  location_fake: {
    long: number;
    lat: number;
  };
  list_app: string;
};

export type IListVisitParams = {
  view_mode?: 'list' | 'map';
  page_size?: number;
  page_number?: number;
  router?: any;
  distance?: string;
  status?: 'active' | 'lock' | string;
  order_by?: 'asc' | 'desc' | string;
  birthDay?: string;
  birthday_from?: any;
  birthday_to?: any;
  customer_group?: string;
  customer_type?: string;
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

export const getUserProfile = () =>
  createApi()
    .get(ApiConstant.GET_USER_PROFILE)
    .then(res => res.data);

export const getCurrentShit = () =>
  createApi()
    .get(ApiConstant.GET_CURRENT_SHIT)
    .then(res => res.data);

export const updateProfile = (data: IProfile) =>
  createApi().put(ApiConstant.PUT_USER_PROFILE, data);

export const postChecking = (data: CheckinData) =>
  createApi()
    .post(ApiConstant.POST_CHECKIN, data, {
      baseURL: BASE_URL,
    })
    .then(res => res.data);

export const getCustomer = () =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER)
    .then(res => res.data);

export const getPageCustomer = (page: number) =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER + `?page=${page}`)
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

export const autocompleteGeoLocation = (autocompleteText: string) =>
  client
    .get(
      `https://api.ekgis.vn/v2/geocode/autocomplete?text=${autocompleteText}&api_key=${API_EK_KEY}`,
    )
    .then(res => res.data);
export const getCustomerVisit = (data?: IListVisitParams) =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER_VISIT, data)
    .then(res => res.data);

export const getSystemConfig = () =>
  createApi()
    .get(ApiConstant.GET_SYSTEM_CONFIG)
    .then(res => res.data);

export const getListCity = () => createApi().get(ApiConstant.GET_LIST_CITY);
export const getListDistrict = (ma_tinh_thanh: any) =>
  createApi().get(ApiConstant.GET_LIST_DISTRICT + `${ma_tinh_thanh}`);

export const getListWard = (ma_quan_huyen: any) =>
  createApi().get(ApiConstant.GET_LIST_WARD + `${ma_quan_huyen}`);

export const addFakeGPS = (data: ICheckFakeGPS) =>
  createApi().post(ApiConstant.CHECK_FAKE_GPS, data);

export const getUserNoteReceived = () => {
  return createApi()
    .get(ApiConstant.GET_NOTE_USER_RECEIVED)
    .then(res => res.data);
};
export const postNoteUser = (data: any) => {
  return createApi()
    .post(ApiConstant.POST_NEW_NOTE_CHECKIN, data)
    .then(res => res.data);
};
export const getListNoteApi = () => {
  return createApi()
    .get(ApiConstant.GET_LIST_NOTE_API)
    .then(res => res.data);
};
export const createImageCheckinApi = (data: any) =>
  createApi()
    .post(ApiConstant.CREATE_IMAGE_CHECKIN, data)
    .then(res => res.data);
