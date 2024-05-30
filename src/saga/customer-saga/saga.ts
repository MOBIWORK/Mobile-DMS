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
  getPageCustomer,
} from '../../services/appService';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
} from '../../redux-store/app-reducer/reducer';
import {PayloadAction} from '@reduxjs/toolkit';
import {call, put} from 'typed-redux-saga';

import {CustomerService} from '../../services';
import {ApiConstant, ScreenConstant} from '../../const';
import {goBack, navigate} from '../../navigation/navigation-service';
import {updateCustomer} from '../../services/customerService';
import {showSnack} from '../../components/common';

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
  if (customerActions.onGetCustomer.match(action)) {
    try {
      yield put(onLoadApp());
      const response: ResponseGenerator = yield call(getCustomer);
      if (Object.keys(response.result).length > 0) {
        yield put(setCustomer(response.result));
      }
    } catch (err) {
      console.log('errCustomer: ', err);
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
      if (response.message === 'Thành công') {
        yield put(setListCustomerType(response.result));
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

export function* addingNewCustomer(action: PayloadAction) {
  if (customerActions.addingCustomer.match(action)) {
    try {
      yield* put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        CustomerService.addNewCustomer,
        action.payload,
      );
      if (response?.status === ApiConstant.STT_OK) {
        navigate(ScreenConstant.MAIN_TAB, {
          screen: ScreenConstant.CUSTOMER,
        });
      }
    } catch (err) {
    } finally {
      yield* put(appActions.onLoadAppEnd());
    }
  }
}
export function* getCustomerTerritorySaga(action: PayloadAction) {
  if (customerActions.getCustomerTerritory.match(action)) {
    try {
      yield* put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        CustomerService.getCustomerTerritory,
        action.payload,
      );
      if (response.result?.length > 0) {
        yield* put(customerActions.setListCustomerTerritory(response.result));
      }
    } catch (err) {
    } finally {
      yield* put(appActions.onLoadAppEnd());
    }
  }
}
export function* getMoreDataCustomer(action: PayloadAction) {
  if (customerActions.getCustomerNewPage.match(action)) {
    try {
      yield put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        getPageCustomer,
        action.payload,
      );
      console.log('response new page', response);
      if (response.message === 'Thành công') {
        yield put(customerActions.addingListCustomer(response.result?.data));
        yield put(customerActions.setPage(response.result?.page_number));
      }
    } catch (err) {
      console.log(err, 'error');
    } finally {
      yield put(appActions.onLoadAppEnd());
    }
  }
}

export function* updateCustomerSaga(action: PayloadAction) {
  if (customerActions.updateCustomerAction.match(action)) {
    try {
      yield put(appActions.onLoadApp());
      console.log(action.payload)
      const response: ResponseGenerator = yield call(
        updateCustomer,
        action.payload,
      );
      console.log(response, 'response update customer');
      if (response.message === 'OK') {
        showSnack({
          msg: 'Cập nhật thành công',
          interval: 2000,
          type: 'success',
        });
        goBack()
      }
    } catch (err) {
      console.log('run error');
      console.error(err, 'err');
    } finally {
      yield put(appActions.onLoadAppEnd());
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
