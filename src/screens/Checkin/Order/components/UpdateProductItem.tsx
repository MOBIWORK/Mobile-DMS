import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {AppInput} from '../../../../components/common';
import {Keyboard, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProduct} from '../../../../models/types';
import {FC, useTransition} from 'react';
import {CommonUtils} from '../../../../utils';

const UpdateProductItem: FC<UpdateProductItemProps> = ({
  productDetail,
  setProductDetail,
  onOpenBottomSheetData,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const [isPending, startTransition] = useTransition();

  const quantity = React.useRef<any>(
    productDetail && productDetail?.quantity ? productDetail?.quantity : 1,
  );

  const productDetailPrice = useMemo(() => {
    return productDetail && productDetail?.price ? productDetail.price : 0;
  }, [productDetail?.stock_uom]);

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
