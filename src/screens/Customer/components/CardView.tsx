import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {Colors} from '../../../assets';
import {Platform} from 'react-native';
import AppImage from '../../../components/common/AppImage';
import {TextStyle} from 'react-native';
import {useTheme, AppTheme} from '../../../layouts/theme';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation/screen-type';
import { navigate } from '../../../navigation/navigation-service';
import {ScreenConstant} from '../../../const';
import {IDataCustomers} from '../../../models/types';
import {Block, AppText as Text} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';

const CardView = (props: IDataCustomers) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const {t: translate} = useTranslation();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigate(ScreenConstant.DETAIL_CUSTOMER, {data: props})}>
      <View style={styles.containContentView}>
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Block block>
            <Text style={styles.textName}>{props.customer_name}</Text>
            <Text style={styles.textName}>{props.customer_code}</Text>
          </Block>

          <View style={styles.containButton}>
            <TouchableOpacity
              style={styles.containButtonBuy}
              onPress={() =>
                navigation.navigate(ScreenConstant.DETAIL_CUSTOMER, {
                  data: props,
                })
              }>
              <Text style={styles.textOrder}>{translate('putOrder')}</Text>
            </TouchableOpacity>
          </View>
        </Block>
        <Block height={1} colorTheme="border" marginTop={4} marginBottom={4} />
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconAddress'} style={styles.iconStyle} />
          <Text numberOfLines={1} style={styles.contentText}>
            {props?.address?.[0]?.address ? props.address[0]?.address : '---'}
          </Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconPhone'} style={styles.iconStyle} />
          <Text style={styles.contentText}>
            {props?.contact?.[0]?.phoneNumber
              ? props?.contact?.[0]?.phoneNumber
              : '---'}
          </Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconType'} style={styles.iconStyle} />
          <Text style={styles.contentText}>
            {translate(props?.customer_type)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CardView,isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg_default,
      paddingVertical: 8,
      marginBottom: 16,
      marginHorizontal: 2,
      borderRadius: 16,
      marginTop: 4,
      shadowColor: Colors.darker,
      ...Platform.select({
        android: {
          elevation: 2,
          shadowColor: Colors.darker,
        },
        ios: {
          shadowColor:Colors.darker,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0,
          shadowRadius: 1.41,
          elevation: 0,
        },
      }),
    } as ViewStyle,
    contentContainLayout: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingRight: 16,
    } as ViewStyle,
    iconStyle: {
      width: 16,
      height: 16,
      marginRight: 4,
    } as ImageStyle,
    contentText: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
      color: Colors.darker,
    } as TextStyle,
    containContentView: {
      marginHorizontal: 16,
      paddingVertical: 12,
      flex: 1,
    } as ViewStyle,
    textName: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      color: Colors.darker,
      marginBottom: 4,
    } as TextStyle,
    containButton: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    } as ViewStyle,
    containButtonBuy: {
      borderRadius: 16,
      borderColor: theme.colors.action,
      height: 37,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    } as ViewStyle,
    textOrder: {
      color: theme.colors.action,
      paddingHorizontal: 9,
      paddingVertical: 8,
    },
  });
