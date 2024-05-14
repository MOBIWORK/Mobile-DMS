import React, {FC, useCallback} from 'react';
import {
  ImageStyle,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Button} from 'react-native-paper';
import {ScreenConstant} from '../../../../const';
import ItemProduct from './ItemProduct';
import {IProduct, IProductPromotion} from '../../../../models/types';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import UINoData from './UINoData';

const ProductList: FC<UpdateItemProductProps> = ({
  tab,
  products,
  productsPromotion,
  showDetailProdcut,
  handlerRemoveItemProduct,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();

  if (tab === 1) {
    return (
      <>
        {products.length > 0 ? (
          <View style={[styles.flexSpace]}>
            <Button
              onPressIn={() =>
                navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)
              }
              style={{
                width: '48%',
                marginRight: 16,
                borderColor: colors.action,
              }}
              textColor={colors.action}
              labelStyle={[styles.textBtt as any, {fontWeight: '500'}]}
              icon="plus"
              mode="outlined"
              onPress={() => console.log('Pressed')}>
              {getLabel('selectProduct')}
            </Button>
            <Button
              style={{width: '48%', borderColor: colors.action}}
              textColor={colors.action}
              labelStyle={[styles.textBtt as any, {fontWeight: '500'}]}
              icon="barcode-scan"
              mode="outlined"
              onPress={() => console.log('Pressed')}>
              {getLabel('scanCode')}
            </Button>
          </View>
        ) : (
          <UINoData />
        )}
        <View style={{marginTop: 20, rowGap: 8}}>
          {products.map((item, i) => (
            <Pressable key={i} onPress={() => showDetailProdcut(item)}>
              <ItemProduct
                onRemove={() => handlerRemoveItemProduct(item.item_code)}
                name={item.item_name}
                code={item.item_code}
                dvt={item.stock_uom}
                quantity={item.quantity ? item.quantity : 0}
                percentage_discount={item.discount_item_percent}
                discount_amount={item.discount_item_amount}
                tax_percentage={item?.rate_tax_item ?? 0}
                tax_amount={item.total_item_tax}
                totalPrice={item.total_item_money}
                price={item?.price ?? 0}
              />
            </Pressable>
          ))}
        </View>
      </>
    );
  } else {
    return (
      <>
        <View>
          {productsPromotion.map((item, i) => (
            <Pressable key={i}>
              <ItemProduct
                name={item.item_name}
                code={item.item_code}
                dvt={item.stock_uom}
                quantity={item.qty}
              />
            </Pressable>
          ))}
        </View>
      </>
    );
  }
};

export default ProductList;
interface UpdateItemProductProps {
  tab: number;
  products: IProduct[];
  productsPromotion: IProductPromotion[];
  showDetailProdcut: (item: IProduct) => void;
  handlerRemoveItemProduct: (code: string) => void;
}
const styles = StyleSheet.create({
  flexSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  textBtt: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  containerNodata: {
    height: 316,
  } as ViewStyle,
  iconImage: {
    width: 67,
    height: 75,
  } as ImageStyle,
  textDescNoDt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
});
