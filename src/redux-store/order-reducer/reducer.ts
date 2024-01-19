import {createSlice} from '@reduxjs/toolkit';
import {PayloadAction, createAction} from '@reduxjs/toolkit';
import {OrderStateType} from './type';
import {IOrderDetail, IOrderList} from '../../models/types';
import * as Action from './type';
import {PramsTypeOrder} from '../../services/orderService';

const SLICE_NAME = 'ORDER_SLICE';
const initialState: OrderStateType = {
  data: [],
  loading: true,
  message: '',
  totalItem: 0,
  item: null,
};
type DataType = {
  data: IOrderList[];
  totalItem: number;
};

const orderSlice = createSlice({
  name: SLICE_NAME,
  initialState: initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataType>) => {
      state.data = action.payload.data;
      state.totalItem = action.payload.totalItem;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction) => {
      state.loading = false;
    },
    setItemData: (state, action: PayloadAction<IOrderDetail>) => {
      state.loading = false;
      state.item = action.payload;
    },
  },
});

const onGetData = createAction(Action.GET_ORDERS, (params: PramsTypeOrder) => ({
  payload: params,
}));
const onGetDetailData = createAction(
  Action.GET_ORDER_DETAIL,
  (data: IOrderDetail) => ({payload: data}),
);

export const orderAction = {
  ...orderSlice.actions,
  onGetData,
  onGetDetailData,
};
export const orderReducer = orderSlice.reducer;
