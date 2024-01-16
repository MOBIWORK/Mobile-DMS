import { createApi } from "../api"
import { ApiConstant } from "../const"

type PramsType = {
    from_date? :number,
    to_date? :number,
    status? : string,
    page_size? : number,
    page_number? : number,
}


export const get = (params? : PramsType) => createApi().get(ApiConstant.GET_ORDER,params)
export const getDetail = (name : string) => createApi().get(ApiConstant.GET_ORDER_DETAIL,{name})