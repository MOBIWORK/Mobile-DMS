import {PayloadAction} from '@reduxjs/toolkit';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {CheckinService} from '../../services';
import {ApiConstant} from '../../const';
import {KeyAbleProps} from '../../models/types';
import {ResponseGenerator} from '../app-saga/saga';
import {appActions, setError} from '../../redux-store/app-reducer/reducer';

export function* getDataNote(action: PayloadAction) {
  if (checkinActions.getListNoteCheckin.match(action)) {
    const {data, status}: KeyAbleProps = yield call(
      CheckinService.getNoteCheckin,
      action.payload,
    );
    if (status === ApiConstant.STT_OK) {
      yield put(checkinActions.setData({typeData: 'note', data: data.result}));
    }
  }
}

export function* getDataStaff(action: PayloadAction) {
  if (checkinActions.getListStaff.match(action)) {
    const {data, status}: KeyAbleProps = yield call(
      CheckinService.getListStaff,
      action.payload,
    );
    if (status === ApiConstant.STT_OK) {
      yield put(
        checkinActions.setData({typeData: 'staff', data: data.result.data}),
      );
    }
  }
}

export function* getDataNoteType(action: PayloadAction) {
  if (checkinActions.getListNoteType.match(action)) {
    const {data, status}: KeyAbleProps = yield call(CheckinService.getNoteType);
    if (status === ApiConstant.STT_OK) {
      yield put(
        checkinActions.setData({typeData: 'note_type', data: data.result}),
      );
    }
  }
}
export function* getListProgramData(action: PayloadAction) {
  if (checkinActions.getListProgram.match(action)) {
    try {
      yield put(appActions.onLoadApp())
      const response: ResponseGenerator = yield call(
        CheckinService.getListProgram,
        action.payload,
      );
      if (response?.message === 'ok') {
        yield put(checkinActions.setDataListProgram(response.result?.data));
      } else {
        setError({
          title: null,
          message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          viewOnly: true,
        });
      }
    } catch (err) {
      console.log('err: ', err);
    }finally{
      yield put(appActions.onLoadAppEnd())
    }
  }
}
export function* postImageScore(action:PayloadAction){
  if(checkinActions.postImageScore.match(action)){
    try{
      console.log(action.payload,'payload send')
      const response:ResponseGenerator = yield call(CheckinService.postImagePictureScore,action.payload as any)
      if(response.message === 'ok' && Object.keys(response.result).length > 0){
        yield put(checkinActions.setImageResponse(response.result.file_url))
      
      }else{
        // yield put(checkinActions.setImageError([action.payload]))
      }
    }catch(err){
      console.log('err:',err)
    }finally{

    }
  }
}
