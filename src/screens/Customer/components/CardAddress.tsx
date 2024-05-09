import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Platform} from 'react-native';
import {AppText as Text, SvgIcon, Block} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';
import {AddressSelected} from './FormAddress';
import {useTranslation} from 'react-i18next';
import {Address, Contact} from '../../../models/types';

type Props = CardAddressType | CardContactType;

type CardAddressType = {
  type: 'address';
  mainAddress: Address;
};
type CardContactType = {
  type: 'contact';
  mainContactAddress: Contact;
};

export type MainAddress = {
  addressGet: boolean;
  addressOrder: boolean;
  detailAddress?: string;
  city?: AddressSelected;
  district?: AddressSelected;
  ward?: AddressSelected;
};
export type MainContactAddress = {
  nameContact: string;
  phoneNumber: string;
  addressContact?: string;
  city?: AddressSelected;
  district?: AddressSelected;
  ward?: AddressSelected;
  isMainAddress: boolean;
};
const CardAddress = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <Block style={styles.card}>
      {props.type === 'address' ? (
        <>
          <Block>
            <Block style={styles.containAddressLabel}>
              <Block style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </Block>
              <Block>
                <Text
                  numberOfLines={2}
                  fontSize={16}
                  fontWeight="300"
                  colorTheme="black"
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
              colorTheme="black"
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
            {props.mainAddress.is_primary_address === 1 && (
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
        <Block style={{paddingHorizontal: 16}}>
          <Block style={styles.containAddressLabel}>
            <Text
              fontSize={16}
              fontWeight="400"
              colorTheme="black"
              lineHeight={21}>
              {props.mainContactAddress.first_name
                ? props.mainContactAddress.first_name
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
              {/* {`${
                props.mainContactAddress.first_name
                  ? `${props.mainContactAddress.first_name}, `
                  : ''
              }`} */}
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
              {props.mainContactAddress.mobile_no != null
                ? formatPhoneNumber(props.mainContactAddress.mobile_no)
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
      backgroundColor: theme.colors.white,
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
