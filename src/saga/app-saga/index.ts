

import { takeLatest } from 'redux-saga/effects';
import { appActions } from '../../redux-store/app-reducer/reducer';

import * as Saga from './saga';
export function* appSaga() {
    yield takeLatest(appActions.onLoadApp.type,Saga.onLoadAppModeAndTheme);
    yield takeLatest(appActions.onCheckIn.type,Saga.onCheckInData);
    yield takeLatest(appActions.onGetCustomer.type,Saga.onGetCustomer);
    yield takeLatest(appActions.onGetCustomerType.type,Saga.onGetCustomerType);
    yield takeLatest(appActions.onGetSystemConfig.type , Saga.onGetSystemConfiguration)   
}