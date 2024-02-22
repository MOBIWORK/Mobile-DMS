import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';
import {IProduct} from './type';
import {SLICE_NAME} from '../app-reducer/type';
import * as Actions from '../app-reducer/type';
import {IDataCustomer} from '../../models/types';

const initialState: IProduct = {
  listCustomer: [],
  listCustomerVisit: [],
  newCustomer: [],
  listCustomerType: [],
  listCustomerTerritory: [],
  listCustomerRoute: [],
  mainAddress: {},
  mainContactAddress: {},
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
      void (state.listCustomerType = action.payload),
    setListCustomerTerritory: (state, action: PayloadAction<any>) => {
      state.listCustomerTerritory = action.payload;
    },
    setListCustomerRoute: (state, action: PayloadAction<any>) => {
      state.listCustomerRoute = action.payload;
    },
    setMainContactAddress: (state, action: PayloadAction<any>) => {
      state.mainContactAddress = action.payload;
    },
    setMainAddress: (state, action: PayloadAction<any>) => {
      state.mainAddress = action.payload;
    },
  },
});

const onGetCustomer = createAction(Actions.GET_CUSTOMER);

const onGetCustomerVisit = createAction(Actions.GET_CUSTOMER_VISIT);

const onGetCustomerByName = createAction(
  Actions.GET_CUSTOMER_BY_NAME,
  (name: string) => ({payload: name}),
);

const getCustomerType = createAction(Actions.GET_CUSTOMER_TYPE);

const addingCustomer = createAction(
  Actions.ADDING_NEW_CUSTOMER,
  (data: IDataCustomer) => ({payload: data}),
);
const getCustomerTerritory = createAction(Actions.GET_CUSTOMER_TERRITORY)

export const customerReducer = customerSlice.reducer;

export const {
  setCustomer,
  setCustomerVisit,
  setListCustomerType,
  setListCustomerTerritory,
  setNewCustomer,
} = customerSlice.actions;

export const customerActions = {
  ...customerSlice.actions,
  onGetCustomer,
  onGetCustomerByName,
  getCustomerType,
  onGetCustomerVisit,
  addingCustomer,
  getCustomerTerritory
};
