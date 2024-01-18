import { createApi } from "../api"
import { ApiConstant } from "../const"

export type PramsTypeOrder = {
    from_date? :number,
    to_date? :number,
    status? : string,
    page_size? : number,
    page_number? : number,
}


export const get = (params? : PramsTypeOrder) => createApi().get(ApiConstant.GET_ORDER,params)
export const getDetail = (name : string) => createApi().get(ApiConstant.GET_ORDER_DETAIL,{name})