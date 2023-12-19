import { ThemeType } from '../layouts/theme';
import {KeyAbleProps} from '../models/types';
import {IAppReduxState} from './index';
import {createReducer, createActions} from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */
export const {Types, Creators} = createActions({
  setProcessingStatus: ['data'],
  setError: ['data'],
  resetApp: [],
  failure: ['error', 'status'],
  setShowErrorModalStatus: ['data'],
  setOrganizationBaseURL: ['data'],
  setSearchProductValue: ['data'],
  setSearchVisitValue: ['data'],
});

/* ------------- Initial State ------------- */
export interface IAppRedux {
  error?: {
    title: string;
    message: string;
    viewOnly?: boolean;
    status?: number;
  };
  isProcessing: boolean;
  showModal: boolean;
  searchProductValue: string;
  theme:ThemeType
  searchVisitValue: string;
}

export const INITIAL_STATE: IAppRedux = {
  error: undefined,
  isProcessing: false,
  showModal: true,
  searchProductValue: '',
  theme:'default',
  searchVisitValue: '',
};

/* ------------- Selector ------------- */
export const Selector = {
  // Get error message
  getErrorInfo: (state: IAppReduxState) => state.appRedux.error,
  getProcessingStatus: (state: IAppReduxState) => state.appRedux.isProcessing,
  getShowModal: (state: IAppReduxState) => state.appRedux.showModal,
  getSearchProductValue: (state: IAppReduxState) =>
    state.appRedux.searchProductValue,
  getTheme:(state: IAppReduxState) => state.appRedux.theme,
  getSearchVisitValue: (state: IAppReduxState) =>
    state.appRedux.searchVisitValue,
};

/* ------------- Reducers ------------- */
const setError = (state = INITIAL_STATE, action: KeyAbleProps) => ({
  ...state,
  error: action.data,
});

const setProcessingStatus = (state = INITIAL_STATE, action: KeyAbleProps) => ({
  ...state,
  isProcessing: action.data,
});

const setShowErrorModalStatus = (
  state = INITIAL_STATE,
  action: KeyAbleProps,
) => ({
  ...state,
  error: undefined,
  showModal: action.data,
});

const setSearchProductValue = (
  state = INITIAL_STATE,
  action: KeyAbleProps,
) => ({
  ...state,
  searchProductValue: action.data,
});

const setSearchVisitValue = (state = INITIAL_STATE, action: KeyAbleProps) => ({
  ...state,
  searchVisitValue: action.data,
});

const reset = () => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ERROR]: setError,
  [Types.SET_PROCESSING_STATUS]: setProcessingStatus,
  [Types.FAILURE]: setError,
  [Types.RESET_APP]: reset,
  [Types.SET_SHOW_ERROR_MODAL_STATUS]: setShowErrorModalStatus,
  [Types.SET_SEARCH_PRODUCT_VALUE]: setSearchProductValue,
  [Types.SET_SEARCH_VISIT_VALUE]: setSearchVisitValue,
  [Types.SET_SEARCH_VISIT_VALUE]: setSearchVisitValue,
});

export default Creators;
