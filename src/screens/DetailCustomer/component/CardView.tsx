import {StyleSheet, View, Platform, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {IDataCustomer} from '../../../models/types';
import {AppText, SvgIcon} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';
import {useTranslation} from 'react-i18next';

type Props = {
  data: IDataCustomer;
};

const CardContactOverview = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.rootLayout}>
        <AppText
          fontSize={16}
          fontWeight="500"
          lineHeight={24}
          style={styles.labelText}>
          {props.data.customer_name}
        </AppText>
        <View style={styles.labelView}>
          <SvgIcon source="MapPin" size={18} />
          <AppText numberOfLines={1} style={{maxWidth: '90%'}}>
            {' '}
            {props.data?.address?.address
              ? props.data?.address?.address
              : '---'}
          </AppText>
        </View>
        <View style={styles.labelView}>
          <SvgIcon source="Phone" size={18} />
          <AppText numberOfLines={1}>
            {' '}
            {props.data?.contact?.phone
              ? formatPhoneNumber(props.data?.contact?.phone)
              : '---'}
          </AppText>
        </View>
      </View>

      <View style={styles.containAddress}>
        <View style={styles.mainContact}>
          <AppText fontSize={14} fontWeight="400" colorTheme="primary">
            {getLabel('mainContact')}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default CardContactOverview;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      borderWidth: 0.1,
      paddingVertical: 12,
      marginVertical: 8,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.23,
          elevation: 2,
        },
        android: {
          elevation: 4,
          shadowRadius: 6.4,
        },
      }),
    } as ViewStyle,
    labelText: {
      paddingLeft: 8,
    } as TextStyle,
    labelView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 8,
      marginHorizontal: 10,
    } as ViewStyle,
    mainContact: {
      marginRight: 8,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      paddingVertical: 3,
    } as ViewStyle,
    rootLayout: {
      marginHorizontal: 8,
    } as ViewStyle,
    containAddress: {
      flexDirection: 'row',
      marginLeft: 16,
      alignContent: 'center',
      marginTop: 10,
    } as ViewStyle,
  });
