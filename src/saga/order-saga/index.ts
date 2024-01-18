import { takeLatest } from 'typed-redux-saga';
import * as Saga from './saga';
import { orderAction } from '../../redux-store/order-reducer/reducer';

export function* ordersSaga(){
    yield takeLatest(orderAction.onGetData.type,Saga.onGetOrders)
    yield takeLatest(orderAction.onGetDetailData.type,Saga.onGetDetailOrder)
}