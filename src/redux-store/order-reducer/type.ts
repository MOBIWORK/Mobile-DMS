import { IOrderList } from "../../models/types"


export type OrderStateType = {
    data : IOrderList[]
    loading : boolean,
    message : string,
    totalItem : number
}


export const GET_ORDERS = "GET_ORDERS"