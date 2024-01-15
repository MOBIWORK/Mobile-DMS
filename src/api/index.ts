import {ApiResponse, create} from 'apisauce';
import {ApiConstant, AppConstant} from '../const';


import {IApiResponse} from '../models/types';
import axios, {CreateAxiosDefaults} from 'axios';
import {BASE_URL} from '@env';
import {CommonUtils} from '../utils';
import { dispatch } from '../utils/redux';
import { appActions } from '../redux-store/app-reducer/reducer';

const DEFAULT_CONFIG: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: {...ApiConstant.HEADER_DEFAULT},
  timeout: ApiConstant.TIMEOUT,
};

const customAxiosInstance = axios.create(DEFAULT_CONFIG);
let Api = create({axiosInstance: customAxiosInstance, baseURL: BASE_URL});

/**
 * Middleware to handle failed request
 */
const handleErrorResponse = (
  response: ApiResponse<IApiResponse>,
  throwErrorIfFailed: any,
) => {
  if (response.status) {
    const isSuccessRequest = /^2\d{2}/g.test(response.status?.toString());
    if (isSuccessRequest && response.data?.result) {
      return;
    } else if (throwErrorIfFailed || response.data?.message) {
      dispatch(
        appActions.setError({
          title: response.data?.title,
          message: response.data?.message || response.data,
          viewOnly: true,
          status: response.status,
        }),
      );
      dispatch(appActions.setProcessingStatus(false));
    }
  } else {
    dispatch(
      appActions.setError({
        title: 'Không có kết nối đến máy chủ',
        message: null,
        viewOnly: true,
      }),
    );
  }
};

const createInstance = (deleteHeader?: boolean) => {
  const api_key = CommonUtils.storage.getString(AppConstant.Api_key) ?? '';
  const api_secret =
    CommonUtils.storage.getString(AppConstant.Api_secret) ?? '';
  const header =
    api_key && api_secret ? CommonUtils.Auth_header(api_key, api_secret) : null;

  let organization = CommonUtils.storage.getString(AppConstant.Organization);
  if (organization) {
    const organizationObj = JSON.parse(organization);
    Api.setBaseURL(organizationObj.erpnext_url);
  }
  if (deleteHeader) {
    Api.deleteHeader('Authorization');
  } else if (header) {
    Api.setHeaders({...header});
  }

  return Api;
};

Api.addResponseTransform(response => handleErrorResponse(response, true));
export const createApi = (deleteHeader?: boolean) =>
  createInstance(deleteHeader);
