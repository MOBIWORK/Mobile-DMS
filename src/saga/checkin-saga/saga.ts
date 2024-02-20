import {PayloadAction} from '@reduxjs/toolkit';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {CheckinService} from '../../services';
import {ApiConstant} from '../../const';
import {KeyAbleProps} from '../../models/types';

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
