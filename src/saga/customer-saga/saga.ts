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
import data from '../../../node_modules/ansi-escapes/node_modules/type-fest/source/readonly-deep.d';
import {Keyboard} from 'react-native';

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
      yield put(appActions.setProcessingStatus(true));
      const response: ResponseGenerator = yield call(
        getCustomer,
        action.payload,
      );

      if (response?.status === ApiConstant.STT_OK) {
        yield put(setCustomer(response.data.result));
      }
    } catch (err) {
      console.log('errCustomer: ', err);
      yield put(appActions.setProcessingStatus(false));
    } finally {
      yield put(onLoadAppEnd());
      yield put(appActions.setProcessingStatus(false));
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
      console.error('errCustomerType: ', err);
      yield put(onLoadAppEnd());
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
export function* getCustomerVisitSaga(action: PayloadAction) {
  if (customerActions.onGetCustomerVisit.match(action)) {
    try {
      const response: ResponseGenerator = yield call(getCustomerVisit);
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
      console.log('params', action.payload);
      yield put(appActions.onLoadApp());
      yield put(appActions.setProcessingStatus(true));
      const response: ResponseGenerator = yield call(
        getPageCustomer,
        action.payload,
      );
      if (response.message === 'Thành công') {
        yield put(customerActions.addingListCustomer(response.result?.data));
        yield put(customerActions.setPage(response.result?.page_number));
      }
    } catch (err) {
      console.log(err, 'error');
      yield put(appActions.setProcessingStatus(false));
    } finally {
      yield put(appActions.onLoadAppEnd());
      yield put(appActions.setProcessingStatus(false));
    }
  }
}

export function* updateCustomerSaga(action: PayloadAction) {
  if (customerActions.updateCustomerAction.match(action)) {
    try {
      console.log(action.payload.data, 'payload send');
      // yield put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        updateCustomer,
        action.payload.data,
      );
      // if (response.message === 'ok') {
      //   Keyboard.dismiss();
      // }
    } catch (err) {
      console.log('run error');
      console.error(err, 'err');
    } finally {
      yield put(appActions.onLoadAppEnd());
      Keyboard.dismiss();
      // goBack()
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
