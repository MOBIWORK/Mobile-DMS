// import { all } from "redux-saga/effects";
import {appSaga} from '../saga/app-saga/';
import { all } from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([appSaga()]);
}
