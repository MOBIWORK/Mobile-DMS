import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AppInput} from '../../../../components/common';
import {Keyboard, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProduct} from '../../../../models/types';
import {FC, useTransition} from 'react';
import {CommonUtils} from '../../../../utils';
import {RadioButton} from './RadioButton';

const UpdateProductItem: FC<UpdateProductItemProps> = ({
  productDetail,
  setProductDetail,
  onOpenBottomSheetData,
  isNotApplyPromotion,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const [_, startTransition] = useTransition();

  const [isPercentDiscount, setIsPercentDisCount] = useState<boolean>(
    (!productDetail?.discount_item_percent &&
      !productDetail?.discount_item_amount) ||
      productDetail?.discount_item_percent > 0,
  );

  const quantity = React.useRef<any>(
    productDetail && productDetail?.quantity ? productDetail?.quantity : 1,
  );

  const productDetailPrice = useMemo(() => {
    return productDetail && productDetail?.price ? productDetail.price : 0;
  }, [productDetail?.stock_uom]);

  const _renderDiscount = useCallback(() => {
    return (
      <View style={{gap: 12}}>
        <Text
          style={{color: colors.text_primary, fontWeight: '500', fontSize: 16}}>
          Chiết khấu sản phẩm
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 12,
          }}>
          <RadioButton
            selected={isPercentDiscount}
            handleSwitch={() => setIsPercentDisCount(true)}
          />
          <Text style={{color: colors.text_primary, fontWeight: '500'}}>
            % chiết khấu
          </Text>
        </View>
        {isPercentDiscount && (
          <AppInput
            label={getLabel('discount')}
            value={
              productDetail?.discount_item_percent
                ? productDetail.discount_item_percent.toString()
                : ''
            }
            onChangeValue={text =>
              setProductDetail({
                ...productDetail,
                // @ts-ignore
                discount_item_percent: text,
                discount_item_amount: 0,
              })
            }
            inputProp={{
              keyboardType: 'numeric',
              returnKeyType: 'done',
            }}
            rightIcon={
              <TextInput.Affix
                text="%"
                textStyle={{
                  color: colors.text_secondary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              />
            }
            onPress={() => Keyboard.dismiss()}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 12,
          }}>
          <RadioButton
            selected={!isPercentDiscount}
            handleSwitch={() => setIsPercentDisCount(false)}
          />
          <Text style={{color: colors.text_primary, fontWeight: '500'}}>
            Số tiền chiết khấu
          </Text>
        </View>
        {!isPercentDiscount && (
          <AppInput
            label={getLabel('discount')}
            value={
              productDetail?.discount_item_amount
                ? productDetail.discount_item_amount.toString()
                : ''
            }
            onChangeValue={text =>
              setProductDetail({
                ...productDetail,
                // @ts-ignore
                discount_item_amount: text,
                discount_item_percent: 0,
              })
            }
            inputProp={{
              keyboardType: 'numeric',
              returnKeyType: 'done',
            }}
            rightIcon={
              <TextInput.Affix
                text="VND"
                textStyle={{
                  color: colors.text_secondary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              />
            }
            onPress={() => Keyboard.dismiss()}
          />
        )}
      </View>
    );
  }, [isPercentDiscount, productDetail]);

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
        label={getLabel('availableInventory')}
        value={
          productDetail?.total_projected_qty
            ? productDetail.total_projected_qty.toString()
            : '0'
        }
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
            textStyle={{
              color: colors.text_secondary,
              fontSize: 12,
              fontWeight: '500',
            }}
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
        }}
      />
      {isNotApplyPromotion && _renderDiscount()}
    </View>
  );
};
interface UpdateProductItemProps {
  isNotApplyPromotion: boolean;
  productDetail: IProduct;
  setProductDetail: (item: IProduct) => void;
  onOpenBottomSheetData: (type: string) => void;
}
export default UpdateProductItem;
