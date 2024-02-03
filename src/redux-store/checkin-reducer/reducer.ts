import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { SLICE_NAME,TypeState } from "./type";
import * as Actions from "./type"



const initState : TypeState = {
    dataNote : [],
    dataStaff : [],
    dataTypeNote : [],
    orderDetail : null,
}

const checkinSlice = createSlice({
    name : SLICE_NAME,
    initialState : initState,
    reducers : {
        setData : (state , action : PayloadAction<{typeData : string , data :any}>) => {
            switch (action.payload.typeData) {
                case "note":
                    void(state.dataNote = action.payload.data);
                    break;
                case "staff":
                    void(state.dataStaff = action.payload.data);
                    break;
                case "note_type":
                    void(state.dataTypeNote = action.payload.data);
                    break;
                case "detailOrder":
                    state.orderDetail = action.payload.data;
                    break;
                default:
                    break;
            }
        },
        resetData : (state , action : PayloadAction)=>{
            state = initState
        }
    }
});

const getListNoteCheckin = createAction(Actions.GET_NOTE_ACTIONS , (params :any) => ({payload : params}));
const getListStaff = createAction(Actions.GET_STAFF_ACTIONS , (params :any) => ({payload : params}));
const getListNoteType = createAction(Actions.GET_NOTE_TYPE_ACTIONS , () => ({payload : null}));

export const checkinActions = {
    ...checkinSlice.actions,
    getListNoteCheckin,
    getListStaff,
    getListNoteType
}

export const checkinReducer =  checkinSlice.reducer;