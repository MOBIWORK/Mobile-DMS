import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppText} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import {AppTheme, useTheme} from '../../../layouts/theme';
import CardContactOverview from '../component/CardView';
import { IDataCustomers} from '../../../models/types';
import CardAddress from '../../Customer/components/CardAddress';

import InforView from '../component/InforView';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';

type Props = {
  data: IDataCustomers;
};

const Overview = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  console.log(props.data.cre_limid,'data address')
  return (
    <MainLayout style={styles.containLayout}>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        <View>
          <AppText fontSize={14} fontWeight="500" lineHeight={21}>
            {getLabel('contactName')}
          </AppText>
          <CardContactOverview data={props.data} />
        </View>
        {props.data.address != null && Object.keys(props.data.address).length > 0 ? (
          <View>
            <AppText fontSize={14} fontWeight="500" lineHeight={21}>
              {getLabel('mainAddress')}
            </AppText>
            <CardAddress type="address" mainAddress={props.data.address as any} />
          </View>
        ) : null}

        <View>
          <AppText
            fontSize={14}
            fontWeight="500"
            lineHeight={21}
            colorTheme="text_secondary">
            {getLabel('customerInfo')}
          </AppText>
          <InforView data={props.data} />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default React.memo(Overview,isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containLayout: {
      paddingTop: 16,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    root: {
      flex: 1,
    },
  });
