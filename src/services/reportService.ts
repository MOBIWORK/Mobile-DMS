import {createApi} from '../api';
import {ApiConstant} from '../const';



type getTravelLogReport = {
  fromdate :number,
  todate :number
}

export const getKpi = () =>createApi().get(ApiConstant.GET_REPORT_KPI).then(res => res.data);

export const getReportVisit = () => createApi().get(ApiConstant.GET_REPORT_VISIT).then(res => res.data);

export const getTravelLogReport = (params : getTravelLogReport)=> createApi().get(ApiConstant.GET_TRAVEL_LOG_REPORT,params)