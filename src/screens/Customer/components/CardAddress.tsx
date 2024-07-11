import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Platform} from 'react-native';
import {AppText as Text, SvgIcon, Block} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';
import {AddressSelected} from './FormAddress';
import {useTranslation} from 'react-i18next';

type Props = CardAddressType | CardContactType;

type CardAddressType = {
  type: 'address';
  mainAddress: MainAddress;
};
type CardContactType = {
  type: 'contact';
  mainContactAddress: MainContactAddress;
};

export type MainAddress = {
  addressGet: boolean;
  addressOrder: boolean;
  detailAddress?: string;
  city?: AddressSelected;
  district?: AddressSelected;
  ward?: AddressSelected;
  primary?:any
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
          <Block paddingHorizontal={16}>
            <Block style={styles.containAddressLabel}>
              <Block style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </Block>
              <Block>
                {props.mainAddress.detailAddress && (
                  <Text
                    numberOfLines={2}
                    fontSize={16}
                    fontWeight="300"
                    colorTheme="black"
                    lineHeight={21}>
                    {props.mainAddress.detailAddress}
                  </Text>
                )}
                <Text
                  numberOfLines={2}
                  fontSize={14}
                  fontWeight="300"
                  style={{maxWidth: '90%'}}
                  colorTheme="black"
                  lineHeight={21}>
                  {`${props.mainAddress.ward?.value}, ${props.mainAddress.district?.value}, ${props.mainAddress.city?.value}`}
                </Text>
              </Block>
            </Block>
          </Block>
          <Block style={styles.containAddress}>
            {props.mainAddress.addressGet && (
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
            {props.mainAddress.addressOrder && (
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
              colorTheme="black"
              lineHeight={21}>
              {props.mainContactAddress.nameContact
                ? props.mainContactAddress.nameContact
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
              {`${
                props.mainContactAddress.addressContact
                  ? `${props.mainContactAddress.addressContact}, `
                  : ''
              }${props.mainContactAddress.ward?.value}, ${
                props.mainContactAddress.district?.value
              }, ${props.mainContactAddress.city?.value}`}
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
              {props.mainContactAddress.phoneNumber
                ? formatPhoneNumber(props.mainContactAddress.phoneNumber)
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
      borderRadius:16
    } as ViewStyle,
    containMain: {
      marginLeft: 8,
      alignContent: 'center',
      flexDirection: 'row',
      marginTop: 4,
    } as ViewStyle,
  });
