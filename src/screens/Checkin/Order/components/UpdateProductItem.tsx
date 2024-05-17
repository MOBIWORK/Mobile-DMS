import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {AppInput} from '../../../../components/common';
import {Keyboard, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProduct} from '../../../../models/types';
import {FC, useCallback, useEffect, useState, useTransition} from 'react';
import {CommonUtils} from '../../../../utils';
import {formatCash} from '../../../../utils/commom.utils';
import {IFilterType} from '../../../../components/common/FilterListComponent';
import {useDeepCompareEffect} from '../../../../config/function';

const UpdateProductItem: FC<UpdateProductItemProps> = ({
  productDetail,
  setProductDetail,
  onOpenBottonSheetData,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const [isPending, startTransition] = useTransition();

  const [discount_percent, setDiscountPercent] = useState<string>(
    productDetail?.discount_item_percent.toString() || '',
  );
  const [discount_amount, setDiscountAmount] = useState<string>(
    productDetail?.discount_item_amount.toString() || '',
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
      if (
        discountPercent > 0 ||
        discountAmount > 0 ||
        quantity > 0 ||
        productPrice > 0
      ) {
        const new_discount_item_percent =
          discountPercent > 0
            ? discountPercent
            : (discountAmount * 100) / (productPrice * quantity);

        const new_discount_item_amount =
          discountAmount > 0
            ? discountAmount
            : (discountPercent * quantity * productPrice) / 100;

        startTransition(() => {
          setDiscountPercent(new_discount_item_percent.toString());
          setDiscountAmount(
            CommonUtils.convertToTwoDecimalPlaces(new_discount_item_amount),
          );
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
    ],
  );

  useDeepCompareEffect(() => {
    onChangeDiscount(
      Number(discount_percent.replace(',', '.')),
     0,
      quantity.current,
      productDetailPrice,
    );
    console.log('run deep')
  }, [productDetailPrice]);

  // useEffect(() => {
  //   if (productDetail) {
  //     setDiscountPercent(productDetail?.discount_item_percent.toString());
  //     setDiscountAmount(productDetail?.discount_item_amount.toString());
  //   }
  // }, [productDetail]);

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
        onPress={() => onOpenBottonSheetData('unit')}
        value={productDetail?.stock_uom || ''}
        hiddenRightIcon
        editable={false}
        rightIcon={
          <TextInput.Icon
            onPress={() => {
              Keyboard.dismiss();
              onOpenBottonSheetData('unit');
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
          onSubmitEditing: event => {
            const txt = event.nativeEvent.text;
            console.log(txt, 'txt');
            onChangeDiscount(
              Number(discount_percent.replace(',', '.')),

              // Number(discount_amount.replace(',', '.')),
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
  onOpenBottonSheetData: (type: string) => void;
}
export default UpdateProductItem;
