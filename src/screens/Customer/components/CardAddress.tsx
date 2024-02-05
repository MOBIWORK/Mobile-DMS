import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Platform} from 'react-native';
import {AppText as Text, Block, SvgIcon} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';
import {AddressSelected} from './FormAddress';

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
  return (
    <View style={styles.card}>
      {props.type === 'address' ? (
        <>
          <View style={{paddingHorizontal: 16}}>
            <View style={styles.containAddressLabel}>
              <View style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </View>
              <View>
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
              </View>
            </View>
          </View>
          <View style={styles.containAddress}>
            {props.mainAddress.addressGet && (
              <View style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  Địa chỉ giao hàng
                </Text>
              </View>
            )}
            {props.mainAddress.addressOrder && (
              <View style={styles.addressGetAndOrder}>
                <Text
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  Địa chỉ đặt hàng
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.containAddressLabel}>
            <Text
              fontSize={16}
              fontWeight="400"
              colorTheme="black"
              lineHeight={21}>
              {props.mainContactAddress.nameContact
                ? props.mainContactAddress.nameContact
                : '---'}
            </Text>
          </View>
          <View style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
            <View style={styles.containIcon}>
              <SvgIcon source="MapPin" size={16} />
            </View>
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
          </View>
          <View style={[styles.containAddressLabel, {paddingHorizontal: 4}]}>
            <View style={styles.containIcon}>
              <SvgIcon source="Phone" size={16} />
            </View>
            <Text
              numberOfLines={2}
              fontSize={14}
              fontWeight="300"
              // textAlign='justify'
              colorTheme="black"
              lineHeight={21}>
              {props.mainContactAddress.phoneNumber
                ? formatPhoneNumber(props.mainContactAddress.phoneNumber)
                : '---'}
            </Text>
          </View>
          <View style={styles.containMain}>
            <View style={styles.addressGetAndOrder}>
              <Text
                fontSize={14}
                lineHeight={21}
                fontWeight="400"
                colorTheme="primary">
                Liên hệ chính
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
    // <Block>
    //   <Text>
    //     b
    //   </Text>
    // </Block>
  );
};

export default CardAddress;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      borderWidth: 0.1,
      paddingVertical: 12,
      // paddingHorizontal: 16,
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
      // paddingHorizontal: 6,
    } as ViewStyle,
    marginContainText: {
      marginLeft: 4,
    } as ViewStyle,
    containIcon: {
      // backgroundColor:'red',
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
      borderRadius: 16,
      paddingVertical: 3,
    } as ViewStyle,
    containMain: {
      marginLeft: 8,
      alignContent: 'center',
      flexDirection: 'row',
      marginTop: 4,
    } as ViewStyle,
  });
