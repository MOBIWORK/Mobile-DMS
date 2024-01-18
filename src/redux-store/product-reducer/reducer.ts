import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { DataType, StateType } from "./type";
import * as Actions from "./type"
import { PramsTypeProduct } from "../../services/productService";

const SLICE_NAME = "PRODUCT_SLICE";

const initState: StateType = {
    data: [],
    totalItem: 0,
    isLoading: true,
    message: ""
}

const productSlice = createSlice({
    name: SLICE_NAME,
    initialState: initState,
    reducers: {
        setDataProduct: (state, action: PayloadAction<DataType>) => {
            state.isLoading = false;
            state.data = action.payload.data;
            state.totalItem = action.payload.total
        },
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        },
        setLoading: (state, action: PayloadAction) => {
            state.isLoading = false
        },
    }
})

const onGetData = createAction(Actions.GET_PRODUCTS, (params: PramsTypeProduct) => ({ payload: params }))

export const productActions = {
    ...productSlice.actions,
    onGetData
}

export const productReducer = productSlice.reducer;