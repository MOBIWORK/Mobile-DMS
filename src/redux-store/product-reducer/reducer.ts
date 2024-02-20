import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { DataType, StateType } from "./type";
import * as Actions from "./type"
import { PramsTypeProduct } from "../../services/productService";
import { IProduct, KeyAbleProps } from "../../models/types";

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

function mergeArraysSelectProduct(arr1: IProduct[], arr2: IProduct[]) {
    const newArr: IProduct[] = [];
    for (let i = 0; i < arr2.length; i++) {
        let e1 = arr2[i];
        for (let j = 0; j < arr1.length; j++) {
            let e2 = arr1[j];
            if (e2.item_code === e1.item_code) {
                e1 = { ...e1, quantity: e1.quantity + e2.quantity }
            }
        }
        newArr.push(e1)
    }
    return newArr
}

const productSlice = createSlice({
    name: SLICE_NAME,
    initialState: initState,
    reducers: {
        setDataProduct: (state, action: PayloadAction<DataType>) => {
            state.data = mergeArrays(state.data , action.payload.data);
            state.totalItem = action.payload.total
            state.isLoading = false;
        },
        setProductSelected: (state, action: PayloadAction<IProduct[]>) => {
            const newData = mergeArraysSelectProduct(state.dataSelected,action.payload);
            state.dataSelected = newData
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