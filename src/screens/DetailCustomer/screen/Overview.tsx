import {ScrollView, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppText} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import {AppTheme, useTheme} from '../../../layouts/theme';
import CardContactOverview from '../component/CardView';
import {IDataCustomer} from '../../../models/types';
import CardAddress from '../../Customer/components/CardAddress';
import {useSelector} from 'react-redux';
import {AppSelector} from '../../../redux-store';
import InforView from '../component/InforView';

type Props = {
  data: IDataCustomer;
};

const Overview = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const mainAddress = useSelector(AppSelector.getMainAddress);
  return (
    <MainLayout style={styles.containLayout}>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        <View>
          <AppText fontSize={14} fontWeight="500" lineHeight={21}>
            Người liên hệ
          </AppText>
          <CardContactOverview data={props.data} />
        </View>
        <View>
          <AppText fontSize={14} fontWeight="500" lineHeight={21}>
            Địa chỉ chính
          </AppText>
          <CardAddress type="address" mainAddress={mainAddress[0] as any} />
        </View>
        <View>
          <AppText fontSize={14} fontWeight="500" lineHeight={21} colorTheme='text_secondary'>
            Thông tin khách hàng 
          </AppText>
            <InforView  data={props.data} />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default Overview;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containLayout: {
      paddingTop: 16,
      backgroundColor: theme.colors.bg_neutral,
      // paddingVertical: 16,
    } as ViewStyle,
    root: {
      flex: 1,
    },
  });