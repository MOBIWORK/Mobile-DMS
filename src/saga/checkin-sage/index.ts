import { takeEvery, takeLatest } from "typed-redux-saga"
import * as Saga from "./saga"
import { checkinActions } from "../../redux-store/checkin-reducer/reducer"

export function* checkinSaga(){
    yield takeLatest(checkinActions.getListNoteCheckin.type, Saga.getDataNote);
    yield takeLatest(checkinActions.getListStaff.type, Saga.getDataStaff);
    yield takeLatest(checkinActions.getListNoteType.type, Saga.getDataNoteType);
}