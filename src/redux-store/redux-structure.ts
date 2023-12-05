export interface IReduxStateCommon {
  isFetching: boolean;
  error: object | null;
}

export const REDUX_STATE: IReduxStateCommon = {
  isFetching: false,
  error: null,
};

export const requestReducerFunc = (state: any) => {
  return {
    ...state,
    isFetching: true,
    error: null,
  };
};

export const successReducerFunc = (state: any, action: any) => {
  const data = action.data || {};
  return {
    ...state,
    isFetching: false,
    error: null,
    ...data,
  };
};

export const failureReducerFunc = (state: any, action: any) => {
  const error = action.error ? action.error : {};
  const data = action.data ? action.data : {};

  return { ...state, isFetching: false, error: error, ...data };
};

export const resetReducerFunc = (initState: any) => initState;

export const setReducerFunc = (state: any, action: any) => {
  const data = action.data || {};
  return {
    ...state,
    ...data,
  };
};
