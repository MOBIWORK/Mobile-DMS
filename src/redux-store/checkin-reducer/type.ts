import { NoteType, StaffType } from "../../models/types";


export const SLICE_NAME = "CHECKIN_SLICE";

export type TypeState = {
    dataNote : NoteType[],
    dataStaff  : StaffType[],
    dataTypeNote : any[]
}

export const GET_NOTE_ACTIONS = "GET_NOTE_ACTIONS";
export const GET_STAFF_ACTIONS = "GET_STAFF_ACTIONS";
export const GET_NOTE_TYPE_ACTIONS = "GET_NOTE_TYPE_ACTIONS";