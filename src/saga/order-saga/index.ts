
import * as Saga from './saga';
import { orderAction } from '../../redux-store/order-reducer/reducer';
import { takeLatest } from 'typed-redux-saga';

export function* ordersSaga(){
    yield* takeLatest(orderAction.onGetData.type.toString(),Saga.onGetOrders)
    yield* takeLatest(orderAction.onGetDetailData.type.toString(),Saga.onGetDetailOrder)
}