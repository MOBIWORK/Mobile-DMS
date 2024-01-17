import {combineReducers} from '@reduxjs/toolkit';
import {appReducer} from './app-reducer/reducer';
import { orderReducer } from './order-reducer/reducer';

export const allReducer = combineReducers({
  app: appReducer,
  order : orderReducer
});

export type RootState = ReturnType<typeof allReducer>;
