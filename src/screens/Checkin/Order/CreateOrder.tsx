import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  AppBottomSheet,
  AppButton,
  AppContainer,
  AppHeader,
  AppInput,
  AppIcons,
  Block,
  AppDialog,
  AppCheckBox,
} from '../../../components/common';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthorizeParamsList} from '../../../navigation/screen-type';
import {
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {TextInput} from 'react-native-paper';
import {ICON_TYPE} from '../../../const/app.const';
import {Image} from 'react-native';
import {ImageAssets} from '../../../assets';
import {CommonUtils} from '../../../utils';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {ApiConstant, AppConstant} from '../../../const';
import {OrderService, ProductService} from '../../../services';
import {
  IOrderDetail,
  IProduct,
  IProductPromotion,
  IResOrganization,
  ItemProductOrder,
  IUser,
  KeyAbleProps,
} from '../../../models/types';
import {useSelector} from '../../../config/function';
import {useTranslation} from 'react-i18next';
import {dispatch} from '../../../utils/redux';
import {productActions} from '../../../redux-store/product-reducer/reducer';
import {useMMKVObject} from 'react-native-mmkv';
import {DatePickerModal} from 'react-native-paper-dates';
import {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import {orderAction} from '../../../redux-store/order-reducer/reducer';
import isEqual from 'react-fast-compare';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import ProductList from './components/ProductList';
import UpdateProductItem from './components/UpdateProductItem';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {shallowEqual} from 'react-redux';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';

const CreateOrder = () => {
  const navigation = useNavigation<NavigationProp<AuthorizeParamsList>>();
  const {colors} = useTheme();
  const styles = createSheetStyle(useTheme());
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetWh = useRef<BottomSheet>(null);
  const router =
    useRoute<RouteProp<AuthorizeParamsList, 'CHECKIN_ORDER_CREATE'>>();
  const type = router.params.type;
  const {t: getLabel, i18n} = useTranslation();
  const [isPending, startEffect] = useTransition();
  const userInfo: IUser = useSelector(state => state.app.userProfile);

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [isApplyPromotion, setApplyPromotion] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [organization, _] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );
  const [date, setDate] = useState<number>(new Date().getTime());
  const [DataWarehouse, setDataWarehouse] = useState<IFilterType[]>([]);
  const [dataDiscount, setDataDiscount] = useState<IFilterType[]>([
    {
      label: 'Grand Total',
      value: 'grand',
      isSelected: true,
    },
    {
      label: 'Net Total',
      value: 'net',
      isSelected: false,
    },
  ]);
  const dataProductSelected = useSelector(
    state => state.product.dataSelected,
    shallowEqual,
  );
  const dataCheckin = useSelector(state => state.app.dataCheckIn);
  const customer = useSelector(state => state.order.customerOrder);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsPromotion, setProductsPromotion] = useState<
    IProductPromotion[]
  >([]);
  const [orderResultData, setOrderResultData] = useState<IOrderDetail | null>(
    null,
  );

  const productDetail: any = useSelector(
    state => state.product.dataProductDetail,
  );

  const [dataCategorie, setDataCategorie] = useState<IFilterType[]>([]);
  const [toggleTab, setToggleTab] = useState<number>(1);
  const [labelBottonSheet, setLabelBottonSheet] = useState<string>('');

  const [warehouse, setWarehouse] = useState<IFilterType>();
  const [discount, setDiscount] = useState<{
    label: string;
    value: string;
    discount_percentage: number;
  }>({
    label: 'Grand Total',
    value: 'grand',
    discount_percentage: 0,
  });

  const [percentageLabel, setPercentageLabel] = useState<string>('');

  const onBackScreen = () => {
    Keyboard.dismiss();
    if (orderResultData) {
      setOpenDialog(true);
    } else {
      if (customer) {
        dispatch(orderAction.setCustomerOder(null));
      }
      dispatch(productActions.updateProductSelect([]));
      dispatch(productActions.resetDataProduct());
      dispatch(productActions.updateListProduct([]));
      navigation.goBack();
    }
  };

  const onDeleteOrder = async () => {
    setOpenDialog(false);
    dispatch(appActions.setProcessingStatus(true));
    const res: any = await OrderService.deleteOrder(
      orderResultData?.name ?? '',
      type === 'ORDER' ? 'Sales Order' : 'Sales Invoice',
    );
    if (res?.status === ApiConstant.STT_OK) {
      if (customer) {
        dispatch(orderAction.setCustomerOder(null));
      }
      dispatch(productActions.updateProductSelect([]));
      dispatch(productActions.resetDataProduct());
      dispatch(productActions.updateListProduct([]));
      navigation.goBack();
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  const onUpdateItemProduct = (item: ItemProductOrder[]) => {
    //update itemProduct
    const newProduct = products.map((productItem, index) => {
      const element = item[index];
      if (
        element.item_code === productItem.item_code &&
        element.is_free_item === 0
      ) {
        return {
          ...productItem,
          rate_tax_item: element?.item_tax_rate ?? 0,
          discount_item_percent: element?.discount_percentage ?? 0,
          discount_item_amount: element?.discount_amount ?? 0,
          price: element?.rate ?? 0,
          total_item_money: element?.amount ? Math.abs(element.amount) : 0,
        };
      } else {
        return productItem;
      }
    });
    setProducts(newProduct);

    //update Item Promotion
    if (type === 'ORDER') {
      const listPromotion: IProductPromotion[] = [];
      item.forEach(orderItem => {
        if (orderItem.is_free_item === 1) {
          listPromotion.push({
            item_name: orderItem.item_name,
            item_code: orderItem.item_code,
            rate: orderItem.rate,
            qty: orderItem.qty,
            uom: orderItem.uom,
          });
        }
      });
      setProductsPromotion(listPromotion);
    }
  };

  const completeCheckin = () => {
    Keyboard.dismiss();
    setOrderResultData(null);
    if (dataCheckin) {
      const newData =
        type === 'ORDER'
          ? categoriesCheckin.map(item =>
              item.key === 'order' ? {...item, isDone: true} : item,
            )
          : categoriesCheckin.map(item =>
              item.key === 'return_order' ? {...item, isDone: true} : item,
            );
      dispatch(checkinActions.setDataCategoriesCheckin(newData));
    }
    if (customer) {
      dispatch(orderAction.setCustomerOder(null));
    }
    dispatch(productActions.updateProductSelect([]));
    dispatch(productActions.resetDataProduct());
    dispatch(productActions.updateListProduct([]));

    navigation.goBack();
  };

  const showDetailProdcut = (product: IProduct) => {
    dispatch(productActions.setDataProductDetail(product));
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const toggleButtonUi = useCallback((tab: number, productKm: number) => {
    if (type === 'ORDER') {
      return (
        <View style={[styles.flexSpace, {marginBottom: 20}]}>
          <Pressable
            onPress={() => setToggleTab(1)}
            style={[styles.toggleBt(tab === 1)]}>
            <Text style={[styles.txTgBt(tab === 1)]}>Sản phẩm</Text>
          </Pressable>
          <Pressable
            onPress={() => setToggleTab(2)}
            style={[styles.toggleBt(tab === 2)]}>
            <Text style={[styles.txTgBt(tab === 2)]}>
              Sản phẩm KM ({productKm})
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return '';
    }
  }, []);

  const onOpenBottomSheetData = (typeData: string) => {
    switch (typeData) {
      case 'discount':
        setLabelBottonSheet('typeDiscount');
        setDataCategorie(dataDiscount);
        break;
      case 'warehouse':
        setLabelBottonSheet('warehouse');
        setDataCategorie(DataWarehouse);
        break;
      case 'unit':
        {
          setLabelBottonSheet('unit');
          if (productDetail) {
            const newUnits: IFilterType[] = productDetail.unit.map(
              (item1: any) => {
                return productDetail.stock_uom === item1.uom
                  ? {
                      label: item1.uom,
                      value: productDetail.item_code,
                      isSelected: true,
                    }
                  : {
                      label: item1.uom,
                      value: productDetail.item_code,
                      isSelected: false,
                    };
              },
            );
            setDataCategorie(newUnits);
          } else {
            setDataCategorie([]);
          }
        }
        break;
      default:
        setDataCategorie([]);
        break;
    }
    if (bottomSheetWh.current) {
      bottomSheetWh.current.snapToIndex(0);
    }
  };

  const onChangeData = (item: IFilterType | any) => {
    switch (labelBottonSheet) {
      case 'typeDiscount':
        {
          setDiscount((prev: any) => ({
            ...prev,
            label: item.label,
            value: item.value,
          }));
          const newData = dataDiscount.map(item1 =>
            item1.value === item.value
              ? {...item, isSelected: true}
              : {...item1, isSelected: false},
          );
          setDataDiscount(newData);
        }
        break;
      case 'warehouse':
        {
          setWarehouse(item);
          const newWhs = DataWarehouse.map(item1 =>
            item1.value == item.value
              ? {...item, isSelected: true}
              : {...item1, isSelected: false},
          );
          setDataWarehouse(newWhs);
        }
        break;
      case 'unit':
        {
          if (productDetail) {
            const priceUom = productDetail.unit.find(
              (item1: any) => item1.uom === item.label,
            );
            const newData = {
              ...productDetail,
              stock_uom: item.label,
              price: priceUom
                ? priceUom.conversion_factor * productDetail.price_default
                : 0,
            };
            dispatch(productActions.setDataProductDetail(newData));
          }
        }
        break;
      default:
        break;
    }
    if (bottomSheetWh.current) {
      setDataCategorie([]);
      bottomSheetWh.current.close();
    }
  };

  const fetchDataWarehouse = async () => {
    dispatch(appActions.setProcessingStatus(true));
    const res: KeyAbleProps = await ProductService.getWarehouse(
      userInfo.company,
    );
    if (Object.keys(res?.data?.result).length > 0) {
      const newData: IFilterType[] = res.data.result.map(
        (element: any, index: number) => {
          return {
            value: element.name,
            label: element.name,
            isSelected: index === 0,
          };
        },
      );
      startEffect(() => {
        setDataWarehouse(newData);
        setWarehouse(newData[0]);
      });
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  const handlerRemoveItemProduct = (id: string, index: number) => {
    const newProducts = products.filter(item => item.index !== index);
    dispatch(productActions.updateProductSelect(newProducts));
    setProducts(newProducts);
  };

  const updateProductOrder = useCallback(() => {
    Keyboard.dismiss();
    if (Object.keys(productDetail).length > 0) {
      const newProducts = products.map(item =>
        item.item_code === productDetail.item_code &&
        item.index === productDetail.index
          ? {
              ...productDetail,
              discount_item_percent: Number(
                productDetail?.discount_item_percent
                  .toString()
                  .replace(',', '.'),
              ),
            }
          : item,
      );
      setProducts(newProducts);
      dispatch(productActions.updateProductSelect(newProducts));
    }
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }

    dispatch(productActions.setDataProductDetail({}));
  }, [productDetail]);

  const isDisabled = useMemo(() => {
    return !warehouse || warehouse?.value === '' || products.length === 0;
  }, [warehouse, products]);

  const onConfirmSingle = React.useCallback<SingleChange>(
    params => {
      setOpenDate(false);
      const newDate = new Date(params.date ?? '');
      setDate(newDate.getTime());
    },
    [setOpenDate, setDate],
  );

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onCreatedOrder = async () => {
    dispatch(appActions.setProcessingStatus(true));
    const arrItems = products.map(item => ({
      item_code: item?.item_code,
      qty: item?.quantity,
      rate: item?.price,
      uom: item?.stock_uom,
      item_tax_template: item?.item_tax_template[0]?.item_tax_template ?? '',
      rate_tax_item: item?.rate_tax_item,
    }));
    const objectData: any = {
      set_warehouse: warehouse?.value,
      apply_discount_on: discount.label,
      additional_discount_percentage: percentageLabel
        ? Number(percentageLabel.replace(',', '.'))
        : 0,
      company: organization?.company_name,
      items: arrItems,
    };
    if (dataCheckin) {
      objectData.checkin_id = dataCheckin.checkin_id;
      objectData.customer = dataCheckin.name;
    }
    if (customer) {
      objectData.customer = customer.name;
    }
    // console.log('object', objectData);
    switch (type) {
      case 'ORDER':
        objectData.delivery_date = new Date(date).getTime() / 1000;
        if (!orderResultData) {
          const orderRes: any = await OrderService.createdOrder(objectData);
          if (orderRes?.status === ApiConstant.STT_CREATED) {
            setOrderResultData({
              ...orderRes.data.result?.detail_order,
              name: orderRes.data.result?.name,
            });
            onUpdateItemProduct(orderRes.data.result?.detail_order?.list_items);
          }
        }
        break;
      case 'RETURN_ORDER':
        if (!orderResultData) {
          const returnOrderRes: any = await OrderService.createdReturnOrder(
            objectData,
          );
          if (returnOrderRes?.status === ApiConstant.STT_CREATED) {
            setOrderResultData({
              ...returnOrderRes.data.result?.detail_invoice,
              name: returnOrderRes.data.result?.name,
            });
            onUpdateItemProduct(
              returnOrderRes.data.result?.detail_invoice?.list_items,
            );
          }
        }
        break;
      default:
        break;
    }
    dispatch(appActions.setProcessingStatus(false));
    if (orderResultData) {
      completeCheckin();
    }
  };

  useEffect(() => {
    fetchDataWarehouse();
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    if (dataProductSelected?.length === 0) {
      setPercentageLabel('');
    } else {
      setProducts(dataProductSelected);
    }
  }, [dataProductSelected]);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <AppHeader
        style={{paddingHorizontal: 16}}
        label={
          type === 'ORDER'
            ? getLabel('createOrder')
            : getLabel('createOrderReturn')
        }
        onBack={onBackScreen}
      />
      <AppContainer style={styles.appContainer}>
        <View style={{rowGap: 20, paddingHorizontal: 16}}>
          <View style={{rowGap: 20}}>
            {type === 'ORDER' && (
              <AppInput
                label={getLabel('deliveryDate')}
                value={CommonUtils.convertDate(date)}
                editable={false}
                styles={{
                  backgroundColor: orderResultData
                    ? colors.bg_neutral
                    : colors.bg_default,
                }}
                onPress={() => !orderResultData && setOpenDate(true)}
                rightIcon={
                  <TextInput.Icon
                    onPress={() => setOpenDate(true)}
                    icon={'calendar-month-outline'}
                    size={20}
                    color={colors.text_secondary}
                  />
                }
              />
            )}

            <AppInput
              label={
                type === 'ORDER'
                  ? getLabel('eXwarehouse')
                  : getLabel('imwarehouse')
              }
              value={warehouse?.label ? warehouse.label : ''}
              editable={false}
              styles={{
                backgroundColor: orderResultData
                  ? colors.bg_neutral
                  : colors.bg_default,
              }}
              onPress={() =>
                !orderResultData && onOpenBottomSheetData('warehouse')
              }
              rightIcon={
                <TextInput.Icon
                  onPress={() => onOpenBottomSheetData('warehouse')}
                  icon={'chevron-down'}
                  color={colors.text_secondary}
                />
              }
            />
            {type === 'ORDER' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 8,
                }}>
                <AppCheckBox
                  status={isApplyPromotion}
                  onChangeValue={() => setApplyPromotion(prev => !prev)}
                />
                <Text style={{color: colors.text_primary}}>
                  {getLabel('noApplyPromotion')}
                </Text>
              </View>
            )}
          </View>

          <View>
            <View style={styles.flexSpace}>
              <Text style={styles.titleSection}>{getLabel('product')}</Text>
              <TouchableOpacity>
                <AppIcons
                  name="chevron-down"
                  size={22}
                  iconType={ICON_TYPE.Feather}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.containerSection]}>
              {productsPromotion.length > 0 &&
                toggleButtonUi(toggleTab, productsPromotion.length)}
              <ProductList
                tab={toggleTab}
                customerId={router.params.data?.name ?? ''}
                products={products}
                productsPromotion={productsPromotion}
                showDetailProdcut={item =>
                  !orderResultData && showDetailProdcut(item)
                }
                isAddProduct={!orderResultData}
                handlerRemoveItemProduct={handlerRemoveItemProduct}
              />
            </View>
          </View>

          <View>
            <View style={styles.flexSpace}>
              <Text style={styles.titleSection}>Chiết khấu đơn</Text>
              <TouchableOpacity>
                <AppIcons
                  name="chevron-down"
                  size={22}
                  iconType={ICON_TYPE.Feather}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.containerSection,
                {paddingVertical: 20, rowGap: 20},
              ]}>
              <AppInput
                value={discount.label}
                label={getLabel('typeDiscount')}
                editable={false}
                styles={{
                  backgroundColor: orderResultData
                    ? colors.bg_neutral
                    : colors.bg_default,
                }}
                onPress={() =>
                  !orderResultData && onOpenBottomSheetData('discount')
                }
                rightIcon={
                  <TextInput.Icon
                    onPress={() =>
                      !orderResultData && onOpenBottomSheetData('discount')
                    }
                    icon={'chevron-down'}
                    color={colors.text_secondary}
                  />
                }
              />
              <AppInput
                value={
                  orderResultData
                    ? orderResultData?.additional_discount_percentage > 0
                      ? orderResultData.additional_discount_percentage.toString()
                      : '0'
                    : percentageLabel
                }
                label={getLabel('discountPercentage')}
                styles={{
                  backgroundColor: orderResultData
                    ? colors.bg_neutral
                    : colors.bg_default,
                }}
                editable={!orderResultData}
                onChangeValue={text => {
                  setPercentageLabel(text);
                }}
                inputProp={{
                  keyboardType: 'numeric',
                  returnKeyType: 'done',
                  // onEndEditing: event => {
                  //   const txt = event.nativeEvent.text;
                  //   setDiscount((prev: any) => ({
                  //     ...prev,
                  //     discount_percentage: Number(txt.replace(',', '.')),
                  //   }));
                  // },
                }}
                rightIcon={<TextInput.Affix text="%" />}
              />
              {orderResultData && (
                <AppInput
                  value={CommonUtils.convertToTwoDecimalPlaces(
                    orderResultData?.discount_amount ?? 0,
                  )}
                  label={getLabel('discountAmount')}
                  inputProp={{
                    keyboardType: 'number-pad',
                  }}
                  styles={{backgroundColor: colors.bg_neutral}}
                  editable={false}
                  rightIcon={
                    <TextInput.Affix text="VND" textStyle={{fontSize: 12}} />
                  }
                />
              )}
            </View>
          </View>

          {orderResultData && (
            <View style={{marginBottom: 50}}>
              <View style={styles.flexSpace}>
                <Text style={styles.titleSection}>{getLabel('detailPay')}</Text>
                <TouchableOpacity>
                  <AppIcons
                    name="chevron-down"
                    size={22}
                    iconType={ICON_TYPE.Feather}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.containerSection,
                  styles.shadow,
                  {paddingVertical: 16, rowGap: 12},
                ]}>
                <View style={styles.flexSpace}>
                  <Text style={styles.labelPay}>{getLabel('discount')}</Text>
                  <Text style={styles.price}>
                    {CommonUtils.convertToTwoDecimalPlaces(
                      orderResultData?.discount_amount
                        ? Math.abs(orderResultData?.discount_amount)
                        : 0,
                    )}
                  </Text>
                </View>
                <View style={styles.flexSpace}>
                  <Text style={styles.labelPay}>VAT</Text>
                  <Text style={styles.price}>
                    {CommonUtils.convertToTwoDecimalPlaces(
                      orderResultData?.total_taxes_and_charges
                        ? Math.abs(orderResultData.total_taxes_and_charges)
                        : 0,
                    )}
                  </Text>
                </View>
                <View style={[styles.flexSpace, {alignItems: 'flex-end'}]}>
                  <Text style={styles.labelPay}>{getLabel('intoMoney')}</Text>
                  <Text style={[styles.price, {fontWeight: '500'}]}>
                    {CommonUtils.convertToTwoDecimalPlaces(
                      orderResultData?.total
                        ? Math.abs(orderResultData.total)
                        : 0,
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </AppContainer>

      <View style={styles.footerView}>
        {orderResultData && (
          <Block
            paddingVertical={12}
            alignItems="flex-end"
            style={[styles.flexSpace]}>
            <Text style={styles.tTotalPrice}>{getLabel('totalPrice')}</Text>
            <Text style={styles.totalPrice}>
              {CommonUtils.convertToTwoDecimalPlaces(
                orderResultData?.grand_total
                  ? Math.abs(orderResultData.grand_total)
                  : 0,
              )}
            </Text>
          </Block>
        )}
        <AppButton
          label={orderResultData ? getLabel('completed') : getLabel('continue')}
          style={styles.button}
          disabled={isDisabled}
          onPress={() => onCreatedOrder()}
        />
      </View>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={['100%']}>
        {Object.keys(productDetail).length > 0 ? (
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{paddingHorizontal: 16, height: AppConstant.HEIGHT * 0.9}}>
            <AppHeader
              label={getLabel('product')}
              onBack={() => {
                Keyboard.dismiss();
                bottomSheetRef.current?.close();
                dispatch(productActions.setDataProductDetail({}));
              }}
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
            <UpdateProductItem
              isApplyPromotion={isApplyPromotion}
              productDetail={productDetail}
              setProductDetail={item =>
                dispatch(productActions.setDataProductDetail(item))
              }
              onOpenBottomSheetData={onOpenBottomSheetData}
            />
            <Block
              marginTop={36}
              position="absolute"
              alignSelf="center"
              bottom={0}
              block
              style={[styles.flexSpace]}>
              <AppButton
                style={{width: '49%', backgroundColor: colors.bg_neutral}}
                styleLabel={{color: colors.text_secondary}}
                label={getLabel('cancel')}
                onPress={() => {
                  Keyboard.dismiss();
                  bottomSheetRef.current && bottomSheetRef.current.close();
                  dispatch(productActions.setDataProductDetail({}));
                }}
              />
              <AppButton
                style={{width: '49%'}}
                label={getLabel('update')}
                onPress={() => updateProductOrder()}
              />
            </Block>
          </Pressable>
        ) : undefined}
      </AppBottomSheet>

      <AppBottomSheet
        bottomSheetRef={bottomSheetWh}
        // enableDynamicSizing={true}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: 50}}
          onLayout={handleContentLayout}>
          <FilterListComponent
            title={getLabel(labelBottonSheet)}
            data={dataCategorie}
            searchPlaceholder={getLabel('search')}
            onClose={() => {
              bottomSheetWh.current && bottomSheetWh.current.close();
              setDataCategorie([]);
            }}
            handleItem={onChangeData}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
      <DatePickerModal
        locale={i18n.language ?? 'vi'}
        mode="single"
        startYear={1900}
        visible={openDate}
        label={getLabel('selectDate')}
        onDismiss={onDismissSingle}
        date={new Date(date)}
        onConfirm={onConfirmSingle}
      />
      <AppDialog
        open={openDialog}
        errorType
        message={getLabel('confirmDeleteOrder')}
        closeLabel={getLabel('cancel')}
        submitLabel={getLabel('confirm')}
        buttonType={{width: 150}}
        showButton
        onClose={() => setOpenDialog(false)}
        onSubmit={() => onDeleteOrder()}
        modalType={{width: '90%'}}
      />
    </SafeAreaView>
  );
};

