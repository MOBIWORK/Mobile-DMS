import {createApi} from '../api';
import {ApiConstant} from '../const';
import {DELETE_ORDER} from '../const/api.const';

export type PramsTypeOrder = {
  from_date?: number;
  to_date?: number;
  status?: string;
  page_size?: number;
  page_number?: number;
  search_key?: string;
};

export interface POST_DATA {
  customer: string;
  delivery_date?: number;
  set_warehouse: string;
  apply_discount_on: string;
  additional_discount_percentage: number;
  discount_amount: number;
  rate_taxes: number;
  taxes_and_charges: string;
  checkin_id?: string;
  company: string;
  items: Item[];
  grand_total: number;
}

export interface Item {
  item_code: string;
  qty: number;
  rate: string;
  uom: string;
  discount_percentage: number;
}

type GetDetailOrder = {
  checkin_id: string;
  doctype: 'Sales Order' | 'Sales Invoice';
};

export const get = (params?: PramsTypeOrder) =>
  createApi().get(ApiConstant.GET_ORDER, params);
export const getDetail = (name: string, doctype: string) =>
  createApi().get(ApiConstant.GET_ORDER_DETAIL, {name, doctype});
export const getListVat = (company: string) =>
  createApi().get(ApiConstant.GET_VATS, {company});
export const createdOrder = (data: POST_DATA) =>
  createApi().post(ApiConstant.POST_ORDER, data);
export const createdReturnOrder = (data: POST_DATA) =>
  createApi().post(ApiConstant.POST_RETuRN_ORDER, data);
export const getDetailCheckinOrder = (params: GetDetailOrder) =>
  createApi().get(ApiConstant.GET_DETAIL_CHECKIN_ORDER, params);
export const deleteOrder = (orderName: string, doctype: string) =>
  createApi().delete(ApiConstant.DELETE_ORDER, {
    name: orderName,
    doctype: doctype,
  });
