import {StyleSheet, ScrollView, ViewStyle} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../components/common';
import {MainLayout} from '../../layouts';
import {AppTheme, useTheme} from '../../layouts/theme';
import ItemCash from '../Report/Statistical/components/ItemCash';
import CardNonOrder from './component/cardNonOrder';
import {IDataNonOrderCustomer} from './component/ultil';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReportHeader from '../Report/Component/ReportHeader';

const NonOrderCustomer = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);

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

  return (
    <SafeAreaView edges={['bottom', 'top']} style={styles.root}>
      <ReportHeader
        title={'Khách hàng chưa phát sinh đơn'}
        date={new Date().getTime()}
        onSelected={() => console.log('123')}
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
