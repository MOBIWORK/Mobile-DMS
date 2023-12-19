import { ScreenConstant } from '.';
import { Colors } from '../assets';
import { SvgComponent } from '../assets/svgIcon';
import {IFilterType} from '../components/common/FilterListComponent';



export const DataWidget = [
  {
    id : 1,
    name :"Hồ sơ",
    icon : "iconUser",
    navigate :""
  },
  {
    id : 2,
    name :"Sản phảm",
    icon : "iconContainer",
    navigate :""
  },
  {
    id : 3,
    name :"Khuyến mại",
    icon : "iconTicket",
    navigate :""
  },
  {
    id : 4,
    name :"Thông báo nội bộ",
    icon : "iconBell",
    navigate :""
  },
  {
    id : 5,
    name :"Nhắc nhở",
    icon : "iconClock",
    navigate :""
  },
  {
    id : 6,
    name :"Quản lý hình ảnh",
    icon : "iconImage",
    navigate :""
  },
  {
    id : 7,
    name :"Đơn hàng",
    icon : "iconCart",
    navigate :ScreenConstant.ORDER_SCREEN
  },
  {
    id : 8,
    name :"Báo cáo",
    icon : "iconBar",
    navigate :""
  }
]

export const FilterDistanceData = (getLabel: any) => {
  return [
    {
      label: 'Gần nhất',
      isSelected: true,
    },
    {
      label: 'Xa nhất',
      isSelected: false,
    },
  ] as IFilterType[];
};

export const FilterNameData = (getLabel: any) => {
  return [
    {
      label: 'A -> Z',
      isSelected: true,
    },
    {
      label: 'Z -> A',
      isSelected: false,
    },
  ] as IFilterType[];
};

export const FilterStateData = (getLabel: any) => {
  return [
    {
      label: 'Tất cả',
      isSelected: true,
    },
    {
      label: 'Đã viếng thăm',
      isSelected: false,
    },
    {
      label: 'Chưa viếng thăm',
      isSelected: false,
    },
  ] as IFilterType[];
};

export const FilterBirthdayData = (getLabel: any) => {
  return [
    {
      label: 'Tất cả',
      isSelected: true,
    },
    {
      label: 'Hôm nay',
      isSelected: false,
    },
    {
      label: 'Tuần này',
      isSelected: false,
    },
    {
      label: 'Tháng này',
      isSelected: false,
    },
  ] as IFilterType[];
};
