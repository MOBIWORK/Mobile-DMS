import {StyleSheet, ScrollView, ViewStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Block} from '../../../../components/common';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import ItemCash from '../../Statistical/components/ItemCash';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReportHeader from '../../Component/ReportHeader';
import BottomSheet from '@gorhom/bottom-sheet';
import {CommonUtils} from '../../../../utils';
import {useTranslation} from 'react-i18next';
import {IFilterType} from '../../../../components/common/FilterListComponent';
import ReportFilterBottomSheet from '../../Component/ReportFilterBottomSheet';
import {useDispatch} from 'react-redux';
import {appActions} from '../../../../redux-store/app-reducer/reducer';
import {ReportService} from '../../../../services';
import {INonCustomerResult} from '../../../../models/types';
import CardNonOrder from './component/cardNonOrder';

const NonOrderCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const dispatch = useDispatch();

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );

  const [date, setDate] = useState<number>(new Date().getTime());
  const [nonCustomerData, setNonCustomerData] =
    useState<INonCustomerResult | null>(null);

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      setDate(Number(item.value));
      // setFromDate(Number(item.value));
      // setToDate(Number(item.value));
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      setHeaderDate(getLabel(String(item.label)));
    }
  };

  const onChangeDateCalender = (date: any) => {
    setHeaderDate(CommonUtils.convertDate(Number(date)));
    setDate(new Date(date).getTime());
  };

  const getDataNonCustomer = async () => {
    dispatch(appActions.setProcessingStatus(true));
    const response: any = await ReportService.getNonCustomerOrder(
      parseInt(String(date / 1000), 10),
    );
    if (Object.keys(response?.result).length > 0) {
      setNonCustomerData(response.result);
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  useEffect(() => {
    getDataNonCustomer().then();
  }, [date]);

  return (
    <SafeAreaView edges={['bottom', 'top']} style={styles.root}>
      <ReportHeader
        title={getLabel('customerNotOrder')}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <ItemCash
        label={getLabel('totalCustomer')}
        content={nonCustomerData?.total_customers ?? 0}
        icon={'NewCustomerIcon'}
      />
      {nonCustomerData && nonCustomerData?.details?.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block paddingHorizontal={8}>
            {nonCustomerData.details.map((item, index) => {
              return <CardNonOrder key={index} item={item} />;
            })}
          </Block>
        </ScrollView>
      )}
      <ReportFilterBottomSheet
        isNonCustomer
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={item =>
          item.value !== 'selectDate' && onChangeHeaderDate(item)
        }
        onChangeDateCalender={onChangeDateCalender}
      />
    </SafeAreaView>
  );
};

export default React.memo(NonOrderCustomer, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 16,
    } as ViewStyle,
  });
