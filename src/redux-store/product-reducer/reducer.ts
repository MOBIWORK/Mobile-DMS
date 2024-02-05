import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { DataType, StateType } from "./type";
import * as Actions from "./type"
import { PramsTypeProduct } from "../../services/productService";
import { IProduct } from "../../models/types";

const SLICE_NAME = "PRODUCT_SLICE";

const initState: StateType = {
    data: [],
    totalItem: 0,
    dataSelected: [],
    isLoading: true,
    message: ""
}

function mergeArrays(arr1: any[], arr2: any[]) {
    let result = arr1.slice();
    arr2.forEach((obj2) => {
        let existingObjIndex = result.findIndex((obj1) => obj1.item_code === obj2.item_code);
        if (existingObjIndex !== -1) {
            result[existingObjIndex] = obj2;
        } else {
            result.push(obj2);
        }
    });

    return result;
}

const productSlice = createSlice({
    name: SLICE_NAME,
    initialState: initState,
    reducers: {
        setDataProduct: (state, action: PayloadAction<DataType>) => {
            state.isLoading = false;
            state.data = mergeArrays(state.data , action.payload.data);
            state.totalItem = action.payload.total
        },
        setProductSelected: (state, action: PayloadAction<IProduct[]>) => {
            state.dataSelected = action.payload
        },
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        },
        setLoading: (state, action: PayloadAction) => {
            state.isLoading = false
        },
    }
})

const onGetData = createAction(Actions.GET_PRODUCTS, (params?: PramsTypeProduct) => ({ payload: params }))

export const productActions = {
    ...productSlice.actions,
    onGetData
}

export const productReducer = productSlice.reducer;