import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {INote, MailReceiveParams} from './type';
import {SLICE_NAME} from '../app-reducer/type';
import * as Actions from '../app-reducer/type';

const initialState: INote = {
  listMail: [],
  listNote: [],
};
const noteSlice = createSlice({
  name: SLICE_NAME.NOTE_SLICE,
  initialState,
  reducers: {
    setListMail: (state, action: PayloadAction<any>) => {
      state.listMail = action.payload;
    },
    setListNote: (state, action: PayloadAction<any>) => {
      state.listNote = action.payload;
    },
  },
});

const oGetListNote = createAction(Actions.GET_LIST_NOTE);
const onGetListMail = createAction(
  Actions.GET_LIST_MAIL,
  (data: MailReceiveParams) => ({payload: data}),
);
const onGetNoteType = createAction(Actions.GET_NOTE_TYPE);
const onGetListStaff = createAction(Actions.GET_LIST_STAFF);
export const {setListMail, setListNote} = noteSlice.actions;
export const noteActions = {
  ...noteSlice.actions,
  oGetListNote,
  onGetListMail,
  onGetNoteType,
  onGetListStaff,
};
