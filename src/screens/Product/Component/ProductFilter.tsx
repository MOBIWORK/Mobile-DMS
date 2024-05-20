import {Image, View} from 'react-native';
import {AppButton, AppHeader, AppInput} from '../../../components/common';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {TextInput} from 'react-native-paper';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

const ProductFilter: FC<ProductFilterProps> = ({
  bottomSheetRef,
  resetFilter,
  submitFilter,
  openDataFilter,
  brand,
  industry,
  groupItem,
}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  return (
    <View style={{padding: 16, height: '100%'}}>
      <AppHeader
        label={getLabel('filter')}
        onBack={() => bottomSheetRef.current && bottomSheetRef.current.close()}
        backButtonIcon={
          <Image
            source={ImageAssets.CloseIcon}
            style={{width: 28, height: 28}}
          />
        }
      />
      <View style={{marginTop: 32, rowGap: 24}}>
        <AppInput
          label={getLabel('groupProduct')}
          value={groupItem?.label || getLabel('all')}
          onPress={() => {
            openDataFilter(AppConstant.ProductFilterType.nhom_sp);
          }}
          editable={false}
          rightIcon={
            <TextInput.Icon
              onPress={() => {
                openDataFilter(AppConstant.ProductFilterType.nhom_sp);
              }}
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={colors.text_secondary}
            />
          }
        />
        <AppInput
          label={getLabel('brand')}
          value={brand?.label || getLabel('all')}
          onPress={() => {
            openDataFilter(AppConstant.ProductFilterType.thuong_hieu);
          }}
          editable={false}
          rightIcon={
            <TextInput.Icon
              onPress={() => {
                openDataFilter(AppConstant.ProductFilterType.thuong_hieu);
              }}
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={colors.text_secondary}
            />
          }
        />
        <AppInput
          label={getLabel('industry')}
          value={industry?.label || getLabel('all')}
          editable={false}
          onPress={() => {
            openDataFilter(AppConstant.ProductFilterType.nghanh_hang);
          }}
          rightIcon={
            <TextInput.Icon
              onPress={() => {
                openDataFilter(AppConstant.ProductFilterType.nghanh_hang);
              }}
              icon={'chevron-down'}
              style={{width: 24, height: 24}}
              color={colors.text_secondary}
            />
          }
        />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignSelf: 'center',
          marginBottom: 30,
        }}>
        <AppButton
          style={{width: '45%', backgroundColor: colors.bg_neutral}}
          label={getLabel('reset')}
          styleLabel={{color: colors.text_secondary}}
          onPress={() => resetFilter()}
        />
        <AppButton
          style={{width: '45%'}}
          label={getLabel('apply')}
          onPress={() => submitFilter()}
        />
      </View>
    </View>
  );
};
interface ProductFilterProps {
  bottomSheetRef: any;
  groupItem: any;
  openDataFilter: (type: string) => void;
  brand: any;
  industry: any;
  resetFilter: () => void;
  submitFilter: () => void;
}
export default ProductFilter;
