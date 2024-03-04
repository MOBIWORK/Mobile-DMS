import {PayloadAction, createAction, createSlice} from '@reduxjs/toolkit';
import {TypeState, categoriesCheckinList} from './type';
import * as Actions from './type';
import {SLICE_NAME} from '../app-reducer/type';

const initState: TypeState = {
  dataNote: [],
  dataStaff: [],
  dataTypeNote: [],
  orderDetail: null,
  categoriesCheckin: categoriesCheckinList,
  listProgramCampaign: {},
};

const checkinSlice = createSlice({
  name: SLICE_NAME.CHECKIN_SLICE,
  initialState: initState,
  reducers: {
    setData: (state, action: PayloadAction<{typeData: string; data: any}>) => {
      switch (action.payload.typeData) {
        case 'note':
          void (state.dataNote = action.payload.data);
          break;
        case 'staff':
          void (state.dataStaff = action.payload.data);
          break;
        case 'note_type':
          void (state.dataTypeNote = action.payload.data);
          break;
        case 'detailOrder':
          state.orderDetail = action.payload.data;
          break;
        default:
          break;
      }
    },
    resetData: (state, action: PayloadAction) => {
      state.categoriesCheckin = categoriesCheckinList;
      state.dataNote = [];
      state.orderDetail = null;
    },
    setDataCategoriesCheckin: (
      state,
      action: PayloadAction<Actions.IItemCheckIn[]>,
    ) => {
      state.categoriesCheckin = action.payload;
    },
    setDataListProgram: (state, action: PayloadAction<any>) => {
      void (state.listProgramCampaign = action.payload);
    },
  },
});

const getListNoteCheckin = createAction(
  Actions.GET_NOTE_ACTIONS,
  (customer_checkin_id: any) => ({payload: customer_checkin_id}),
);
const getListStaff = createAction(Actions.GET_STAFF_ACTIONS, (params: any) => ({
  payload: params,
}));
const getListNoteType = createAction(Actions.GET_NOTE_TYPE_ACTIONS);
const getListProgram = createAction(
  Actions.GET_LIST_PROGRAM_CAMPAIGN,
  ({customer_name, e_code}: {customer_name: string; e_code: string}) => ({
    payload: {customer_name, e_code},
  }),
);

export const checkinActions = {
  ...checkinSlice.actions,
  getListNoteCheckin,
  getListStaff,
  getListNoteType,
  getListProgram,
};

export const checkinReducer = checkinSlice.reducer;
