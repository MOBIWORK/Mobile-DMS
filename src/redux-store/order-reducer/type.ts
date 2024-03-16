import { IOrderDetail, IOrderList } from "../../models/types"


export type OrderStateType = {
    data : IOrderList[]
    loading : boolean,
    message : string,
    totalItem : number,
    item : IOrderDetail | null
}


export const GET_ORDERS = "GET_ORDERS"
export const GET_ORDER_DETAIL = "GET_ORDER_DETAIL"