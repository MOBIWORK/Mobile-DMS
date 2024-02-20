import {showSnack} from '../../components/common';
import {
  customerActions,
  setCustomer,
  setCustomerVisit,
  setListCustomerType,
} from '../../redux-store/customer-reducer/reducer';
import {
  getCustomer,
  getCustomerType,
  getCustomerVisit,
} from '../../services/appService';
import {onLoadApp, onLoadAppEnd} from '../../redux-store/app-reducer/reducer';
import {PayloadAction} from '@reduxjs/toolkit';
import {call, put} from 'typed-redux-saga';
import {getCustomerRoute} from '../../services/customerService';

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

export function* onGetCustomer(action: PayloadAction) {
  console.log('run 0');
  if (customerActions.onGetCustomer.match(action)) {
    try {
      yield put(onLoadApp());
      console.log('run 1');
      const response: ResponseGenerator = yield call(getCustomer);
      console.log(response, 'response customer');
      if (response.message === 'ok') {
        yield put(setCustomer(response.result?.data));
      }
    } catch (err) {
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
export function* onGetCustomerType(action: PayloadAction) {
  if (customerActions.getCustomerType.match(action)) {
    try {
      yield put(onLoadApp());
      const response: ResponseGenerator = yield call(getCustomerType);
      console.log(response, 'response customer type');
      if (response.message === 'Thành công') {
        yield put(setListCustomerType(response.result));
      } else {
        showSnack({
          msg: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          interval: 2000,
          type: 'error',
        });
      }
    } catch (err) {
      console.error('err: ', err);
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
export function* getCustomerVisitSaga(action: PayloadAction) {
  if (customerActions.onGetCustomerVisit.match(action)) {
    try {
      const response: ResponseGenerator = yield call(getCustomerVisit);
      console.log(response, 'response visit');
      if (Object.keys(response.result?.length > 0)) {
        yield put(setCustomerVisit(response.result.data));
      }
    } catch (err) {
      console.error('error: ', err);
    }
  }
}

// export function* onGetCustomerByName(action:PayloadAction){
//   if(customerActions.onGetCustomerByName.match(action)){
//     try{
//         const response:ResponseGenerator = yield call(getCustomerByName,action.payload)
//         if(response.message != '' || response.message != undefined}{
//           yield put(customerActions.setCustomer())
//         }

//     }catch{

//     }
//   }
// }
