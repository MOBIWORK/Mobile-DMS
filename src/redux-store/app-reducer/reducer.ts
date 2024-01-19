import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import * as Actions from './type';
import {IAppRedux, SLICE_NAME} from './type';
import {ThemeType} from '../../layouts/theme';
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
  currentLocation: {},
  systemConfig: {},
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
    onSetCurrentLocation: (state, action: PayloadAction<any>) => {
      state.currentLocation = action.payload;
    },
    setShowModal: (state, {payload}: PayloadAction<boolean>) => {
      state.showModal = payload;
    },
    setMainContactAddress: (state, {payload}: PayloadAction<any>) => {
      state.mainContactAddress = payload;
    },
    setMainAddress: (state, action: PayloadAction<any>) => {
      state.mainAddress = action.payload;
    },
    removeContactAddress: (state, action: PayloadAction<any>) => {
      state.mainContactAddress = state.mainContactAddress?.filter(
        (item: any) => item !== action.payload,
      );
    },
    removeAddress: (state, action: PayloadAction<any>) => {
      state.mainAddress = state.mainAddress?.filter(
        (item: any) => item !== action.payload,
      );
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

    setSystemConfig: (state, action: PayloadAction<any>) => {
      state.systemConfig = action.payload;
    },
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

const onGetSystemConfig = createAction(
  Actions.GET_SYSTEM_CONFIG,
  (data?: any) => ({payload: data}),
);

export const appActions = {
  ...appSlice.actions,
  onCheckIn,
  onGetSystemConfig,
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
  removeContactAddress,
  removeAddress,
} = appSlice.actions;
