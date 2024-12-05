import {createApi} from '../api';
import {ApiConstant} from '../const';
import {APPLY_PROMOTION} from '../const/api.const';

export type PramsTypeProduct = {
  name?: string;
  brand?: string;
  item_name?: string;
  industry?: string;
  item_group?: string;
  page_size?: number | null;
  page_number?: number | null;
  customer?: string;
  warehouse?: string;
  key_search?: string;
};

export type GET_PRODUCT_PROMOTION = {
  customer: string;
  item_code_list: any;
};

export type APPLY_PROMOTION_TYPE = {
  listPromotions: string[];
  totalAmount: number;
  listItem: any;
};

export const get = (params?: PramsTypeProduct) =>
  createApi().get(ApiConstant.GET_PRODUCT, params);
export const getBrand = () => createApi().get(ApiConstant.GET_BRAND_PRODUCT);
export const getIndustry = () =>
  createApi().get(ApiConstant.GET_INDUSTRY_PRODUCT);
export const getGroup = () => createApi().get(ApiConstant.GET_GROUP_PRODUCT);
export const getWarehouse = (company: string) =>
  createApi().get(ApiConstant.GET_WAREHOUSES, {company});
export const getListPromotional = (data: GET_PRODUCT_PROMOTION) =>
  createApi().get(ApiConstant.GET_PRODUCT_PROMOTION, data);
export const applyPromotion = (data: APPLY_PROMOTION_TYPE) =>
  createApi().post(ApiConstant.APPLY_PROMOTION, data);
export const getListProductCampaign = (params: PramsTypeProduct) =>
  createApi().get(ApiConstant.GET_PRODUCT_CAMPAIGN, params);
