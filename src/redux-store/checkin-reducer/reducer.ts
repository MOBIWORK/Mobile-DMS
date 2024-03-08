import {PayloadAction, createAction, createSlice} from '@reduxjs/toolkit';
import {TypeState, categoriesCheckinList} from './type';
import * as Actions from './type';
import {SLICE_NAME} from '../app-reducer/type';
import {Platform} from 'react-native';

const initState: TypeState = {
  dataNote: [],
  dataStaff: [],
  dataTypeNote: [],
  orderDetail: null,
  categoriesCheckin: categoriesCheckinList,
  returnOrderDetail: {},
  listProgramCampaign: {},
  selectedProgram: {},
  listImageSelect: [],
  imageToMark: [],
  listProgramImage: [],
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
        case 'returnOrder':
          state.returnOrderDetail = action.payload.data;
          break;
        default:
          break;
      }
    },
    resetData: state => {
      void (state.categoriesCheckin = categoriesCheckinList);
      void (state.dataNote = []);
      void (state.orderDetail = null);
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
    setSelectedProgram: (state, action: PayloadAction<any>) => {
      state.selectedProgram = [];
      const newPrograms = action.payload;
      const existingProgramNames = state.selectedProgram.map(
        (program: any) => program.campaign_name,
      );

      // @ts-ignore
      const updatedPrograms = newPrograms.map((newProgram: any) => {
        const index = existingProgramNames.indexOf(newProgram.campaign_name);
        if (index !== -1) {
          // Update existing program if name matches
          return newProgram;
        } else {
          // Add new program if name doesn't exist
          return newProgram;
        }
      });

      // Filter out existing programs that are being updated

      // Merge updated programs with existing ones
      state.selectedProgram = [...state.selectedProgram, ...updatedPrograms];
    },

    setListImageSelect: (state, action: PayloadAction<any>) => {
      // state.listImageSelect = [];
      state.listImageSelect = [...state.listImageSelect, ...action.payload];
    },
    setImageResponse: (state, action: PayloadAction<any>) => {
      if (Platform.OS === 'android') {
        state.imageToMark = [];
      }
     
      state.imageToMark = [...state.imageToMark, action.payload];
    },
    setListImageProgram: (state, action: PayloadAction<any>) => {
      state.listImageSelect = [...state.listImageSelect, action.payload];
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
  ({customer_code, e_name}: {customer_code: string; e_name: string}) => ({
    payload: {customer_code, e_name},
  }),
);
const postImageScore = createAction(Actions.POST_IMAGE_SCORE, (data: any) => ({
  payload: data,
}));

const createReportMarkScore = createAction(
  Actions.CREATE_REPORT_MARK_SCORE,
  (data: Actions.DataSendMarkScore) => ({payload: data}),
);

export const checkinActions = {
  ...checkinSlice.actions,
  getListNoteCheckin,
  getListStaff,
  getListNoteType,
  getListProgram,
  postImageScore,
  createReportMarkScore,
};

export const checkinReducer = checkinSlice.reducer;
