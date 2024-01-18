import { IProduct } from "../../models/types"



export type StateType = {
    data : IProduct[],
    totalItem : number,
    message :string,
    isLoading : boolean
}

export type DataType = {
    data : IProduct[],
    total : number,
}

export const GET_PRODUCTS = "GET_PRODUCTS"