// import { all } from "redux-saga/effects";
import {appSaga} from '../saga/app-saga/';
import { all } from 'redux-saga/effects'
import { customerSaga } from '../saga/customer-saga';

export default function* rootSaga() {
  yield all([appSaga(),customerSaga()]);
}
