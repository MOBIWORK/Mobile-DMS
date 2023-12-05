import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
// import rootSaga from 'sagas';

import {
  Creators as AppActions,
  Types as AppTypes,
  reducer as AppReducer,
  Selector as AppSelector,
  IAppRedux,
} from './app.redux';

/* ------------- Assemble The Reducers ------------- */
const appReducer = combineReducers({
  appRedux: AppReducer,
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

/* ------------- Redux Configuration ------------- */

/* ------------- Saga Middleware ------------- */
const sagaMiddleware = createSagaMiddleware();

// Create store
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// kick off root saga
// sagaMiddleware.run(rootSaga);

interface IAppReduxState {
  appRedux: IAppRedux;
}

/* ------------- Redux Actions ------------- */
export {AppActions, AppTypes, AppSelector};
export type {IAppReduxState};

export default store;
