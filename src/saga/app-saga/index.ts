

import { takeLatest } from 'redux-saga/effects';
import { appActions } from '../../redux-store/app-reducer/reducer';

import * as Saga from './saga';
export function* appSaga() {
    yield takeLatest(appActions.onLoadApp.type,Saga.onLoadAppModeAndTheme);
    yield takeLatest(appActions.onCheckIn.type,Saga.onCheckInData)
    yield takeLatest(appActions.onGetLost.type, Saga.onLost);
}