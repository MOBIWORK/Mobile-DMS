import {MyAppTheme, ThemeType} from '../../layouts/theme';
import {loadString} from '../../utils/storage';
import {all, call, put} from '../../utils/typed-redux-saga';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {PayloadAction} from '@reduxjs/toolkit/dist/createAction';
import { postChecking } from '../../services/appService';

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
  messages?: string;
  classList?: any;
  exception?: any;
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
export function* onLost(action:PayloadAction){
  console.log(action.payload)
}

export function* onCheckInData(action:PayloadAction){

  console.log(action,'actions saga')
    if(appActions.onCheckIn.match(action)){
      console.log('run saga')
      try{
        // yield put(appActions.onLoadApp())
        console.log(action.payload)
        const response:any = yield* call(postChecking,action.payload)
        console.log(response,'repsonse saga ')
       

      }catch(err){
        console.log(err,'err')

      }finally{
        // yield put(appActions.onLoadAppEnd())
      }
    }
    console.log('test')
}