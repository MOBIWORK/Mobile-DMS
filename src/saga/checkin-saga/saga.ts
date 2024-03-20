import {PayloadAction} from '@reduxjs/toolkit';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {CheckinService} from '../../services';
import {ApiConstant} from '../../const';
import {KeyAbleProps} from '../../models/types';
import {ResponseGenerator} from '../app-saga/saga';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
  setError,
} from '../../redux-store/app-reducer/reducer';

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
      yield put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        CheckinService.getListProgram,
        action.payload,
      );
      console.log(response, 'response campaign');
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
    } finally {
      yield put(appActions.onLoadAppEnd());
    }
  }
}
export function* postImageScore(action: PayloadAction) {
  if (checkinActions.postImageScore.match(action)) {
    try {
      let listProgram: any[] = [...action.payload.listProgram];
      const response: ResponseGenerator = yield call(
        CheckinService.postImagePictureScore,
        action.payload.data as any,
      );
      if (response.message === 'ok') {
        const list = listProgram?.map((item: any) => {
          return {
            item,
            image: [
              ...(item.image || []),
              ...(response.result ? [response.result] : []),
            ],
          };
        });

        yield put(checkinActions.setImageResponse(list));
      } else {
        // yield put(checkinActions.setImageError([action.payload]))
      }
    } catch (err) {
      console.log('err:', err);
    } finally {
    }
  }
}

export function* createReportMarkScoreSaga(action: PayloadAction) {
  if (checkinActions.createReportMarkScore.match(action)) {
    try {
      yield put(onLoadApp());
      yield call(CheckinService.createReportMarkingApi, action.payload);
    } catch (err) {
      console.log('[err: ]', err);
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
