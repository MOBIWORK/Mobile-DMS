import {
  // ActivityIndicator,
  ScrollView,
  StyleSheet,
  // View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppText, Block} from '../../../components/common';
// import {MainLayout} from '../../../layouts';
import {AppTheme, useTheme} from '../../../layouts/theme';
// import CardContactOverview from '../component/CardView';
import {DetailCustomerType, IDataCustomers} from '../../../models/types';
// import CardAddress from '../../Customer/components/CardAddress'; 

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

 

    // console.log(props?.data?.credit_limits,'credit')
  return (
    <Block block  colorTheme='bg_neutral' >
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {props.data != null && props.data.contacts != undefined &&
           props.data.contacts.length > 0 &&
          props.data.contacts != null && (
            <Block paddingTop={16} paddingHorizontal={16}>
              <AppText fontSize={14} fontWeight="500" lineHeight={21}>
                {getLabel('contactName')}
              </AppText>
              {/* <CardContactOverview data={props.data} /> */}
              <CardOverView
                type="contact"
                mainContactAddress={props.data.contacts[0]}
                mobileNo={props.data.mobile_no}
              />
            </Block>
          )}

        {props.data != null &&props.data.address != undefined &&
          props.data.address.length > 0 &&
          props.data.address != null && (
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
                      priAdd={props.data.customer_primary_address != null ? props.data.customer_primary_address : ''}
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
