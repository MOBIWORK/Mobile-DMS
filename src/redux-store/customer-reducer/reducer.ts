import { createSlice } from "@reduxjs/toolkit";
import { IProduct } from "./type";
import { SLICE_NAME } from "../app-reducer/type";
import { PayloadAction, createAction } from '@reduxjs/toolkit/dist/createAction';
import * as Actions from '../app-reducer/type';


const initialState:IProduct = {
    listCustomer:[],
    listCustomerVisit:[],
    newCustomer:[],
    listCustomerType:[]
}

const customerSlice = createSlice({
    name:SLICE_NAME.CUSTOMER,
    initialState,
    reducers:{
        setCustomer:(state,action:PayloadAction<any>) =>{
            state.listCustomer = action.payload
        },
        setCustomerVisit:(state,action:PayloadAction<any>) =>{
            state.listCustomerVisit = action.payload
        },
        setNewCustomer:(state,action:PayloadAction<any>) =>{
            state.newCustomer = action.payload
        },
        setListCustomerType:(state,action:PayloadAction<any>) =>(
            state.listCustomerType = action.payload
        )
    }
})

const onGetCustomer = createAction(Actions.GET_CUSTOMER,(data?:any) =>({payload:data}))
const onGetCustomerVisit = createAction(Actions.GET_CUSTOMER_VISIT,(data?:any) =>({payload:data}))
const onGetCustomerByName = createAction(
    Actions.GET_CUSTOMER_BY_NAME,
    (name: string) => ({payload: name}),
  );
  
  const onGetCustomerType = createAction(
    Actions.GET_CUSTOMER_TYPE,
    (data?: any) => ({payload: data}),
  );
  export const customerActions = {
    ...customerSlice.actions,
    onGetCustomer,
    onGetCustomerByName,
    onGetCustomerType,
    onGetCustomerVisit
  };
  
  export const customerReducer = customerSlice.reducer;
 