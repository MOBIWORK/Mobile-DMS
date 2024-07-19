import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {AppText, Block} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {DetailCustomerType} from '../../../models/types';

import InforView from '../component/InforView';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import CardOverView from '../component/CardOverView';

type Props = {
  data: DetailCustomerType;
};

const Overview = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <Block block colorTheme="bg_neutral">
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {props.data &&
          props.data?.contacts &&
          props.data.contacts.length > 0 && (
            <Block paddingTop={16} paddingHorizontal={16}>
              <AppText fontSize={14} fontWeight="500" lineHeight={21}>
                {getLabel('contactName')}
              </AppText>
              {/* <CardContactOverview data={props.data} /> */}
              <CardOverView
                type="contact"
                mainContactAddress={
                  props.data.contacts.find(item => item.primary === 1) ||
                  props.data.contacts[0]
                }
                mobileNo={props.data.mobile_no}
              />
            </Block>
          )}

        {props.data && props.data?.address && props.data.address.length > 0 && (
          <Block paddingHorizontal={16} paddingTop={16}>
            <AppText fontSize={14} fontWeight="500" lineHeight={21}>
              {getLabel('mainAddress')}
            </AppText>
            {props.data.address.map((item, index) => {
              return (
                props.data?.customer_primary_address?.includes(
                  item.address_title,
                ) && (
                  <CardOverView
                    type="address"
                    mainAddress={item}
                    key={index.toString()}
                    priAdd={
                      props.data.customer_primary_address != null
                        ? props.data.customer_primary_address
                        : ''
                    }
                  />
                )
              );
            })}
          </Block>
        )}

        <Block paddingHorizontal={16} paddingVertical={16}>
          <AppText
            fontSize={14}
            fontWeight="500"
            lineHeight={21}
            colorTheme="text_secondary">
            {getLabel('customerInfo')}
          </AppText>
          {props.data !== null && <InforView data={props.data} />}
        </Block>
      </ScrollView>
    </Block>
  );
};

export default React.memo(Overview, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containLayout: {
      paddingTop: 16,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    root: {
      flex: 1,
    } as ViewStyle,
  });
