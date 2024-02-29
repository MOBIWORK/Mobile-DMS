import {createApi} from '../api';
import {ApiConstant} from '../const';

export const getKpi = () =>
  createApi()
    .get(ApiConstant.GET_REPORT_KPI)
    .then(res => res.data);
