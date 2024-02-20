import {CheckinOrderDetail, NoteType, StaffType} from '../../models/types';

export type TypeState = {
  dataNote: NoteType[];
  dataStaff: StaffType[];
  dataTypeNote: any[];
  orderDetail: CheckinOrderDetail | null;
};

export enum Action {
  GET_NOTE = 'GET_NOTE_',
  GET_STAFF = 'GET_STAFF_',
  GET_NOTE_TYPE = 'GET_NOTE_TYPE_',
}

export const GET_NOTE_ACTIONS = Action.GET_NOTE + 'GET_NOTE';
export const GET_STAFF_ACTIONS = Action.GET_STAFF + 'GET_STAFF';
export const GET_NOTE_TYPE_ACTIONS =Action.GET_NOTE_TYPE + 'GET_NOTE_TYPE';
