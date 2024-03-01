import { takeLatest } from "typed-redux-saga";
import { noteActions } from "../../redux-store/note-reducer/reducer";
import * as Saga from './saga'

export function* noteSaga(){
    yield* takeLatest(noteActions.oGetListNote.type.toString(),Saga.onGetListNote)
}