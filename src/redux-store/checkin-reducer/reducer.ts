import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { TypeState ,categoriesCheckinList} from "./type";
import * as Actions from "./type"
import { SLICE_NAME } from "../app-reducer/type";



const initState : TypeState = {
    dataNote : [],
    dataStaff : [],
    dataTypeNote : [],
    orderDetail : null,
    returnOrderDetail : null,
    categoriesCheckin :categoriesCheckinList
}

const checkinSlice = createSlice({
    name : SLICE_NAME.CHECKIN_SLICE,
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
                case "returnOrder":
                    state.returnOrderDetail = action.payload.data;
                    break;
                default:
                    break;
            }
        },
        resetData : (state , action : PayloadAction)=>{
            state.categoriesCheckin = categoriesCheckinList;
            state.dataNote = [];
            state.orderDetail = null
        },
        setDataCategoriesCheckin : (state,action : PayloadAction<Actions.IItemCheckIn[]>) =>{
            state.categoriesCheckin = action.payload
        }
    }
});

const getListNoteCheckin = createAction(
  Actions.GET_NOTE_ACTIONS,
  (customer_checkin_id: any) => ({payload: customer_checkin_id}),
);
const getListStaff = createAction(Actions.GET_STAFF_ACTIONS, (params: any) => ({
  payload: params,
}));
const getListNoteType = createAction(Actions.GET_NOTE_TYPE_ACTIONS);

export const checkinActions = {
  ...checkinSlice.actions,
  getListNoteCheckin,
  getListStaff,
  getListNoteType,
};

export const checkinReducer = checkinSlice.reducer;
