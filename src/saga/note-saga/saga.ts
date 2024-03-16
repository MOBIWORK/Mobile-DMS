import {PayloadAction} from '@reduxjs/toolkit';
import {noteActions} from '../../redux-store/note-reducer/reducer';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {getNoteCheckin} from '../../services/checkinService';
import {getListNoteApi} from '../../services/appService';
import { CheckinService } from '../../services';
import { dispatch } from '../../utils/redux';

export type ResponseGenerator = {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: any;
  code?: number;
  message?: any;
  exception?: any;
  result?: any;
};

export function* onGetListNote(action: PayloadAction) {
  if (noteActions.oGetListNote.match(action)) {
    try {
      yield put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(getListNoteApi);
      if (response.result?.length > 0) {
        yield put(noteActions.setListNote(response.result));
      }
    } catch (err) {
    } finally {
      yield put(appActions.onLoadAppEnd());
    }
  }
}
export function* onGetListMail(action:PayloadAction){
    if(noteActions.onGetListMail.match(action)){
        try{
            yield put(appActions.onLoadApp())
            const response:ResponseGenerator = yield call(CheckinService.getListStaff)
            if (
                response.message === 'Thành công' ||
                response.result?.data?.length > 0
              ){
                const result = response.result;
                const newData = result.map((item: any) => ({
                  label: item.name,
                  value: item.loai_ghi_chu,
                  isSelected: false,
                }));
                dispatch(noteActions.setListMail(newData))
                
              }
        }catch(err){
            console.log(err,'err')
        }finally{
            yield put(appActions.onLoadAppEnd())
        }
    }
}