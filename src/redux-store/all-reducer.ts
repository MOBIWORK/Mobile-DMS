import {combineReducers} from '@reduxjs/toolkit';
import {appReducer} from './app-reducer/reducer';
import { customerReducer } from './customer-reducer/reducer';

export const allReducer = combineReducers({
  app: appReducer,
  customer:customerReducer
});

export type RootState = ReturnType<typeof allReducer>;
