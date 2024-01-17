import {MyAppTheme, ThemeType} from '../../layouts/theme';
import {loadString} from '../../utils/storage';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
  setNewCustomer,
} from '../../redux-store/app-reducer/reducer';
import {PayloadAction} from '@reduxjs/toolkit/dist/createAction';
import {
  getCustomer,
  getCustomerType,
  getSystemConfig,
  postChecking,
} from '../../services/appService';
import {all, call, put} from 'typed-redux-saga';
import {showSnack} from '../../components/common';

export const checkKeyInObject = (T: any, key: string) => {
  return Object.keys(T).includes(key);
};

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

export function* onLoadAppModeAndTheme() {
  const {appTheme} = yield* all({
    appTheme: call(loadString, 'APP_THEME'),
  });

  if (typeof appTheme === 'string' && checkKeyInObject(MyAppTheme, appTheme)) {
    yield* put(appActions.onSetAppTheme(appTheme as ThemeType));
  }
  yield* put(appActions.onLoadAppEnd());
}

export function* onCheckInData(action: PayloadAction) {
  if (appActions.onCheckIn.match(action)) {
    try {
      // yield put(appActions.onLoadApp())
      console.log(action.payload, 'payload saga');
      const response: any = yield* call(postChecking, action.payload);
    } catch (err) {
      console.log(err, 'err');
    } finally {
      // yield put(appActions.onLoadAppEnd())
    }
  }
}

export function* onGetSystemConfiguration(action: PayloadAction) {
  if (appActions.onGetSystemConfig.match(action)) {
    try {
      yield put(onLoadApp());
      const response: ResponseGenerator = yield call(
        getSystemConfig,
        action.payload,
      );
      if (response.message === 'Thành công') {
        yield put(appActions.setSystemConfig(response.result));
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
