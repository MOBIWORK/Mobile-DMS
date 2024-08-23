import {MyAppTheme, ThemeType} from '../../layouts/theme';
import {loadString} from '../../utils/storage';
import {
  appActions,
  onLoadApp,
  onLoadAppEnd,
} from '../../redux-store/app-reducer/reducer';
import {PayloadAction} from '@reduxjs/toolkit';
import {
  createImageCheckinApi,
  DMSConfigMobile,
  getListCity,
  getListDistrict,
  getListWard,
  getSystemConfig,
  postChecking,
} from '../../services/appService';
import {all, call, put} from 'typed-redux-saga';
import {navigate} from '../../navigation/navigation-service';
import {ApiConstant, AppConstant, ScreenConstant} from '../../const';
import {
  categoriesCheckinList,
  IItemCheckIn,
} from '../../redux-store/checkin-reducer/type';
import {checkinActions} from '../../redux-store/checkin-reducer/reducer';
import {CommonUtils} from '../../utils';

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
      // console.log('actionCheckin', action.payload);
      yield put(appActions.setProcessingStatus(true));
      const response: ResponseGenerator = yield call(
        postChecking,
        action.payload,
      );
      if (Object.keys(response?.result).length > 0) {
        CommonUtils.storage.delete(AppConstant.CheckinTime);
        yield put(appActions.setDataCheckIn({}));
        yield put(checkinActions.resetData());
        yield put(checkinActions.setSelectedProgram([]));
        yield put(checkinActions.setListImageSelect([]));
        yield put(checkinActions.setListImageProgram([]));
        yield put(checkinActions.setRefreshVisitWhenCheckOut(true));

        // yield put(checkinActions.setDataCategoriesCheckin([]))
        navigate(ScreenConstant.AUTHORIZED, {
          screen: ScreenConstant.MAIN_TAB,
          params: {
            screen: ScreenConstant.VISIT,
          },
        });
      }
    } catch (err) {
      console.log(err, 'err');
      yield put(appActions.setProcessingStatus(false));
    } finally {
      yield put(appActions.setProcessingStatus(false));
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
      if (response?.status === ApiConstant.STT_OK) {
        // console.log('run get system config');
        const systemData: DMSConfigMobile = response.data.result;
        const newCategoriesCheckin: IItemCheckIn[] = categoriesCheckinList.map(
          item => {
            if (item.key === 'camera' && systemData.batbuoc_chupanh) {
              return {...item, isRequire: true};
            } else if (item.key === 'inventory' && systemData.batbuoc_kiemton) {
              return {...item, isRequire: true};
            } else if (item.key === 'note' && systemData.batbuoc_ghichu) {
              return {...item, isRequire: true};
            } else {
              return {...item, isRequire: false};
            }
          },
        );
        yield put(appActions.setSystemConfig(systemData));
        yield put(
          checkinActions.setDataCategoriesCheckin(newCategoriesCheckin),
        );
      } else {
        console.log('app System err');
      }
    } catch (err) {
      console.error('errSystemConfig: ', err);
    } finally {
      yield put(onLoadAppEnd());
    }
  }
}
export function* onGetListCity(action: PayloadAction) {
  if (appActions.onGetListCity.match(action)) {
    try {
      const response: ResponseGenerator = yield call(
        getListCity,
        action.payload,
      );
      if (response.status === ApiConstant.STT_OK) {
        yield put(appActions.setDataCity(response.data.result));
      }
    } catch (err) {
      console.error('[err]: ', err);
    }
  }
}
export function* onGetListDistrict(action: PayloadAction) {
  if (appActions.onGetListDistrict.match(action)) {
    try {
      const response: ResponseGenerator = yield call(
        getListDistrict,
        action.payload,
      );
      if (response.message === 'Thành công') {
        yield put(appActions.setDataDistrict(response.data));
      }
    } catch (err) {
      console.error('[err]: ', err);
    }
  }
}
export function* onGetListWard(action: PayloadAction) {
  if (appActions.onGetListWard.match(action)) {
    try {
      const response: ResponseGenerator = yield call(
        getListWard,
        action.payload,
      );
      if (response.message === 'Thành công') {
        yield put(appActions.setDataWard(response.data));
      }
    } catch (err) {
      console.error('[err]: ', err);
    }
  }
}

export function* createImageCheckIn(action: PayloadAction) {
  if (appActions.postImageCheckIn.match(action)) {
    try {
      const response: ResponseGenerator = yield call(
        createImageCheckinApi,
        action.payload,
      );

      if (response.result?.status === true) {
        console.log(response, 'response push image');
        yield put(appActions.setListImage([response.result?.file_url]));
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err, 'err saga');
      yield put(appActions.setImageError(action.payload.image));
    } finally {
    }
  }
}
