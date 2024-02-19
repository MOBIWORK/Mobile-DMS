import {ScreenConstant} from '.';
import {IFilterType} from '../components/common/FilterListComponent';
import {IWidget} from '../models/types';

export const DataWidget: IWidget[] = [
  {
    id: 1,
    name: 'Hồ sơ',
    icon: 'iconUser',
    navigate: ScreenConstant.PROFILE,
  },
  {
    id: 2,
    name: 'Sản phảm',
    icon: 'iconContainer',
    navigate: ScreenConstant.LIST_PRODUCT,
  },
  {
    id: 3,
    name: 'Khuyến mại',
    icon: 'iconTicket',
    navigate: ScreenConstant.CHECKIN_ORDER,
  },
  {
    id: 4,
    name: 'Thông báo nội bộ',
    icon: 'iconBell',
    navigate: '',
  },
  {
    id: 5,
    name: 'Nhắc nhở',
    icon: 'iconClock',
    navigate: '',
  },
  {
    id: 6,
    name: 'Quản lý hình ảnh',
    icon: 'iconImage',
    navigate: '',
  },
  {
    id: 7,
    name: 'Đơn hàng',
    icon: 'iconCart',
    navigate: ScreenConstant.ORDER_SCREEN,
  },
  {
    id: 8,
    name: 'Báo cáo',
    icon: 'iconBar',
    navigate: ScreenConstant.REPORT_SCREEN,
  },
];

export const newArrayWid: IWidget[] = [
  {
    id: 5,
    name: 'Nhắc nhở',
    icon: 'iconClock',
    navigate: '',
  },
  {
    id: 6,
    name: 'Quản lý hình ảnh',
    icon: 'iconImage',
    navigate: '',
  },
  {
    id: 7,
    name: 'Đơn hàng',
    icon: 'iconCart',
    navigate: ScreenConstant.ORDER_SCREEN,
  },
  {
    id: 8,
    name: 'Báo cáo',
    icon: 'iconBar',
    navigate: '',
  },
];

export const FilterDistanceData = (getLabel: any) => {
  return [
    {
      id: 1,
      title: 'Gần nhất',
    },
    {
      id: 2,
      title: 'Xa nhất',
    },
  ] as any;
};

export const FilterNameData = (getLabel: any) => {
  return [
    {
      id: 1,
      title: 'A -> Z',
    },
    {
      id: 2,
      title: 'Z -> A',
    },
  ] as any;
};

export const FilterStateData = (getLabel: any) => {
  return [
    {
      id: 1,
      title: 'Tất cả',
    },
    {
      id: 2,
      title: 'Đã viếng thăm',
    },
    {
      id: 3,
      title: 'Chưa viếng thăm',
    },
  ] as any;
};

export const FilterBirthdayData = (getLabel: any) => {
  return [
    {
      id: 1,
      title: 'Tất cả',
    },
    {
      id: 2,
      title: 'Hôm nay',
    },
    {
      id: 3,
      title: 'Tuần này',
    },
    {
      id: 4,
      title: 'Tháng này',
    },
  ] as any;
};
