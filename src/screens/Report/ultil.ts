import { SvgIconTypes } from "../../assets/svgIcon"
import { ScreenConstant } from "../../const"
import { navigate } from "../../navigation"


export type ItemProps = {
    title:string,
    content:string,
    icon:SvgIconTypes,
    // screenName:string,
    onPress:() => void

}

export const LineItem:ItemProps[] = [
    {
        title:'Báo cáo nhật ký di chuyển',
        content:'Hiển thị ngày giờ khai báo vị trí của nhân viên',
        icon:'ReportTravel',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    {
        title:'Báo cáo kết quả đi tuyến',
        content:'Hiển thị kết quả đi tuyến',
        icon:'ReportLine',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    {
        title:'Báo cáo viếng thăm',
        content:'Hiển thị số viếng thăm khách hàng trong tháng',
        icon:'ReportVisit',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    
]
export const SalesItem:ItemProps[] = [
    {
        title:'Thống kê phiếu đặt hàng',
        content:'Hiển thị KPI, thống kê phiếu đặt hàng',
        icon:'StatisticalIcon',
        onPress:() => navigate(ScreenConstant.STATISTICAL)
    },
    {
        title:'Chỉ tiêu KPI',
        content:'Báo cáo hiển thị chỉ tiêu KPI',
        icon:'ReportKPI',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    {
        title:'Khách hàng mới',
        content:'Các khách hàng được tạo mới',
        icon:'NewCustomerIcon',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    {
        title:'Khách hàng chưa phát sinh đơn',
        content:'Các khách hàng chưa phát sinh đơn hàng',
        icon:'EmptyOrderCustomer',
        onPress:() => navigate(ScreenConstant.NON_ORDER_CUSTOMER)
    },
    {
        title:'Báo cáo kết quả bán hàng',
        content:'Hiển thị KPI, thống kê phiếu đặt hàng ',
        icon:'ReportOrder',
        onPress:() => navigate(ScreenConstant.REPORT_SCREEN)
    },
    
]