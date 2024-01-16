import {PayloadAction, createAction, createSlice} from '@reduxjs/toolkit';
import {IAppRedux, SLICE_NAME} from './type';
import {ThemeType} from '../../layouts/theme';
import * as Actions from './type';
import {VisitListItemType} from '../../models/types';

const initialAppState: IAppRedux = {
  error: undefined,
  isProcessing: false,
  showModal: true,
  searchProductValue: '',
  searchVisitValue: '',
  theme: 'default',
  mainAddress: [],
  mainContactAddress: [],
  newCustomer: [],
  searchCustomerValue: '',
  loadingApp: false,
  listCustomerType:[],
  systemConfig:{},
  listCustomer:[]
  
};

const appSlice = createSlice({
  name: SLICE_NAME.APP,
  initialState: initialAppState,
  reducers: {
    getErrorInfo: (state, {payload}: PayloadAction<any>) => {
      state.error = payload;
    },
    onSetAppTheme: (state, {payload}: PayloadAction<ThemeType>) => {
      state.theme = payload;
    },
    onLoadApp: state => {
      state.loadingApp = true;
    },
    onLoadAppEnd: state => {
      state.loadingApp = false;
    },
    setShowModal: (state, {payload}: PayloadAction<boolean>) => {
      state.showModal = payload;
    },
    setMainContactAddress: (state, {payload}: PayloadAction<any>) => {
      state.mainContactAddress = payload;
    },
    removeContactAddress: (state, action: PayloadAction<any>) => {
      const updateMainContact = state.mainContactAddress?.filter(
        (item: any) => item != action.payload,
      );
      state.mainContactAddress = updateMainContact;
    },
    removeAddress: (state, action: PayloadAction<any>) => {
      const updateMainAddress = state.mainAddress?.filter(
        (item: any) => item != action.payload,
      );
      state.mainAddress = updateMainAddress;
    },
    setNewCustomer: (state, action: PayloadAction<any>) => {
      if (state.newCustomer.length === 0) {
        state.newCustomer = [action.payload];
      }
      state.newCustomer = [...state.newCustomer, action.payload];
    },
    setShowErrorModalStatus: (state, action: PayloadAction<any>) => {
      state.error = undefined;
      state.showModal = action.payload;
    },
    setSearchProductValue: (state, action: PayloadAction<any>) => {
      state.searchProductValue = action.payload;
    },
    setSearchCustomerValue: (state, action: PayloadAction<any>) => {
      state.searchCustomerValue = action.payload;
    },
    setSearchVisitValue: (state, action: PayloadAction<any>) => {
      state.searchVisitValue = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setProcessingStatus: (state, action: PayloadAction<any>) => {
      state.isProcessing = action.payload;
    },
    setListCustomerType:(state,action:PayloadAction<any>) =>{
      state.listCustomerType = action.payload
    },
    setSystemConfig:(state,action:PayloadAction<any>) => {
      state.systemConfig = action.payload
    },
    setListCustomer:(state,action:PayloadAction<any>) =>{
      state.listCustomer = action.payload
    }
  },
});

const onCheckIn = createAction(
  Actions.CHECKIN,
  ({
    label,
    useName,
    address,
    distance,
    status,
    phone_number,
    lat,
    long,
  }: VisitListItemType) => ({
    payload: {
      label,
      long,
      lat,
      status,
      address,
      useName,
      distance,
      phone_number,
    },
  }),
);
const onGetLost = createAction('LOST', (data: number) => ({
  payload: data,
}));

const onGetSystemConfig = createAction(
  Actions.GET_SYSTEM_CONFIG,
  (data?: any) => ({payload: data}),
);

const onGetCustomer = createAction(Actions.GET_CUSTOMER, (data?: any) => ({
  payload: data,
}));
const onGetCustomerByName = createAction(
  Actions.GET_CUSTOMER_BY_NAME,
  (name: string) => ({payload: name}),
);

const onGetCustomerType = createAction(
  Actions.GET_CUSTOMER_TYPE,
  (data?: any) => ({payload: data}),
);

export const appActions = {
  ...appSlice.actions,
  onCheckIn,
  onGetLost,
  onGetSystemConfig,
  onGetCustomer,
  onGetCustomerByName,
  onGetCustomerType
};

export const appReducer = appSlice.reducer;
export const {
  setError,
  setMainContactAddress,
  setNewCustomer,
  setProcessingStatus,
  setSearchCustomerValue,
  setSearchProductValue,
  setShowErrorModalStatus,
  setSearchVisitValue,
  setShowModal,
  onLoadApp,
  onLoadAppEnd,
  onSetAppTheme,
} = appSlice.actions;
