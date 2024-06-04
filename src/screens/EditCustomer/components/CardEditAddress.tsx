import {Platform, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {Address, Contact} from '../../../models/types';
import {formatPhoneNumber} from '../../../config/function';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallBack from '../../../layouts/ErrorFallBack';

type Props = CardTypeAddress | CardContactAddress;

interface CardTypeAddress {
  type: 'address';
  address: Address;
  primaryAddress?: string;
}

interface CardContactAddress {
  type: 'contact';
  contact: Contact;
  primaryContact?: any;
}

const CardEditAddress = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <ErrorBoundary fallbackRender={ErrorFallBack}>
      {props.type === 'address' ? (
        props.address.is_primary_address === 1 && (
          <Block style={styles.card}>
            <Block paddingHorizontal={16}>
              <Block style={styles.containAddressLabel}>
                <Block style={styles.containIcon}>
                  <SvgIcon source="MapPin" size={16} />
                </Block>
                <Block>
                  {props.address.address_title && (
                    <Text
                      numberOfLines={2}
                      fontSize={16}
                      fontWeight="300"
                      colorTheme="black"
                      lineHeight={21}>
                      {getLabel('addressDetail')}
                    </Text>
                  )}
                  <Text
                    numberOfLines={2}
                    fontSize={14}
                    fontWeight="300"
                    style={{maxWidth: '90%'}}
                    colorTheme="black"
                    lineHeight={21}>
                    {props.address.address_title}
                  </Text>
                </Block>
              </Block>
            </Block>
            <Block style={styles.containAddress}>
              {props.address.is_primary_address === 1 && (
                <Block style={styles.addressGetAndOrder}>
                  <Text
                    fontSize={14}
                    lineHeight={21}
                    fontWeight="400"
                    colorTheme="primary">
                    {getLabel('deliveryAddress')}
                  </Text>
                </Block>
              )}
              {props.address.is_shipping_address === 1 && (
                <Block style={styles.addressGetAndOrder}>
                  <Text
                    fontSize={14}
                    lineHeight={21}
                    fontWeight="400"
                    colorTheme="primary">
                    {getLabel('orderAddress')}
                  </Text>
                </Block>
              )}
            </Block>
          </Block>
        )
      ) : (
        <Block style={styles.card}>
          <Block paddingHorizontal={16}>
            <Block style={styles.containAddressLabel}>
              <Text
                fontSize={16}
                fontWeight="400"
                colorTheme="black"
                lineHeight={21}>
                {props.contact.first_name
                  ? props.contact.first_name + '' + props.contact.last_name
                  : '---'}
              </Text>
            </Block>
            <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
              <Block style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </Block>
              <Text
                numberOfLines={2}
                fontSize={14}
                fontWeight="300"
                colorTheme="black"
                lineHeight={21}>
                {`${props.contact.address ? `${props.contact.address}, ` : ''}`}
              </Text>
            </Block>
            <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
              <Block style={styles.containIcon}>
                <SvgIcon source="Phone" size={16} />
              </Block>
              <Text
                numberOfLines={2}
                fontSize={14}
                fontWeight="300"
                colorTheme="black"
                lineHeight={21}>
                {props.contact.mobile_no != null
                  ? formatPhoneNumber(props.contact.mobile_no)
                  : '---'}
              </Text>
            </Block>
            <Block style={styles.containMain}>
              <Block style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  {getLabel('mainContact')}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      )}
    </ErrorBoundary>
  );
};

export default React.memo(CardEditAddress, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
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
          elevation: 8,
          shadowRadius: 1.4,
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
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 3,
      borderRadius: 16,
    } as ViewStyle,
    containMain: {
      marginLeft: 8,
      alignContent: 'center',
      flexDirection: 'row',
      marginTop: 4,
    } as ViewStyle,
  });
