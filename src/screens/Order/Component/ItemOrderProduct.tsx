import React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Text} from 'react-native';
import {ICON_TYPE} from '../../../const/app.const';
import {CommonUtils} from '../../../utils';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {ItemProductOrder} from '../../../models/types';
import {AppIcons} from '../../../components/common';

const ItemOrderProduct = ({item}: ProductProps) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const styles = createSheetStyle(useTheme());
  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <AppIcons
          iconType={ICON_TYPE.IonIcon}
          name="barcode-outline"
          size={24}
          color={colors.text_secondary}
        />
        <Text style={[styles.code, {marginLeft: 4}]}>
          {item?.item_code ?? '---'}
        </Text>
      </View>
      <View style={{width: '80%'}}>
        <Text style={[styles.name]}>{item?.item_name ?? '---'}</Text>
      </View>
      <View style={[styles.flexSpace, {paddingBottom: 8}]}>
        <Text style={styles.textIf(colors.text_primary)}>
          {item?.rate ? CommonUtils.convertToTwoDecimalPlaces(item.rate) : 0}
          {''} đ
        </Text>
        <Text style={styles.textIf(colors.text_primary)}>
          x{item.qty} {`(${item.uom})`}
        </Text>
      </View>

      <View style={styles.contaienrIf}>
        {item?.discount_percentage?.toString() && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('discount')} (%)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {item?.discount_percentage?.toString().replace('.', ',')} %
            </Text>
          </View>
        )}
        {item.discount_amount?.toString() && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('discount')}(VND)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {CommonUtils.convertToTwoDecimalPlaces(item.discount_amount)}
            </Text>
          </View>
        )}
      </View>
      {item?.amount?.toString() && (
        <View style={styles.flexSpace}>
          <Text style={styles.textIf(colors.text_secondary)}>
            {getLabel('intoMoney')}:
          </Text>
          <Text style={styles.name}>
            {CommonUtils.convertToTwoDecimalPlaces(item.amount)}
          </Text>
        </View>
      )}
    </View>
  );
};

interface ProductProps {
  item: ItemProductOrder;
}

export default ItemOrderProduct;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    iconRemove: {
      position: 'absolute',
      top: 16,
      right: 20,
    } as ViewStyle,
    code: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
      color: theme.colors.text_secondary,
    } as TextStyle,
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    } as ViewStyle,
    name: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    container: {
      rowGap: 4,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    textIf: (color: string) =>
      ({
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '400',
        color: color,
      } as TextStyle),
    contaienrIf: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: theme.colors.divider,
      borderStyle: 'dashed',
    } as ViewStyle,
  });
