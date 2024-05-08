import {Platform, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {DetailCustomerType} from '../../../models/types';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallBack from '../../../layouts/ErrorFallBack';

type Props = {
  data: DetailCustomerType;
};

const CardOverView = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const {data} = props;

  return (
    <ErrorBoundary fallbackRender={ErrorFallBack}>
      <Block style={styles.card}>
        <Block paddingHorizontal={16}>
          <Block style={styles.containAddressLabel}>
            <Block style={styles.containIcon}>
              <SvgIcon source="MapPin" size={16} />
            </Block>
            <Text
              numberOfLines={2}
              fontSize={16}
              fontWeight="300"
              colorTheme="black"
              lineHeight={21}>
              {data && data.customer_primary_address
                ? data.customer_primary_address.split(',', 4)[0]
                : '___'}
            </Text>
          </Block>
        </Block>
      </Block>
    </ErrorBoundary>
  );
};

export default React.memo(CardOverView, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      // borderWidth: 0.1,
      paddingVertical: 12,
      marginHorizontal: 2,
      marginVertical: 10,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1.23,
          elevation: 1,
        },
        android: {
          elevation: 12,
          shadowRadius: 6.4,
        },
      }),
    } as ViewStyle,
    containAddress: {
      flexDirection: 'row',
      marginLeft: 16,
      alignContent: 'center',
      marginTop: 10,
    } as ViewStyle,
    containAddressLabel: {
      flexDirection: 'row',
      alignContent: 'center',
      marginBottom: 4,
    } as ViewStyle,
    marginContainText: {
      marginLeft: 4,
    } as ViewStyle,
    containIcon: {
      paddingTop: 4,
      marginRight: 4,
    } as ViewStyle,
    detailAddress: {
      marginLeft: 16,
      backgroundColor: 'red',
    } as ViewStyle,
    addressGetAndOrder: {
      marginRight: 8,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      // borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 3,
    } as ViewStyle,
    containMain: {
      marginLeft: 8,
      alignContent: 'center',
      flexDirection: 'row',
      marginTop: 4,
    } as ViewStyle,
  });
