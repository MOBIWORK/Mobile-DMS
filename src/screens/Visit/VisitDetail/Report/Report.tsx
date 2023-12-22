import React, {FC, useEffect, useState} from 'react';
import {AppSegmentedButtons} from '../../../../components/common';
import {AppSegmentedButtonsType} from '../../../../components/common/AppSegmentedButtons';
import Order from './Order/Order';
import {
  ReportDebtType,
  ReportInventoryType,
  ReportOrderItemType,
} from '../../../../models/types';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../../../navigation';
import {ScreenConstant} from '../../../../const';
import Inventory from './Inventory';
import Debt from './Debt';
import SelectedDateFilter from './SelectedDateFilter';

const Report: FC<ReportProps> = ({onOpenReportFilter}) => {
  const navigation = useNavigation<NavigationProp>();
  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>([]);
  const [indexPage, setIndexPage] = useState<number>(1);

  const changeReportIndex = (value: string | number) => {
    setIndexPage(Number(value));
    const newSegData = segData.map(item => {
      if (value === item.value) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setSegData(newSegData);
  };

  useEffect(() => {
    setSegData(dataSeg);
  }, []);

  return (
    <>
      <SelectedDateFilter onOpenReportFilter={onOpenReportFilter} />
      {segData && (
        <AppSegmentedButtons data={segData} onChange={changeReportIndex} />
      )}
      <>
        {indexPage === 1 ? (
          <Order
            orderData={ReportOrderData}
            handleItem={item =>
              navigation.navigate(ScreenConstant.REPORT_ORDER_DETAIL, {
                item: item,
              })
            }
          />
        ) : indexPage === 2 ? (
          <Inventory inventoryData={ReportInventoryData} />
        ) : (
          <Debt debtData={ReportDebtData} />
        )}
      </>
    </>
  );
};
interface ReportProps {
  onOpenReportFilter: () => void;
}
export default Report;
const dataSeg: AppSegmentedButtonsType[] = [
  {
    title: 'Đơn hàng',
    value: 1,
    isSelected: true,
  },
  {
    title: 'Tồn kho',
    value: 2,
    isSelected: false,
  },
  {
    title: 'Công nợ',
    value: 3,
    isSelected: false,
  },
];
const ReportOrderData: ReportOrderItemType[] = [
  {
    id: 1,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 2,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 3,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 4,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 5,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 6,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 7,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
  {
    id: 8,
    label: 'DH-22344',
    date: '20/11/2023',
    time: '8:00',
    price: 6000000,
  },
];
const ReportInventoryData: ReportInventoryType[] = [
  {
    dateTime: '28/11/2023',
    listProduct: [
      {
        productName: 'Brand New Bike, Local buyer only',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Macbook Pro 16 inch (2020 ) For Sale',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Coach Tabby 26 for sale',
        count: 1,
        unit: 'Cái',
      },
    ],
  },
  {
    dateTime: '27/11/2023',
    listProduct: [
      {
        productName: 'Brand New Bike, Local buyer only',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Macbook Pro 16 inch (2020 ) For Sale',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Coach Tabby 26 for sale',
        count: 1,
        unit: 'Cái',
      },
    ],
  },
  {
    dateTime: '26/11/2023',
    listProduct: [
      {
        productName: 'Brand New Bike, Local buyer only',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Macbook Pro 16 inch (2020 ) For Sale',
        count: 1,
        unit: 'Cái',
      },
      {
        productName: 'Coach Tabby 26 for sale',
        count: 1,
        unit: 'Cái',
      },
    ],
  },
];
const ReportDebtData: ReportDebtType = {
  total: 7000000,
  listDebt: [
    {
      dateTime: '20/11/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
    {
      dateTime: '10/11/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
    {
      dateTime: '20/11/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
    {
      dateTime: '02/11/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 2000000,
    },
    {
      dateTime: '20/10/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
    {
      dateTime: '20/10/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
    {
      dateTime: '20/10/2023',
      description: 'Công nợ tiền mua hàng theo phiếu bán hàng số [BH_7664]',
      numberDebt: 1000000,
    },
  ],
};
