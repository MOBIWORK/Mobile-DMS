import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {ICustomer} from './data';
import {Colors} from '../../../assets';
import {Platform} from 'react-native';
import AppImage from '../../../components/common/AppImage';
import {TextStyle} from 'react-native';
import {useTheme, AppTheme} from '../../../layouts/theme';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import {ScreenConstant} from '../../../const';
import { IDataItem } from '../../../models/types';

const CardView = (props: IDataItem) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.containContentView}>
        <Text style={styles.textName}>{props.nameCompany}</Text>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconAddress'} style={styles.iconStyle} />
          <Text numberOfLines={1} style={styles.contentText}>
            {props?.address?.address}
          </Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconPhone'} style={styles.iconStyle} />
          <Text style={styles.contentText}>{props?.contact?.phoneNumber}</Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconType'} style={styles.iconStyle} />
          <Text style={styles.contentText}>{props?.type}</Text>
        </View>
      </View>
      <View style={styles.containButton}>
        <TouchableOpacity
          style={styles.containButtonBuy}
          onPress={() =>
            navigation.navigate(ScreenConstant.DETAIL_CUSTOMER, {data: props})
          }>
          <Text
            style={styles.textOrder}>
            Đặt hàng
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CardView);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.white,
      marginBottom: 16,
      marginHorizontal: 2,
      borderRadius: 16,
      marginTop: 4,
      flexDirection: 'row',
      justifyContent: 'space-around',
      ...Platform.select({
        android: {
          elevation: 1,
          shadowColor: Colors.darker,
        },
        ios: {
          shadowColor: '#000',
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
      // justifyContent: 'center',
      alignItems: 'center',
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
      // backgroundColor:'red'
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
      // backgroundColor:'black',
      alignItems: 'center',
      flex: 1,
    } as ViewStyle,
    containButtonBuy: {
      borderRadius: 16,
      borderColor: theme.colors.action,
      // width:100,
      padding:2,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    } as ViewStyle,
    textOrder:{
      color: theme.colors.action,
      paddingHorizontal: 9,
      paddingVertical: 8,
    }
  });
