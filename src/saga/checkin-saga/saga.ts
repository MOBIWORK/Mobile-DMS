import {PayloadAction} from '@reduxjs/toolkit';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {CheckinService} from '../../services';
import {ApiConstant, ScreenConstant} from '../../const';
import {KeyAbleProps} from '../../models/types';
import {ResponseGenerator} from '../app-saga/saga';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
  setError,
} from '../../redux-store/app-reducer/reducer';
import {goBack, navigate, pop} from '../../navigation/navigation-service';

export function* getDataNote(action: PayloadAction) {
  if (checkinActions.getListNoteCheckin.match(action)) {
    const {data, status}: KeyAbleProps = yield call(
      CheckinService.getNoteCheckin,
      action.payload,
    );
    if (status === ApiConstant.STT_OK) {
      yield put(
        checkinActions.setData({typeData: 'note', data: data.result.data}),
      );
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
      if (response?.message === 'ok') {
        yield put(checkinActions.setDataListProgram(response.result?.data));
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
      const response: ResponseGenerator = yield call(
        CheckinService.createReportMarkingApi,
        action.payload.data,
      );
      if (response.message === 'ok') {
        navigate(ScreenConstant.CHECKIN, {
          item: action.payload.screen,
          isLocation: true,
        });
      }
    } catch (err) {
      console.log('[err: ]', err);
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
