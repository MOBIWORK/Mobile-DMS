import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {AppInput} from '../../../../components/common';
import {Keyboard, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProduct} from '../../../../models/types';
import {FC, useCallback, useState, useTransition} from 'react';
import {CommonUtils} from '../../../../utils';
import {useDeepCompareEffect} from '../../../../config/function';

const UpdateProductItem: FC<UpdateProductItemProps> = ({
  productDetail,
  setProductDetail,
  onOpenBottomSheetData,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const [isPending, startTransition] = useTransition();
  //
  const [discount_percent, setDiscountPercent] = useState<string>(
    productDetail?.discount_item_percent.toString() || '0',
  );
  const [discount_amount, setDiscountAmount] = useState<string>(
    productDetail?.discount_item_amount.toString() || '0',
  );
  const quantity = React.useRef<any>(
    productDetail && productDetail?.quantity ? productDetail?.quantity : 1,
  );

  const productDetailPrice = useMemo(() => {
    return productDetail && productDetail?.price ? productDetail.price : 0;
  }, [productDetail?.stock_uom]);

  const onChangeDiscount = useCallback(
    (
      discountPercent: number,
      discountAmount: number,
      quantity: any,
      productPrice: any,
    ) => {
      console.log('onChangeDiscount');
      if (
        discountPercent > 0 ||
        discountAmount > 0 ||
        quantity > 0 ||
        productPrice > 0
      ) {
        const new_discount_item_percent =
          discountPercent > 0
            ? discountPercent
            : discountAmount > 0
            ? (discountAmount * 100) / (productPrice * quantity)
            : 0;

        const new_discount_item_amount =
          discountAmount > 0
            ? discountAmount
            : discountPercent > 0
            ? (discountPercent * quantity * productPrice) / 100
            : 0;

        startTransition(() => {
          setDiscountPercent(new_discount_item_percent.toString());
          setDiscountAmount(new_discount_item_amount.toString());
          setProductDetail({
            ...productDetail,
            discount_item_percent: new_discount_item_percent,
            discount_item_amount: new_discount_item_amount,
          });
        });
      }
    },
    [
      productDetail,
      quantity,
      productDetail?.price,
      productDetail?.stock_uom,
      productDetailPrice,
      discount_percent,
      discount_amount,
    ],
  );

  useDeepCompareEffect(() => {
    onChangeDiscount(
      Number(discount_percent.replace(',', '.')),
      0,
      quantity.current,
      productDetailPrice,
    );
  }, [productDetailPrice]);

  return (
    <View style={{marginTop: 24, rowGap: 20, flex: 1}}>
      <AppInput
        label={getLabel('productCode')}
        value={productDetail?.item_code || ''}
        hiddenRightIcon
        disable
        styles={{backgroundColor: colors.bg_neutral}}
        onPress={() => Keyboard.dismiss()}
      />
      <AppInput
        label={getLabel('unit')}
        onPress={() => onOpenBottomSheetData('unit')}
        value={productDetail?.stock_uom || ''}
        hiddenRightIcon
        editable={false}
        rightIcon={
          <TextInput.Icon
            onPress={() => {
              Keyboard.dismiss();
              onOpenBottomSheetData('unit');
            }}
            icon={'chevron-down'}
            color={colors.text_secondary}
          />
        }
      />

      <AppInput
        label={getLabel('unitPrice')}
        value={
          productDetail?.price
            ? CommonUtils.formatCash(productDetailPrice.toString())
            : ''
        }
        hiddenRightIcon
        editable={false}
        styles={{backgroundColor: colors.bg_neutral}}
        rightIcon={
          <TextInput.Affix
            text="VND"
            textStyle={{color: colors.text_secondary, fontSize: 12}}
          />
        }
        onPress={() => Keyboard.dismiss()}
      />
      <AppInput
        label={getLabel('quantity')}
        value={productDetail?.quantity?.toString() || ''}
        onChangeValue={(txt: string) =>
          startTransition(() => {
            quantity.current = txt === '' ? 0 : parseInt(txt, 10);
            setProductDetail({
              ...productDetail,
              quantity: txt === '' ? 0 : parseInt(txt, 10),
            });
          })
        }
        hiddenRightIcon
        inputProp={{
          keyboardType: 'numeric',
          returnKeyType: 'done',
          onSubmitEditing: () => {
            onChangeDiscount(
              Number(discount_percent.replace(',', '.')),
              0,
              Number(quantity.current),
              productDetailPrice,
            );
          },
        }}
      />
      <AppInput
        label={getLabel('discountPercentage')}
        value={discount_percent}
        onChangeValue={(txt: string) =>
          startTransition(() => {
            setDiscountPercent(txt);
          })
        }
        // hiddenRightIcon
        rightIcon={<TextInput.Affix text="%" />}
        editable={!productDetail?.has_pricing_rule}
        styles={{
          backgroundColor: productDetail?.has_pricing_rule
            ? colors.bg_neutral
            : colors.bg_default,
        }}
        inputProp={{
          keyboardType: 'numeric',
          returnKeyType: 'done',
          onSubmitEditing: event => {
            const txt = event.nativeEvent.text;
            onChangeDiscount(
              Number(txt.replace(',', '.')),
              0,
              quantity.current,
              productDetailPrice,
            );
          },
        }}
      />
      <AppInput
        rightIcon={<TextInput.Affix text="VND" />}
        label={getLabel('discountAmount')}
        value={discount_amount}
        onChangeValue={(txt: string) =>
          startTransition(() => {
            setDiscountAmount(txt);
          })
        }
        // hiddenRightIcon

        editable={!productDetail?.has_pricing_rule}
        styles={{
          backgroundColor: productDetail?.has_pricing_rule
            ? colors.bg_neutral
            : colors.bg_default,
        }}
        inputProp={{
          keyboardType: 'numeric',
          returnKeyType: 'done',
          onSubmitEditing: event => {
            const txt = event.nativeEvent.text;
            onChangeDiscount(
              0,
              Number(txt.replace(',', '.')),
              quantity.current,
              productDetailPrice,
            );
          },
        }}
      />
    </View>
  );
};
interface UpdateProductItemProps {
  productDetail: IProduct;
  setProductDetail: (item: IProduct) => void;
  onOpenBottomSheetData: (type: string) => void;
}
export default UpdateProductItem;
