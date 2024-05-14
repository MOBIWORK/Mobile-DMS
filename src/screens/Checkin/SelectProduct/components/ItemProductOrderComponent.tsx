import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  TextInput as Input,
} from 'react-native';
import {AppCheckBox, AppIcons, Block} from '../../../../components/common';
import {ICON_TYPE} from '../../../../const/app.const';
import {CommonUtils} from '../../../../utils';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import {IProduct} from '../../../../models/types';
import {useTranslation} from 'react-i18next';
import isEquals from 'react-fast-compare';
interface ItemProductProps {
  item: IProduct;
  onSelectProduct: (id: string, isSelected: boolean) => void;
  openBottomSheetDataFilter: (type: string, item?: IProduct) => void;
  onChangeQuantityProduct: (idItem: string, qty: number) => void;
}
const ItemProductOrderComponent = ({
  item,
  onSelectProduct,
  openBottomSheetDataFilter,
  onChangeQuantityProduct,
}: ItemProductProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <Block
      style={[styles.itemProduct]}
      color={
        item.isSelected ? 'rgba(196, 22, 28, 0.08)' : theme.colors.bg_default
      }>
      <Block
        style={[styles.flex, {columnGap: 6} as ViewStyle]}
        alignItems="flex-start">
        <Block block>
          <Block style={[styles.flex]} justifyContent="space-between">
            <Block width="65%">
              <View
                style={[
                  styles.flex as any,
                  {justifyContent: 'flex-start', columnGap: 16},
                ]}>
                <AppCheckBox
                  status={!!item.isSelected}
                  onChangeValue={() =>
                    onSelectProduct(
                      item.item_code,
                      item.isSelected ? item.isSelected : false,
                    )
                  }
                />
                <Block style={styles.flex}>
                  <AppIcons
                    iconType={ICON_TYPE.IonIcon}
                    name="barcode-outline"
                    size={18}
                    color={theme.colors.text_secondary}
                  />
                  <Text
                    style={[
                      styles.labelIfPrd as TextStyle,
                      {
                        marginLeft: 4,
                        color: theme.colors.text_secondary,
                        fontWeight: '500',
                      },
                    ]}>
                    {item.item_code}
                  </Text>
                </Block>
              </View>
              <Text
                style={[
                  styles.labelIfPrd as TextStyle,
                  {color: theme.colors.text_primary, marginLeft: 4},
                ]}>
                {item.item_name}
              </Text>
            </Block>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => openBottomSheetDataFilter('unit', item)}>
              <View style={[styles.flex as any, styles.containerUnit]}>
                <Text style={[styles.filter, {marginHorizontal: 20}]}>
                  {item.stock_uom}
                </Text>
                <AppIcons
                  iconType={ICON_TYPE.Feather}
                  name="chevron-down"
                  size={18}
                  color={theme.colors.text_primary}
                />
              </View>
            </TouchableOpacity>
          </Block>

          <View
            style={[
              styles.flex as any,
              styles.itemRowIf,
              {paddingVertical: 4},
            ]}>
            <Text
              style={[
                styles.labelIfPrd as TextStyle,
                {color: theme.colors.text_primary, marginLeft: 4},
              ]}>
              {CommonUtils.formatCash(item.price.toString())} đ
            </Text>
            <View style={[styles.flex as any]}>
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                onPress={() =>
                  onChangeQuantityProduct(
                    item.item_code,
                    item.quantity && item.quantity > item.min_order_qty
                      ? item.quantity - 1
                      : item.min_order_qty,
                  )
                }>
                <AppIcons
                  iconType={ICON_TYPE.AntIcon}
                  name="minus"
                  size={22}
                  color={theme.colors.text_primary}
                />
              </TouchableOpacity>

              <Input
                value={item.quantity ? item.quantity.toString() : ''}
                onChangeText={(qty: string) =>
                  onChangeQuantityProduct(item.item_code, parseInt(qty))
                }
                keyboardType="numeric"
                style={[
                  styles.labelIfPrd as any,
                  {width: 50, textAlign: 'center'},
                ]}
              />

              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                onPress={() =>
                  onChangeQuantityProduct(
                    item.item_code,
                    item.quantity ? item.quantity + 1 : 2,
                  )
                }>
                <AppIcons
                  iconType={ICON_TYPE.IonIcon}
                  name="add"
                  size={22}
                  color={theme.colors.text_primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.flex as any,
              styles.itemRowIf,
              {
                borderTopWidth: 1,
                borderColor: theme.colors.divider,
              },
            ]}>
            <Text style={[styles.labelIfPrd]}>{getLabel('intoMoney')}:</Text>
            <Text
              style={[
                styles.labelIfPrd as TextStyle,
                {color: theme.colors.text_primary, marginLeft: 4},
              ]}>
              {item?.quantity
                ? CommonUtils.formatCash(
                    (item.price * item.quantity).toString(),
                  )
                : 0}
            </Text>
          </View>
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(ItemProductOrderComponent, isEquals);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    filter: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    action: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.action,
    } as TextStyle,
    labelIfPrd: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      color: theme.colors.text_disable,
    } as TextStyle,
    itemProduct: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
    },
    itemRowIf: {
      paddingVertical: 12,
      justifyContent: 'space-between',
    } as ViewStyle,
    containerUnit: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 8,
    } as ViewStyle,
  });
