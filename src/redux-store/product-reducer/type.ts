import { IProduct } from "../../models/types"



export type StateType = {
    data : IProduct[],
    totalItem : number,
    dataSelected : IProduct[]
    message :string,
    isLoading : boolean
}

export type DataType = {
    data : IProduct[],
    total : number,
}

export const GET_PRODUCTS = "GET_PRODUCTS"