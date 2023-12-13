import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
  ImageStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import {ColorSchema, useTheme} from '@react-navigation/native';
import {ICustomer} from './data';
import {Colors} from '../../../assets';
import AppImage from '../../../components/common/AppImage';

const CardView = (props: ICustomer) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.containContentView}>
        <Text style={styles.textName}>{props.name}</Text>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconAddress'} style={styles.iconStyle} />
          <Text numberOfLines={1} style={styles.contentText}>
            {props.address}
          </Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconPhone'} style={styles.iconStyle} />
          <Text style={styles.contentText}>{props.phone}</Text>
        </View>
        <View style={styles.contentContainLayout}>
          <AppImage source={'IconType'} style={styles.iconStyle} />
          <Text style={styles.contentText}>{props.type}</Text>
        </View>
      </View>
      <View style={styles.containButton}>
        <TouchableOpacity style={styles.containButtonBuy}>
          <Text
            style={{
              color: theme.colors.action,
              paddingHorizontal: 9,
              paddingVertical: 8,
            }}>
            Đặt hàng ngay
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CardView;

const rootStyles = (theme: ColorSchema) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.white,
      height: 123,
      marginBottom: 16,
      marginHorizontal: 2,
      borderRadius: 16,
      marginTop: 4,
      flexDirection: 'row',
      justifyContent: 'space-around',
      
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
      height: 37,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    } as ViewStyle,
  });