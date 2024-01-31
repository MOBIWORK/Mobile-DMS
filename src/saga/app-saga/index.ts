

import { takeLatest } from 'redux-saga/effects';
import { appActions } from '../../redux-store/app-reducer/reducer';

import * as Saga from './saga';
export function* appSaga() {
    yield takeLatest(appActions.onLoadApp.type,Saga.onLoadAppModeAndTheme);
    yield takeLatest(appActions.onCheckIn.type,Saga.onCheckInData);
    yield takeLatest(appActions.onGetSystemConfig.type , Saga.onGetSystemConfiguration)
    yield takeLatest(appActions.onGetListCity.type , Saga.onGetListCity)
    yield takeLatest(appActions.onGetListDistrict.type , Saga.onGetListDistrict)
    yield takeLatest(appActions.onGetListWard.type , Saga.onGetListWard)
    yield takeLatest(appActions.getListNote.type,Saga.onGetListNote)
    yield takeLatest(appActions.postImageCheckIn.type,Saga.createImageCheckIn)
}