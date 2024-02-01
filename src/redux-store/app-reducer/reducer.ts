import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import * as Actions from './type';
import {IAppRedux, SLICE_NAME} from './type';
import {ThemeType} from '../../layouts/theme';
import {CheckinData} from '../../services/appService';

const initialAppState: IAppRedux = {
  error: undefined,
  isProcessing: false,
  showModal: false,
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
  listDataCity: {
    city: [],
    district: [],
    ward: [],
  },
  dataCheckIn: {},
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
    setDataCity: (state, action: PayloadAction<any>) => {
      state.listDataCity.city = action.payload;
    },
    setDataDistrict: (state, action: PayloadAction<any>) => {
      state.listDataCity.district = action.payload;
    },
    setDataWard: (state, action: PayloadAction<any>) => {
      state.listDataCity.ward = action.payload;
    },
    setDataCheckIn: (state, action: PayloadAction<any>) => {
      state.dataCheckIn = action.payload;
    },
    setListNote: (state, action: PayloadAction<any>) =>
      void (state.dataCheckIn.listNote = action.payload),
      setListImage:(state,action:PayloadAction<any>) =>{
        state.dataCheckIn.listImage = action.payload
      }
  },
 
});

const onCheckIn = createAction(Actions.CHECKIN, (data: CheckinData) => ({
  payload: data,
}));

const onGetSystemConfig = createAction(
  Actions.GET_SYSTEM_CONFIG,
  (data?: any) => ({payload: data}),
);

const onGetListTerritory = createAction(
  Actions.GET_LIST_TERRITORY,
  (data?: any) => ({payload: data}),
);

const onGetListCity = createAction(Actions.GET_LIST_CITY, (data?: any) => ({
  payload: data,
}));
const onGetListDistrict = createAction(
  Actions.GET_LIST_DISTRICT,
  (ma_tinh_thanh: any) => ({payload: ma_tinh_thanh}),
);
const onGetListWard = createAction(
  Actions.GET_LIST_WARD,
  (ma_quan_huyen: any) => ({payload: ma_quan_huyen}),
);
const getListNote = createAction(Actions.GET_LIST_NOTE, (data?: any) => ({
  payload: data,
}));
const  postImageCheckIn = createAction(Actions.PUT_IMAGE_CHECKIN,(data:any) => ({payload:data}))


export const appActions = {
  ...appSlice.actions,
  onCheckIn,
  onGetSystemConfig,
  onGetListTerritory,
  onGetListCity,
  onGetListDistrict,
  onGetListWard,
  getListNote,
  postImageCheckIn
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
