import React, {useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import {AppIcons} from '../../../../components/common';
import {ICON_TYPE} from '../../../../const/app.const';
import {CommonUtils} from '../../../../utils';
import {useTranslation} from 'react-i18next';

const ItemProduct = ({
  name,
  code,
  dvt,
  quantity,
  price,
  percentage_discount,
  discount_amount,
  tax_percentage,
  tax_amount,
  totalPrice,
  onRemove,
}: ProductProps) => {
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
        <Text style={[styles.code, {marginLeft: 4}]}>{code}</Text>
      </View>
      <View style={{width: '80%'}}>
        <Text style={[styles.name]}>{name}</Text>
      </View>
      <View style={[styles.flexSpace, {paddingBottom: 8}]}>
        <Text style={styles.textIf(colors.text_primary)}>
          {price ? CommonUtils.convertToTwoDecimalPlaces(price) : 0}
          {''} đ
        </Text>
        <Text style={styles.textIf(colors.text_primary)}>
          x{quantity} {`(${dvt})`}
        </Text>
      </View>

      <View style={styles.contaienrIf}>
        {tax_percentage !== undefined && tax_percentage !== 0 && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('VAT')} (%)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {tax_percentage.toString()} %
            </Text>
          </View>
        )}
        {tax_amount !== undefined && tax_amount !== 0 && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('VAT')}(VND)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {price && CommonUtils.convertToTwoDecimalPlaces(tax_amount)}
            </Text>
          </View>
        )}
        {percentage_discount !== undefined && percentage_discount !== 0 && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('discount')} (%)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {percentage_discount?.toString()} %
            </Text>
          </View>
        )}
        {discount_amount !== undefined && discount_amount !== 0 && (
          <View style={[styles.flexSpace, {paddingVertical: 4}]}>
            <Text style={styles.textIf(colors.text_secondary)}>
              {getLabel('discount')}(VND)
            </Text>
            <Text style={styles.textIf(colors.text_primary)}>
              {CommonUtils.convertToTwoDecimalPlaces(discount_amount)}
            </Text>
          </View>
        )}
      </View>
      {totalPrice !== undefined && totalPrice !== 0 && (
        <View style={styles.flexSpace}>
          <Text style={styles.textIf(colors.text_secondary)}>
            {getLabel('intoMoney')}:
          </Text>
          <Text style={styles.name}>
            {CommonUtils.convertToTwoDecimalPlaces(totalPrice)}
          </Text>
        </View>
      )}

      {onRemove && (
        <TouchableOpacity
          onPress={() => onRemove && onRemove(name)}
          style={[styles.iconRemove]}>
          <AppIcons
            iconType={ICON_TYPE.IonIcon}
            name="trash-outline"
            size={22}
            color={colors.error}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ProductProps {
  code: string;
  name: string;
  dvt: string;
  quantity: number;
  totalPrice?: number;
  price?: number;
  percentage_discount?: number;
  discount_amount?: number;
  tax_percentage?: number;
  tax_amount?: number;
  onRemove?: (item_code: string) => void;
}

export default ItemProduct;

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
