import {createApi} from '../api';
import {ApiConstant} from '../const';
import {IDataCustomer} from '../models/types';

export const getCustomerTerritory = () =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER_TERRITORY)
    .then(res => res.data);

export const getCustomerRoute = () =>
  createApi()
    .get(ApiConstant.GET_CUSTOMER_ROUTE)
    .then(res => res.data);

export const addNewCustomer = (data: IDataCustomer) =>
  createApi()
    .post(ApiConstant.POST_ADD_NEW_CUSTOMER, data)
    .then(res => res.data);

export const getVisitRouteDetail = (customer_name: string) =>
  createApi()
    .get(ApiConstant.GET_VISIT_ROUTE_DETAIL, {customer_name: customer_name})
    .then(res => res.data);
