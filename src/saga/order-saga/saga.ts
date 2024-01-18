import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { all, call, put } from 'typed-redux-saga';
import { orderAction } from '../../redux-store/order-reducer/reducer';
import { OrderService } from '../../services';
import { KeyAbleProps } from '../../models/types';
import { ApiConstant } from '../../const';
import { PramsTypeOrder, get } from '../../services/orderService';

export type ResponseGenerator = {
    config?: any;
    data?: any;
    headers?: any;
    request?: any;
    status?: any;
    code?: number;
    message?: any;
    exception?: any;
    result?: any;
};

export function* onGetOrders(action: PayloadAction) {
    if (orderAction.onGetData.match(action)) {
        try {
            const { status, data }: KeyAbleProps = yield call(OrderService.get, action.payload);
            yield put(orderAction.setLoading())
            if (status === ApiConstant.STT_OK) {
                yield put(orderAction.setData({ data: data.result?.data, totalItem: data.result.total }));
            }
        } catch (err: any) {
            yield put(orderAction.setMessage(err.message));
        }
    }

}

export function* onGetDetailOrder(action: PayloadAction<string>) {
    if (orderAction.onGetDetailData.match(action)) {
        try {
            const {status ,data} : KeyAbleProps = yield call(OrderService.getDetail,action.payload)
            yield put(orderAction.setLoading())
            if(status === ApiConstant.STT_OK){
                yield put(orderAction.setItemData(data.result))
            }
        } catch (error : any) {
            yield put(orderAction.setMessage(error.message));
        }
    }
}