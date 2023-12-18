import {createApi} from '../api';
import {ApiConstant} from '../const';
import {BASE_URL} from '@env';

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

export const updateProfile = (data: IProfile) =>
  createApi().put(ApiConstant.PUT_USER_PROFILE, data);
