
import {  configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { allReducer } from './all-reducer';

import { persistStore, persistReducer } from 'redux-persist';
import { reduxPersistStorage } from '../utils/storage';
import { subscribeActionMiddleware } from '../utils/redux/redux-subscribe-action';
import  rootSaga  from './root-saga';



const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxPersistStorage,
    whitelist: ['app'],
    timeout: 1000,
  },
  allReducer,
);

const devMode = __DEV__;
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const storeConfig = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: devMode,
    middleware
    
  });
  sagaMiddleware.run(rootSaga);
  return store;
};

export const store = storeConfig();
export const persistore = persistStore(store);
