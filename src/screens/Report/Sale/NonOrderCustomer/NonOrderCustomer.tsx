import {StyleSheet, ScrollView, ViewStyle} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Block} from '../../../../components/common';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import ItemCash from '../../Statistical/components/ItemCash';
import CardNonOrder from './component/cardNonOrder';
import {IDataNonOrderCustomer} from './component/ultil';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReportHeader from '../../Component/ReportHeader';
import BottomSheet from '@gorhom/bottom-sheet';
import {CommonUtils} from '../../../../utils';
import {useTranslation} from 'react-i18next';
import {IFilterType} from '../../../../components/common/FilterListComponent';
import ReportFilterBottomSheet from '../../Component/ReportFilterBottomSheet';

const NonOrderCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  const filerBottomSheetRef = useRef<BottomSheet>(null);

  const [headerDate, setHeaderDate] = useState<string>(
    `${getLabel('today')}, ${CommonUtils.convertDate(new Date().getTime())}`,
  );

  const generateFakeData = useCallback(() => {
    const fakeData: IDataNonOrderCustomer[] = [];

    for (let i = 0; i < 15; i++) {
      const data = {
        nameCompany: `Công ty ${i + 1}`,
        customerCode: generateRandomAlphaNumeric(6),
        address: `${i + 1}`,
        lastTimeOrder: generateRandomPastTime(),
      };

      fakeData.push(data);
    }

    return fakeData;
  }, []);

  const generateRandomAlphaNumeric = useCallback((length: number) => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }, []);

  const generateRandomPastTime = useCallback(() => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 365));

    const day = String(pastDate.getDate()).padStart(2, '0');
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const year = pastDate.getFullYear();

    return `${day}/${month}/${year}`;
  }, []);
  const fakeDataList = useMemo(() => generateFakeData(), []);

  const onChangeHeaderDate = (item: IFilterType) => {
    if (CommonUtils.isNumber(item.value)) {
      const newDateLabel = CommonUtils.isToday(Number(item.value))
        ? `${getLabel('today')}, ${CommonUtils.convertDate(Number(item.value))}`
        : `${CommonUtils.convertDate(Number(item.value))}`;
      setHeaderDate(newDateLabel);
    } else {
      setHeaderDate(getLabel(String(item.value)));
    }
  };

  const onChangeDateCalender = (date: any) => {
    setHeaderDate(CommonUtils.convertDate(Number(date)));
  };

  return (
    <SafeAreaView edges={['bottom', 'top']} style={styles.root}>
      <ReportHeader
        title={'Khách hàng chưa phát sinh đơn'}
        date={headerDate}
        onSelected={() =>
          filerBottomSheetRef.current &&
          filerBottomSheetRef.current.snapToIndex(0)
        }
      />
      <ItemCash
        label={'Tổng số khách hàng'}
        content={15}
        icon={'NewCustomerIcon'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block paddingHorizontal={8}>
          {fakeDataList.map((item, index) => {
            return <CardNonOrder key={index} item={item} />;
          })}
        </Block>
      </ScrollView>
      <ReportFilterBottomSheet
        filerBottomSheetRef={filerBottomSheetRef}
        onChange={onChangeHeaderDate}
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
