import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Platform} from 'react-native';
import {AppText as Text, SvgIcon, Block} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';

import {useTranslation} from 'react-i18next';
import {Address, Contact, ContactCard} from '../../../models/types';

type Props = CardAddressType | CardContactType;

type CardAddressType = {
  type: 'address';
  mainAddress: Address;
  priAdd?: string;
};
type CardContactType = {
  type: 'contact';
  mainContactAddress: ContactCard;
  priContact?: string;
};

const CardAddress = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  // console.log(props,'props')

  return (
    <Block style={styles.card}>
      {props.type === 'address' ? (
        <>
          <Block>
            <Block style={styles.containAddressLabel}>
              <Block style={styles.containIcon}>
              <SvgIcon source="MapPin" size={16} color={theme.colors.text_primary} />
              {/* <SvgIcon source="MapPin" size={16}  /> */}
              </Block>
              <Block>
                <Text
                  numberOfLines={2}
                  fontSize={16}
                  fontWeight="300"
                  colorTheme="text_primary"
                  lineHeight={21}>
                  {props.mainAddress.address_title
                    ? props.mainAddress.address_title.split(',', 4)[0]
                    : '___'}
                </Text>
              </Block>
            </Block>
            <Block paddingLeft={28}>
              <Text
                numberOfLines={2}
                fontSize={14}
                fontWeight="300"
                style={{maxWidth: '90%'}}
                colorTheme="text_primary"
                lineHeight={21}>
                {props.mainAddress.address_title
                  ? props.mainAddress.address_title.split(',', 4)[1] +
                    ',' +
                    props.mainAddress.address_title.split(',', 4)[2] +
                    ',' +
                    props.mainAddress.address_title.split(',', 4)[3]
                  : '___'}
                {/* {`${props.mainAddress.state?.value}, ${props.mainAddress.city}, ${props.mainAddress.county}`} */}
              </Text>
            </Block>
          </Block>
          <Block style={styles.containAddress}>
            {props.priAdd &&
              props.priAdd?.includes(props.mainAddress.address_title) && (
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
            {props.mainAddress.is_shipping_address === 1 && (
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
        </>
      ) : (
        <Block paddingHorizontal={16}>
          <Block style={styles.containAddressLabel}>
            <Text
              fontSize={16}
              fontWeight="400"
              colorTheme="text_primary"
              lineHeight={21}>
              {props.mainContactAddress.first_name
                ? props.mainContactAddress.first_name
                : '---'}
            </Text>
          </Block>
          <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
            <Block style={styles.containIcon}>
              <SvgIcon source="MapPin" size={16} color={theme.colors.text_primary} />
            </Block>
            <Text
              numberOfLines={2}
              fontSize={14}
              fontWeight="300"
              colorTheme="text_primary"
              lineHeight={21}>
              {`${
                props.mainContactAddress.address
                  ? `${props.mainContactAddress.address.replace(/\//g, ', ')}, `
                  : ''
              }`}
            </Text>
          </Block>
          <Block style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
            <Block style={styles.containIcon}>
              <SvgIcon source="Phone" size={16} color={theme.colors.text_primary} />
            </Block>
            <Text
              numberOfLines={2}
              fontSize={14}
              fontWeight="300"
              colorTheme="text_primary"
              lineHeight={21}>
              {props.mainContactAddress.phone != null
                ? formatPhoneNumber(props.mainContactAddress.phone)
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
      )}
    </Block>
  );
};

export default CardAddress;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg_default,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      paddingVertical: 12,
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
      paddingHorizontal: 16,
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
