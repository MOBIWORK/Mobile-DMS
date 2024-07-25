import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import {Block, SvgIcon, AppText as Text} from '../../../components/common';
import {Address, ContactCard} from '../../../models/types';
import {formatPhoneNumber} from '../../../config/function';

type Props = CardTypeAddress | CardContactAddress;

interface CardTypeAddress {
  type: 'address';
  address: Address;
  primaryAddress?: string;
  onPressCard: () => void;
}

interface CardContactAddress {
  type: 'contact';
  contact: ContactCard;
  primaryContact?: any;
  onPressCard: () => void;
}

const CardEditAddress = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  return (
    <>
      {props.type === 'address'
        ? props.address.primary === 1 && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => props.onPressCard()}>
              <Block paddingHorizontal={16}>
                <Block style={styles.containAddressLabel}>
                  <Block style={styles.containIcon}>
                    <SvgIcon source="MapPin" size={16} />
                  </Block>
                  <Block>
                    <Text
                      numberOfLines={2}
                      fontSize={14}
                      fontWeight="300"
                      style={{maxWidth: '100%'}}
                      colorTheme="black"
                      lineHeight={21}>
                      {props.address?.address_title
                        ? props.address.address_title
                        : props.address?.address_line1
                        ? props.address.address_line1
                        : ''}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block style={styles.containAddress}>
                {props.address.primary === 1 && (
                  <Block style={styles.addressGetAndOrder}>
                    <Text
                      fontSize={14}
                      lineHeight={21}
                      fontWeight="400"
                      colorTheme="primary">
                      Địa chỉ chính
                    </Text>
                  </Block>
                )}
                {props.address.is_primary_address === 1 && (
                  <Block style={styles.addressGetAndOrder}>
                    <Text
                      fontSize={14}
                      lineHeight={21}
                      fontWeight="400"
                      colorTheme="primary">
                      Đặt hàng
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
                      Giao hàng
                    </Text>
                  </Block>
                )}
              </Block>
            </TouchableOpacity>
          )
        : props.contact.primary === 1 && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => props.onPressCard()}>
              <Block paddingHorizontal={16}>
                <Block style={styles.containAddressLabel}>
                  <Text
                    fontSize={16}
                    fontWeight="400"
                    colorTheme="black"
                    lineHeight={21}>
                    {props.contact?.first_name
                      ? props.contact.first_name
                      : '---'}
                  </Text>
                </Block>
                <Block
                  style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
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
                      props.contact?.address
                        ? `${props.contact.address}, `
                        : '---'
                    }`}
                  </Text>
                </Block>
                {props.contact?.phone && (
                  <Block
                    style={[
                      styles.containAddressLabel,
                      {paddingHorizontal: 4},
                    ]}>
                    <Block style={styles.containIcon}>
                      <SvgIcon source="Phone" size={16} />
                    </Block>
                    <Text
                      numberOfLines={2}
                      fontSize={14}
                      fontWeight="300"
                      colorTheme="black"
                      lineHeight={21}>
                      {props.contact?.phone
                        ? formatPhoneNumber(props.contact.phone)
                        : '---'}
                    </Text>
                  </Block>
                )}

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
            </TouchableOpacity>
          )}
    </>
  );
};

export default CardEditAddress;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg_default,
      // shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      paddingVertical: 12,
      marginHorizontal: 2,
      marginVertical: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
