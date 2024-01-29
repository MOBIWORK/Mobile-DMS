import {createApi} from '../api';
import {ApiConstant} from '../const';

export type IUpdateAddress = {
  customer: string;
  long: number;
  lat: number;
  address_line1: string;
  state: string;
  county: string;
  city: string;
  country: 'Việt Nam';
};

export const updateCustomerAddress = (data: IUpdateAddress) =>
  createApi().patch(ApiConstant.UPDATE_CUSTOMER_ADDRESS, data);
