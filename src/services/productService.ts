import { createApi } from "../api";
import { ApiConstant } from "../const";


export type PramsTypeProduct = {
    name? :string
    brand? :string,
    item_name? :string,
    industry? : string,
    item_group? : string,
    page_size?: number,
    page?:number
}

interface GET_PRODUCT_PROMOTION {
    items: Item[];
    customer: string;
    customer_group: string;
    territory: string;
    currency: string;
    price_list: string;
    price_list_currency: string;
    company: string;
    doctype: string;
    name: string;
}
interface Item {
    doctype: string;
    name: string;
    child_docname: string;
    item_code: string;
    qty?: number;
    stock_qty?: number;
    uom: string;
    parenttype: string;
    parent: string;
    is_free_item?: number;
    conversion_factor?: number;
}

interface GET_PRICE_LIST {
    items: Item[];
    customer: string;
    conversion_rate: number;
    price_list: string;
    company: string;
    doctype: string;
    name: string;
}

export const get = (params ?: PramsTypeProduct) => createApi().get(ApiConstant.GET_PRODUCT,params);
export const getBrand = () => createApi().get(ApiConstant.GET_BRAND_PRODUCT);
export const getIndustry = () => createApi().get(ApiConstant.GET_INDUSTRY_PRODUCT);
export const getGroup = () => createApi().get(ApiConstant.GET_GROUP_PRODUCT);
export const getWarehouse = () => createApi().get(ApiConstant.GET_WAREHOUSES);
export const getPromotionalProducts = (data : GET_PRODUCT_PROMOTION) => createApi().post(ApiConstant.GET_PRODUCT_PROMOTION,data);
export const getPriceListProducts = (data : GET_PRICE_LIST) => createApi().post(ApiConstant.GET_PRICE_PRODUCT,data);