import {createApi} from '../api';
import {ApiConstant} from '../const';
import {GET_REPORT_ROUTER_RESULT} from '../const/api.const';

type getTravelLogReportType = {
  fromdate: number;
  todate: number;
};
type getReportResultRouter = {
  from_date: number;
  to_date: number;
};

export const getTravelLogReport = (params: getTravelLogReportType) =>
  createApi()
    .get(ApiConstant.GET_TRAVEL_LOG_REPORT, params)
    .then(res => res.data);

export const getRouterResult = (params: getReportResultRouter) =>
  createApi().get(ApiConstant.GET_REPORT_ROUTER_RESULT, params);
export const getKpi = () =>
  createApi()
    .get(ApiConstant.GET_REPORT_KPI)
    .then(res => res.data);

export const getReportVisit = () =>
  createApi()
    .get(ApiConstant.GET_REPORT_VISIT)
    .then(res => res.data);

export const getReportSales = () =>
  createApi()
    .get(ApiConstant.GET_REPORT_SALES)
    .then(res => res.data);
export const getReportRevenue = () =>
  createApi()
    .get(ApiConstant.GET_REPORT_REVENUE)
    .then(res => res.data);
export const getVisitReoprt = (params: getReportResultRouter) =>
  createApi().get(ApiConstant.GET_REPORT_VISIT_DETAIL, params);
export const getReoprtOrderStatistics = (params: getReportResultRouter) =>
  createApi().get(ApiConstant.GET_REPORT_ORDER_STATISTICS, params);
export const getReoprtTagertKpi = (params: {month: number; year: number}) =>
  createApi().get(ApiConstant.GET_REPORT_TARGETS_KPI, params);
