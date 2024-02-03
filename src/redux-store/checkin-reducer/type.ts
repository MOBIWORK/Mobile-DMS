import { CheckinOrderDetail, NoteType, StaffType } from "../../models/types";


export const SLICE_NAME = "CHECKIN_SLICE";

export type TypeState = {
    dataNote : NoteType[],
    dataStaff  : StaffType[],
    dataTypeNote : any[],
    orderDetail : CheckinOrderDetail | null
}

export const GET_NOTE_ACTIONS = "GET_NOTE_ACTIONS";
export const GET_STAFF_ACTIONS = "GET_STAFF_ACTIONS";
export const GET_NOTETYPE_ACTIONS = "GET_STAFF_ACTIONS";