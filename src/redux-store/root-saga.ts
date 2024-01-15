// import { all } from "redux-saga/effects";
import { appSaga } from "../saga/app-saga/";
import { all } from "../utils/typed-redux-saga";





export default function* rootSaga() {
  yield* all([appSaga()]);
};