export default React.memo(CreateOrder, isEqual);

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    appContainer: {
      flex: 1,
      marginTop: 22,
    } as ViewStyle,
    titleSection: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_secondary,
    } as TextStyle,
    containerSection: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      marginTop: 8,
    } as ViewStyle,
    textBtt: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    containerNodata: {
      height: 316,
    } as ViewStyle,
    textDescNoDt: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      color: theme.colors.text_disable,
    } as TextStyle,
    iconImage: {
      width: 67,
      height: 75,
    } as ImageStyle,
    footerView: {
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      paddingBottom: 20,
    } as ViewStyle,
    button: {
      width: '100%',
      marginVertical: 12,
    } as ViewStyle,
    tTotalPrice: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_secondary,
    } as TextStyle,
    totalPrice: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    toggleBt: (active: boolean) =>
      ({
        alignContent: 'center',
        borderRadius: 24,
        paddingVertical: 10,
        backgroundColor: active
          ? 'rgba(196, 22, 28, 0.08)'
          : theme.colors.bg_default,
        width: '50%',
      } as ViewStyle),
    txTgBt: (active: boolean) =>
      ({
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        textAlign: 'center',
        color: active ? theme.colors.primary : theme.colors.text_disable,
      } as TextStyle),
    labelPay: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_secondary,
    } as TextStyle,
    price: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      color: theme.colors.text_primary,
    } as TextStyle,
    shadow: {
      shadowColor: '#919EAB',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 12,
    } as ViewStyle,
  });
