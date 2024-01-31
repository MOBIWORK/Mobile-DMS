// import { all } from "redux-saga/effects";
import {appSaga} from '../saga/app-saga/';
import { all } from 'redux-saga/effects'
import { customerSaga } from '../saga/customer-saga';
import { ordersSaga } from '../saga/order-saga';
import { productSaga } from '../saga/product-saga';
import { checkinSaga } from '../saga/checkin-sage';
import { fork } from 'typed-redux-saga';


export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(customerSaga),
    fork(ordersSaga),
    fork(productSaga),
    fork(checkinSaga)
  ]);
}
