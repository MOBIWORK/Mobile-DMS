import React, {FC, useEffect, useRef, useState, useTransition} from 'react';
import {AppSegmentedButtons, Block} from '../../../../components/common';
import {AppSegmentedButtonsType} from '../../../../components/common/AppSegmentedButtons';
import Order from './Order/Order';
import {
  IReportVisitDetail,
  ReportDebtType,
  VisitListItemType,
} from '../../../../models/types';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../../../navigation/screen-type';
import {ScreenConstant} from '../../../../const';
import Inventory from './Inventory';
import Debt from './Debt';
import SelectedDateFilter from './SelectedDateFilter';
import {CustomerService} from '../../../../services';
import isEqual from 'react-fast-compare';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '../../../../layouts/theme';

const Report: FC<ReportProps> = ({onOpenReportFilter, timeLabel, itemData}) => {
  const navigation = useNavigation<NavigationProp>();
  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>([]);
  const index = React.useRef<number>(1);
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const [reportData, setReportData] = useState<IReportVisitDetail>();
  const inventoryData = useRef<any>(reportData?.ton_kho);

  const changeReportIndex = React.useCallback((value: string | number) => {
    // setIndexPage(Number(value));
    startTransition(() => {
    index.current = Number(value);
      const newSegData = segData.map(item => {
        if (value === item.value) {
          return {...item, isSelected: true};
        } else {
          return {...item, isSelected: false};
        }
      });
      setSegData(newSegData);
    });
  },[]);

  const getData = async () => {
    const response: any = await CustomerService.getReportOrder({
      customer_name: itemData.customer_name,
    });
    if (Object.keys(response?.result).length > 0) {
      setReportData(response.result);
      inventoryData.current = response.result?.ton_kho;
    }
  };

  useEffect(() => {
    setSegData(dataSeg);
    getData()
  }, []); 
  // console.log(dataSeg,'seg')

  return (
    <>
      <SelectedDateFilter
        onOpenReportFilter={onOpenReportFilter}
        timeLabel={timeLabel}
      />
      {segData && (
        <AppSegmentedButtons data={segData} onChange={changeReportIndex} />
      )}
      {isPending ? (
        <Block justifyContent="center" alignItems="center" block>
          {' '}
          <ActivityIndicator size="large" color={theme.colors.primary} />{' '}
        </Block>
      ) : (
        <>
          {index.current === 1 && reportData?.don_hang ? (
            <Order
              orderData={reportData.don_hang.danh_sach_don}
              orderCount={reportData.don_hang?.so_don_trong_thang ?? 0}
              payment={reportData.don_hang?.so_tien_phai_tra ?? 0}
              handleItem={item =>
                navigation.navigate(ScreenConstant.REPORT_ORDER_DETAIL, {
                  item: item,
                })
              }
            />
          ) : index.current === 2 &&
            reportData?.ton_kho &&
            inventoryData.current ? (
            <Inventory inventoryData={inventoryData.current} />
          ) : index.current === 3 ? (
            <Debt debtData={ReportDebtData} />
          ) : null}
        </>
      )}
    </>
  );
};
interface ReportProps {
  onOpenReportFilter: () => void;
  timeLabel?: string;
  itemData: VisitListItemType;
}
export default React.memo(Report, isEqual);
const dataSeg: AppSegmentedButtonsType[] = [
  {
    title: 'order',
    value: 1,
    isSelected: true,
  },
  {
    title: 'inventory',
    value: 2,
    isSelected: false,
  },
  {
    title: 'debt',
    value: 3,
    isSelected: false,
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
