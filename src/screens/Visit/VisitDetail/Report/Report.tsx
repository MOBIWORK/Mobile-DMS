import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {AppSegmentedButtons, Block} from '../../../../components/common';
import {AppSegmentedButtonsType} from '../../../../components/common/AppSegmentedButtons';
import Order from './Order/Order';
import {
  DebtDetailItemType,
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
import ReportFilterBottomSheet from '../../../Report/Component/ReportFilterBottomSheet';
import {IFilterType} from '../../../../components/common/FilterListComponent';
import {CommonUtils} from '../../../../utils';
import {useTranslation} from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import {useDispatch} from 'react-redux';
import {appActions} from '../../../../redux-store/app-reducer/reducer';

const Report: FC<ReportProps> = ({onOpenReportFilter, timeLabel, itemData}) => {
  const navigation = useNavigation<NavigationProp>();
  const [segData, setSegData] = useState<AppSegmentedButtonsType[]>([]);
  const index = React.useRef<number>(1);
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const {t: getLabel} = useTranslation();
  const dispatch = useDispatch();

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [reportData, setReportData] = useState<IReportVisitDetail>();
  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );
  const [from_date, setFromDate] = useState<number>(new Date().getTime());
  const [to_date, setToDate] = useState<number>(new Date().getTime());

 

  const changeReportIndex = React.useCallback(
    (value: string | number) => {
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
    },
    [segData],
  );

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      setFromDate(Number(item.value));
      setToDate(Number(item.value));
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      const {from_date, to_date} = CommonUtils.dateToDate(
        item.value?.toString() || '',
      );
      setFromDate(new Date(from_date).getTime());
      setToDate(new Date(to_date).getTime());
      setHeaderDate(getLabel(String(item.label)));
    }
  };

  const onChangeDateCalender = (startDate: any, endDate?: any) => {
    setHeaderDate(
      endDate
        ? `${CommonUtils.convertDate(
            Number(startDate),
          )} - ${CommonUtils.convertDate(Number(endDate))}`
        : CommonUtils.convertDate(Number(startDate)),
    );
    setFromDate(new Date(startDate).getTime());
    if (endDate) {
      setToDate(new Date(endDate).getTime());
    } else {
      setToDate(new Date(startDate).getTime());
    }
  };

  const getData = async () => {
    dispatch(appActions.setProcessingStatus(true));
    const response: any = await CustomerService.getReportOrder({
      customer_name: itemData.customer_name,
      from_date: from_date / 1000,
      to_date: to_date / 1000,
    });
    if (Object.keys(response?.result).length > 0) {
      setReportData(response.result);
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  useLayoutEffect(() => {
    setSegData(dataSeg);
  }, []);

  useEffect(() => {
    getData();
  }, [to_date]);

  return (
    <>
      <SelectedDateFilter
        onOpenReportFilter={() => filerBottomSheetRef.current?.snapToIndex(0)}
        timeLabel={headerDate}
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
          ) : index.current === 2 && reportData?.ton_kho ? (
            <Inventory
              inventoryData={reportData?.ton_kho ? reportData.ton_kho : []}
            />
          ) : index.current === 3 &&
            reportData?.cong_no &&
            reportData?.cong_no_chi_tiet ? (
            <Debt
              debtData={reportData?.cong_no_chi_tiet}
              reportDebt={reportData?.cong_no ? reportData.cong_no : undefined}
            />
          ) : null}
        </>
      )}
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={item =>
          item.value !== 'selectDate' && onChangeHeaderDate(item)
        }
        onChangeDateCalender={onChangeDateCalender}
      />
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
