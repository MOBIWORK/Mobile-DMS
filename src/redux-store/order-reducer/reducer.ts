import {createSlice } from "@reduxjs/toolkit";
import { OrderStateType } from "./type";
import { PayloadAction, createAction } from '@reduxjs/toolkit/dist/createAction';
import { IOrderList } from "../../models/types";
import * as Action from "./type"
const initialState  : OrderStateType= {
    data : [],
    loading : true,
    message : "",
    totalItem : 0
}
type DataType = {
    data : IOrderList[],
    totalItem : number
}

const orderSlice = createSlice({
    name :"ORDER_SLICE",
    initialState : initialState,
    reducers : {
        setData : (state , action : PayloadAction<DataType>) => {
            state.data = action.payload.data;
            state.totalItem = action.payload.totalItem
        },
        setMessage : (state , action : PayloadAction<string>)=>{
            state.message = action.payload;
            state.loading = false
        },
        setLoading : (state ,action :PayloadAction)=>{
            state.loading = false
        }
    }
})

const onGetData = createAction(Action.GET_ORDERS ,(data :DataType )=> ({payload :data}) )


export const orderAction = {
    ...orderSlice.actions,
    onGetData
}
export const orderReducer =  orderSlice.reducer;