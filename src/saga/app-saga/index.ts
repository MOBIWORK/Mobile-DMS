import {takeEvery, takeLatest, takeLeading} from 'typed-redux-saga';
import {appActions} from '../../redux-store/app-reducer/reducer';

import * as Saga from './saga';
export function* appSaga() {
  yield* takeLatest(
    appActions.onLoadApp.type.toString(),
    Saga.onLoadAppModeAndTheme,
  );
  yield* takeLatest(appActions.onCheckIn.type.toString(), Saga.onCheckInData);
  yield* takeLatest(
    appActions.onGetSystemConfig.type.toString(),
    Saga.onGetSystemConfiguration,
  );
  yield* takeLatest(
    appActions.onGetListCity.type.toString(),
    Saga.onGetListCity,
  );
  yield* takeLatest(
    appActions.onGetListDistrict.type.toString(),
    Saga.onGetListDistrict,
  );
  yield* takeLatest(
    appActions.onGetListWard.type.toString(),
    Saga.onGetListWard,
  );
  yield* takeLatest(
    appActions.postImageCheckIn.type.toString(),
    Saga.createImageCheckIn,
  );
}
