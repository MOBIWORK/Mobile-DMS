import {BASE_URL} from '@env';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import {ApiConstant, AppConstant} from '../const';
import {CommonUtils} from '../utils';
import {showSnack} from '../components/common';
import {translate} from '../language';

const DEFAULT_CONFIG: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: {...ApiConstant.HEADER_DEFAULT},
  timeout: ApiConstant.TIMEOUT,
};

const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const api_key = CommonUtils.storage.getString(AppConstant.Api_key) ?? '';
  const api_secret =
    CommonUtils.storage.getString(AppConstant.Api_secret) ?? '';
  const header =
    api_key && api_secret ? CommonUtils.Auth_header(api_key, api_secret) : null;

  (config!.baseURL = DEFAULT_CONFIG.baseURL),
    (config!.timeout = DEFAULT_CONFIG.timeout);
  config!.headers = DEFAULT_CONFIG.headers as any;
  return config;
};
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response]: `, response);
  return response;
};

const onResponseError = (error: AxiosError | any): Promise<AxiosError> => {
  if (error?.response?.status === 400) {
    console.log('%c### 400', 'color:red', error);
    showSnack({msg: translate('errorHaveError')});
    return error?.response?.data;
  }
  if (error?.response?.status === 401) {
    const loggedIn = true;
    if (loggedIn) {
      console.log(error);
      return Promise.resolve(error);
    } else {
      showSnack({
        msg: translate('errorHaveError'),
        interval: 3000,
        type: 'error',
      });
    }
  }
  if (error?.response?.status === 500) {
    showSnack({
      msg: translate('errorHaveError'),
      interval: 3000,
      type: 'error',
    });
    return Promise.resolve(error);
  }

  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance,
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

export const client = setupInterceptorsTo(axios);
