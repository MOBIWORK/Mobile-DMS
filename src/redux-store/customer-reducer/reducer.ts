import {createSlice,PayloadAction, createAction} from '@reduxjs/toolkit';
import {IProduct} from './type';
import {SLICE_NAME} from '../app-reducer/type';
import * as Actions from '../app-reducer/type';

const initialState: IProduct = {
  listCustomer: [],
  listCustomerVisit: [],
  newCustomer: [],
  listCustomerType: [],
};

const customerSlice = createSlice({
  name: SLICE_NAME.CUSTOMER,
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<any>) => {
      state.listCustomer = action.payload;
    },
    setCustomerVisit: (state, action: PayloadAction<any>) => {
      state.listCustomerVisit = action.payload;
    },
    setNewCustomer: (state, action: PayloadAction<any>) => {
      state.newCustomer = action.payload;
    },
    setListCustomerType: (state, action: PayloadAction<any>) =>
     void(state.listCustomerType = action.payload),
  },
});

const onGetCustomer = createAction(Actions.GET_CUSTOMER, (data?: any) => ({
  payload: data,
}));

const onGetCustomerVisit = createAction(
  Actions.GET_CUSTOMER_VISIT,
  (data?: any) => ({payload: data}),
);


const onGetCustomerByName = createAction(
  Actions.GET_CUSTOMER_BY_NAME,
  (name: string) => ({payload: name}),
);

const getCustomerType = createAction(
  Actions.GET_CUSTOMER_TYPE,
  (data?: any) => ({payload: data}),
);
export const customerReducer = customerSlice.reducer;

export const {
  setCustomer,
  setCustomerVisit,
  setListCustomerType,
  setNewCustomer
} = customerSlice.actions

export const customerActions = {
  ...customerSlice.actions,
  onGetCustomer,
  onGetCustomerByName,
  getCustomerType,
  onGetCustomerVisit,
};


