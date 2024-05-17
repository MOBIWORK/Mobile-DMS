import {useTranslation} from 'react-i18next';
import {AppInput} from '../../../../components/common';
import {Keyboard, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProduct} from '../../../../models/types';
import {FC, useCallback, useEffect, useState} from 'react';
import {CommonUtils} from '../../../../utils';

const UpdateProductItem: FC<UpdateProductItemProps> = ({
  productDetail,
  setProductDetail,
  onOpenBottonSheetData,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();

  const [discount_percent, setDiscountPercent] = useState<string>('');
  const [discount_amount, setDiscountAmount] = useState<string>('');

  const onChangeDiscount = useCallback(
    (discountPercent: number, discountAmount: number) => {
      if (discountPercent > 0 || discountAmount > 0) {
        const new_discount_item_percent =
          discountPercent > 0
            ? discountPercent
            : (discountAmount * 100) / productDetail.price;
        const new_discount_item_amount =
          discountAmount > 0
            ? discountAmount
            : (discountPercent * productDetail.price) / 100;

        setDiscountPercent(new_discount_item_percent.toString());
        setDiscountAmount(
          CommonUtils.convertToTwoDecimalPlaces(new_discount_item_amount),
        );
        setProductDetail({
          ...productDetail,
          discount_item_percent: new_discount_item_percent,
          discount_item_amount: new_discount_item_amount,
        });
      }
    },
    [productDetail],
  );

  useEffect(() => {
    if (productDetail) {
      setDiscountPercent(productDetail?.discount_item_percent.toString());
      setDiscountAmount(productDetail?.discount_item_amount.toString());
    }
  }, [productDetail]);

  return (
    <View style={{marginTop: 24, rowGap: 20}}>
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
            ? CommonUtils.formatCash(productDetail.price.toString())
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
          setProductDetail({
            ...productDetail,
            quantity: txt === '' ? 0 : parseInt(txt, 10),
          })
        }
        hiddenRightIcon
        inputProp={{
          keyboardType: 'numeric',
          returnKeyType: 'done',
        }}
      />
      <AppInput
        label={getLabel('discountPercentage')}
        value={discount_percent}
        onChangeValue={(txt: string) => setDiscountPercent(txt)}
        hiddenRightIcon
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
            onChangeDiscount(Number(txt.replace(',', '.')), 0);
          },
        }}
      />
      <AppInput
        label={getLabel('discountAmount')}
        value={discount_amount}
        onChangeValue={(txt: string) => setDiscountAmount(txt)}
        hiddenRightIcon
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
            onChangeDiscount(0, Number(txt.replace(',', '.')));
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
