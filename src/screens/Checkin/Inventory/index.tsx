import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppBottomSheet,
  AppButton,
  AppContainer,
  AppHeader,
  AppIcons,
  AppInput,
  Block,
} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import {
  ImageStyle,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Image, TouchableOpacity} from 'react-native';
import {ImageAssets} from '../../../assets';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {NavigationProp} from '../../../navigation/screen-type';
import {ICON_TYPE} from '../../../const/app.const';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {useTranslation} from 'react-i18next';
import {mergeProducts, useSelector} from '../../../config/function';
import {IProduct} from '../../../models/types';
import {CommonUtils} from '../../../utils';
import {dispatch} from '../../../utils/redux';
import {productActions} from '../../../redux-store/product-reducer/reducer';
import {CheckinService} from '../../../services';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {DatePickerModal} from 'react-native-paper-dates';
import {shallowEqual} from 'react-redux';

const CheckinInventory = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel, i18n} = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRefDetail = useRef<BottomSheet>(null);
  const bottomSheetData = useRef<BottomSheet>(null);
  const styles = createStyles(useTheme());
  const snapPointsDetailPr = useMemo(() => ['100%'], []);
  const snapPointsData = useMemo(() => ['30%'], []);
  const [detailProduct, setDetailProduct] = useState<IProduct | any>();

  const products = useSelector(state => state.product.dataSelected);
  const listProducts = useSelector(
    state => state.product.listProductSelect,
    shallowEqual,
  );
  const dataCheckin = useSelector(state => state.app.dataCheckIn);

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const [labelBottonSheet, setLabelBottonSheet] = useState<string>('');
  const [dataBottomSheet, setDataBottomSheet] = useState<IFilterType[]>([]);
  const [openDate, setOpenDate] = useState<boolean>(false);
  const indexSelect = useRef<number>(0);
  const onBackScreen = () => {
    dispatch(productActions.updateListProduct([]));
    dispatch(productActions.updateProductSelect([]));
    navigation.goBack();
  };

  const isDisabled = useMemo(
    () => (products.length > 0 ? false : true),
    [products],
  );

  const updateProduct = () => {
    if (detailProduct && listProducts) {
      const data = listProducts.map((item, index) =>
        index === indexSelect.current &&
        item.item_code === detailProduct.item_code
          ? detailProduct
          : item,
      );
      dispatch(productActions.updateListProduct(data));
      const mergeProduct = mergeProducts(data);
      dispatch(productActions.updateProductSelect(mergeProduct));
    }
    if (bottomSheetRefDetail.current) {
      bottomSheetRefDetail.current.close();
    }
  };

  const onOpenBottonSheetData = (typeData: string) => {
    switch (typeData) {
      case 'unit':
        {
          setLabelBottonSheet('unit');
          if (detailProduct) {
            const units = detailProduct.unit;
            const newUnits: IFilterType[] = units.map((item1: any) => {
              return detailProduct.stock_uom === item1.uom
                ? {
                    label: item1.uom,
                    value: detailProduct.item_code,
                    isSelected: true,
                  }
                : {
                    label: item1.uom,
                    value: detailProduct.item_code,
                    isSelected: false,
                  };
            });
            setDataBottomSheet(newUnits);
          }
        }
        break;
      default:
        setDataBottomSheet([]);
        break;
    }
    if (bottomSheetData.current) {
      bottomSheetData.current.snapToIndex(0);
    }
  };

  const onChangeData = (item: IFilterType | any) => {
    switch (labelBottonSheet) {
      case 'unit':
        {
          if (detailProduct) {
            const newData = {...detailProduct, stock_uom: item.label};
            setDetailProduct(newData);
          }
        }
        break;

      default:
        break;
    }
    if (bottomSheetData.current) {
      bottomSheetData.current.close();
    }
  };

  const onSubmit = useCallback(async () => {
    if (products.length > 0) {
      const newItems = products.map(item => {
        const price = item.details.find(item2 => item2.uom == item.stock_uom);
        return {
          item_code: item.item_code,
          item_unit: item.stock_uom,
          quantity: item.quantity,
          exp_time: item.expiry ? new Date(item.expiry).getTime() / 1000 : null,
          item_price: price?.price_list_rate,
        };
      });
      const objectData = {
        checkin_id: dataCheckin.checkin_id,
        customer_code: dataCheckin.item.customer_code, //id khách hàng
        customer_id: dataCheckin.item.customer_name, //mã khách hàng
        customer_name: dataCheckin.item.name, //tên khách hàng
        customer_address: dataCheckin.item.customer_primary_address,
        inventory_items: newItems,
      };
      const response: any = await CheckinService.checkinInventory(objectData);
      if (response.status === ApiConstant.STT_CREATED) {
        dispatch(productActions.updateProductSelect([]));
        dispatch(productActions.setListProductSelect([]));
        dispatch(productActions.updateListProduct([]));
        completeCheckin();
      }
    }
  }, [dataCheckin, products]);

  const removeItem = (idx: number) => {
    const newProducts = listProducts.filter((item, index) => index !== idx);
    dispatch(productActions.updateListProduct(newProducts));
    dispatch(productActions.updateProductSelect(newProducts));
  };

  const renderItem = (item: IProduct, index: number) => {
    return (
      <Block>
        <Block
          paddingHorizontal={16}
          paddingVertical={12}
          colorTheme="bg_default"
          borderRadius={16}>
          <View style={[styles.flex as any, {columnGap: 5, paddingTop: 8}]}>
            <AppIcons
              iconType={ICON_TYPE.IonIcon}
              name="barcode-outline"
              size={20}
              color={colors.text_primary}
            />
            <Text
              style={[styles.nameProduct as any, {color: colors.text_primary}]}>
              {item.item_code}
            </Text>
          </View>
          <Text style={styles.nameProduct}>{item.item_name}</Text>
          <View style={[styles.flexSpace]}>
            <Text style={[styles.dateProduct]}>
              {CommonUtils.formatCash(item.price.toString())} đ
            </Text>
            <Text style={[styles.dateProduct]}>
              x{item.quantity}
              {`(${item.stock_uom})`}
            </Text>
          </View>
          <Block
            paddingTop={12}
            borderTopWidth={1}
            borderColor={colors.divider}
            borderStyle="dashed"
            marginTop={8}>
            <Text style={[styles.dateProduct]}>
              Hạn sử dụng :
              {item.expiry ? CommonUtils.convertDate(item.expiry) : ''}
            </Text>
          </Block>
        </Block>
        <TouchableOpacity
          style={[styles.removeIcon]}
          onPress={() => removeItem(index)}>
          <AppIcons
            iconType={AppConstant.ICON_TYPE.AweIcons}
            name="trash-o"
            size={22}
            color={colors.error}
          />
        </TouchableOpacity>
      </Block>
    );
  };

  const openBottonSheetDetail = (item: IProduct, index: number) => {
    indexSelect.current = index;
    setDetailProduct(item);
    if (bottomSheetRefDetail.current) {
      bottomSheetRefDetail.current.snapToIndex(0);
    }
  };

  const renderUiBottomSheetDetailProduct = React.useCallback(() => {
    return (
      <Block block height={AppConstant.HEIGHT}>
        <Pressable
          style={{height: AppConstant.HEIGHT * 0.9}}
          onPress={() => Keyboard.dismiss()}>
          <Block padding={16} paddingTop={0} block>
            <AppHeader
              label={getLabel('product')}
              onBack={() =>
                bottomSheetRefDetail.current &&
                bottomSheetRefDetail.current.close()
              }
              backButtonIcon={
                <Image
                  source={ImageAssets.CloseIcon}
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              }
            />
            <View style={{marginTop: 32, rowGap: 24}}>
              <AppInput
                label={getLabel('productCode')}
                value={detailProduct?.item_code || ''}
                editable={false}
                styles={{
                  backgroundColor: colors.bg_neutral,
                }}
                hiddenRightIcon
              />
              <AppInput
                label={getLabel('unit')}
                value={detailProduct?.stock_uom || ''}
                editable={false}
                onPress={() => onOpenBottonSheetData('unit')}
                rightIcon={
                  <TextInput.Icon
                    onPress={() => onOpenBottonSheetData('unit')}
                    icon={'chevron-down'}
                    style={{width: 24, height: 24}}
                    color={colors.text_secondary}
                  />
                }
              />
              <AppInput
                label={getLabel('quantity')}
                value={detailProduct?.quantity?.toString() || ''}
                hiddenRightIcon
                onChangeValue={(txt: string) =>
                  setDetailProduct({
                    ...detailProduct,
                    quantity: txt == '' ? 0 : parseInt(txt),
                  })
                }
                inputProp={{
                  keyboardType: 'numeric',
                }}
              />
              <AppInput
                label={getLabel('expired')}
                value={
                  detailProduct?.expiry
                    ? CommonUtils.convertDate(detailProduct.expiry)
                    : ''
                }
                editable={false}
                onPress={() => setOpenDate(true)}
                rightIcon={
                  <TextInput.Icon
                    icon={'calendar-month-outline'}
                    style={{width: 24, height: 24}}
                    color={colors.text_secondary}
                  />
                }
              />
            </View>
            <Block
              block
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              alignSelf={'center'}
              position={'absolute'}
              bottom={0}>
              <AppButton
                style={{
                  width: '45%',
                  backgroundColor: colors.bg_neutral,
                  height: 38,
                }}
                label={getLabel('cancel')}
                styleLabel={{color: colors.text_secondary}}
                onPress={() =>
                  bottomSheetRefDetail.current &&
                  bottomSheetRefDetail.current.close()
                }
              />
              <AppButton
                style={{width: '45%', height: 38}}
                label={getLabel('update')}
                onPress={updateProduct}
              />
            </Block>
          </Block>
        </Pressable>
      </Block>
    );
  }, [bottomSheetRefDetail.current]);

  const completeCheckin = () => {
    const newData = categoriesCheckin.map(item =>
      item.key === 'inventory' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    dispatch(productActions.setProductSelected([]));
    navigation.goBack();
  };

  const onDismissSingle = () => {
    setOpenDate(false);
  };

  const onConfirmSingle = (params: any) => {
    setOpenDate(false);
    const newDate = new Date(params.date ?? '');
    const newProduct: IProduct | any = {
      ...detailProduct,
      expiry: newDate.toISOString(),
    };
    setDetailProduct(newProduct);
  };

  useEffect(() => {
    Keyboard.dismiss();
  }, [products]);

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
      <AppHeader label={getLabel('inventoryControl')} onBack={onBackScreen} />

      {listProducts && listProducts.length > 0 && (
        <View
          style={[styles.flexSpace as any, {marginTop: 40, marginBottom: 8}]}>
          <Text style={[styles.titile as any, {color: colors.text_secondary}]}>
            {getLabel('listProduct')}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <IconButton
              style={{borderColor: colors.action, marginRight: 8}}
              mode="outlined"
              icon="plus"
              iconColor={colors.action}
              size={16}
              onPress={() => {
                dispatch(productActions.resetDataProduct());
                navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT, {
                  customer_code: dataCheckin.customer_code,
                });
              }}
            />
            <IconButton
              style={{borderColor: colors.action}}
              mode="outlined"
              icon="barcode-scan"
              iconColor={colors.action}
              size={16}
              onPress={() => console.log('Pressed')}
            />
          </View>
        </View>
      )}

      <AppContainer>
        {listProducts && listProducts?.length > 0 && (
          <View style={{rowGap: 16}}>
            {listProducts &&
              listProducts?.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openBottonSheetDetail(item, index)}
                  activeOpacity={0.5}>
                  {renderItem(item, index)}
                </TouchableOpacity>
              ))}
          </View>
        )}

        {listProducts && listProducts?.length == 0 && (
          <View style={[styles.containerNodata as any]}>
            <View style={{alignItems: 'center'}}>
              <Image
                style={[styles.iconImage]}
                source={ImageAssets.IconBill}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.textInventory as any,
                  {color: colors.text_disable, marginTop: 8},
                ]}>
                {getLabel('selectProductInvetory')}
              </Text>
            </View>
            <View style={[styles.flexSpace as any, {marginTop: 24}]}>
              <Button
                style={{
                  width: '45%',
                  marginRight: 16,
                  borderColor: colors.action,
                }}
                textColor={colors.action}
                labelStyle={[styles.textInventory as any, {fontWeight: '500'}]}
                icon="plus"
                mode="outlined"
                onPress={() => {
                  dispatch(productActions.resetDataProduct());
                  navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT, {
                    customer_code: dataCheckin.customer_code,
                  });
                }}>
                {getLabel('selectProduct')}
              </Button>
              <Button
                style={{width: '45%', borderColor: colors.action}}
                textColor={colors.action}
                labelStyle={[styles.textInventory as any, {fontWeight: '500'}]}
                icon="barcode-scan"
                mode="outlined"
                onPress={() => console.log('Pressed')}>
                {getLabel('scanCode')}
              </Button>
            </View>
          </View>
        )}
      </AppContainer>

      <AppButton
        disabled={isDisabled}
        label={getLabel('completed')}
        style={{
          width: '100%',
          marginBottom: 35,
          backgroundColor: isDisabled ? colors.bg_disable : colors.primary,
        }}
        onPress={() => onSubmit()}
      />
      <AppBottomSheet
        bottomSheetRef={bottomSheetRefDetail}
        snapPointsCustom={snapPointsDetailPr}>
        {renderUiBottomSheetDetailProduct()}
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={bottomSheetData}
        snapPointsCustom={snapPointsData}>
        <FilterListComponent
          title={getLabel(labelBottonSheet)}
          data={dataBottomSheet}
          onClose={() => {
            bottomSheetData.current && bottomSheetData.current.close();
            setDataBottomSheet([]);
          }}
          handleItem={onChangeData}
        />
      </AppBottomSheet>

      <DatePickerModal
        locale={i18n.language ?? 'vi'}
        mode="single"
        startYear={1900}
        visible={openDate}
        label={getLabel('selectDate')}
        onDismiss={onDismissSingle}
        date={new Date()}
        onConfirm={onConfirmSingle}
      />
    </MainLayout>
  );
};

export default CheckinInventory;

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    removeIcon: {
      position: 'absolute',
      top: 20,
      right: 20,
    } as ViewStyle,
    containerNodata: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    iconImage: {
      width: 67,
      height: 57,
    } as ImageStyle,
    textInventory: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } as TextStyle,
    titile: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    nameProduct: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    dateProduct: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
      color: theme.colors.text_primary,
    } as TextStyle,
    item: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    } as ViewStyle,
  });
