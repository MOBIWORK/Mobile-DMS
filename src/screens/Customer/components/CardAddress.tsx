import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {AppSelector} from '../../../redux-store';
import {AppText, SvgIcon} from '../../../components/common';
import {formatPhoneNumber} from '../../../config/function';
import {MainLayout} from '../../../layouts';

type Props = {
  type: 'address' | 'contact';
};

type MainAddress = {
  addressGet: boolean;
  addressOrder: boolean;
  city: string;
  detailAddress: string;
  district: string;
  ward: string;
};
type MainContactAddress = {
  nameContact: string;
  addressContact: string;
  phoneNumber: string;
};
const CardAddress = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const mainAddress: MainAddress = useSelector(AppSelector.getMainAddress);
  const mainContactAddress: MainContactAddress = useSelector(
    AppSelector.getMainContactAddress,
  );

  return (
    <View style={styles.card}>
      {props.type === 'address' ? (
        <>
          <MainLayout style={{paddingTop:0}}>
            <View style={styles.containAddressLabel}>
              <View style={styles.containIcon}>
                <SvgIcon source="MapPin" size={16} />
              </View>
              <View>
                <AppText
                  numberOfLines={2}
                  fontSize={16}
                  fontWeight="300"
                  colorTheme="black"
                  lineHeight={21}>
                  Địa chỉ chi tiết
                </AppText>
                <AppText
                  numberOfLines={2}
                  fontSize={16}
                  fontWeight="300"
                  // textAlign='justify'
                  colorTheme="black"
                  lineHeight={21}>
                  {mainAddress.detailAddress}
                </AppText>
              </View>
            </View>
          </MainLayout>
          <View style={styles.containAddress}>
            {mainAddress.addressGet && (
              <View style={styles.addressGetAndOrder}>
                <AppText
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  Địa chỉ giao hàng
                </AppText>
              </View>
            )}
            {mainAddress.addressOrder && (
              <View style={styles.addressGetAndOrder}>
                <AppText
                  fontSize={14}
                  lineHeight={21}
                  fontWeight="400"
                  colorTheme="primary">
                  Địa chỉ đặt hàng
                </AppText>
              </View>
            )}
          </View>
        </>
      ) : (
        <MainLayout style={{paddingTop: 0}}>
          <View >
          <AppText
              fontSize={16}
              fontWeight="400"
              colorTheme="black"
              lineHeight={21}>
              {mainContactAddress.nameContact}
            </AppText>
          </View>
            
          
          <View style={styles.containAddressLabel}>
            <View style={styles.containIcon}>
              <SvgIcon source="MapPin" size={16} />
            </View>
            <AppText
              numberOfLines={2}
              fontSize={14}
              fontWeight="300"
              colorTheme="black"
              lineHeight={21}>
              {mainContactAddress.addressContact}
            </AppText>
          </View>
          <View style={styles.containAddressLabel}>
            <View style={styles.containIcon}>
              <SvgIcon source="Phone" size={16} />
            </View>
            <AppText
              numberOfLines={2}
              fontSize={14}
              fontWeight="300"
              // textAlign='justify'
              colorTheme="black"
              lineHeight={21}>
              {formatPhoneNumber(mainContactAddress.phoneNumber)}
            </AppText>
          </View>
        </MainLayout>
      )}
    </View>
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
      marginVertical: 8,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.5,
          shadowRadius: 6.23,
          elevation: 7,
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
      marginBottom:4
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
  });
