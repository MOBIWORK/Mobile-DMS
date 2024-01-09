import { createApi } from "../api";
import { ApiConstant } from "../const";


type PramsType = {
    name? :string
    brand? :string,
    item_name? :string,
    industry? : string,
    item_group? : string
}


export const get = (params ?: PramsType) => createApi().get(ApiConstant.GET_PRODUCT,params)
export const getBrand = () => createApi().get(ApiConstant.GET_BRAND_PRODUCT)
export const getIndustry = () => createApi().get(ApiConstant.GET_INDUSTRY_PRODUCT)
export const getGroup = () => createApi().get(ApiConstant.GET_GROUP_PRODUCT)