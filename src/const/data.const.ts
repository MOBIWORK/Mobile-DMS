import {IFilterType} from '../components/common/FilterListComponent';

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
