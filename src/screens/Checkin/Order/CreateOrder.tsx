import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppBottomSheet,
  AppButton,
  AppContainer,
  AppHeader,
  AppInput,
  AppIcons,
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
  IProduct,
  IProductPromotion,
  IResOrganization,
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
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';

const defautItem1 = {
  doctype: 'Sales Order Item',
  name: 'new-sales-order-item-earlpsogzi',
  child_docname: 'new-sales-order-item-earlpsogzi',
  parenttype: 'Sales Order',
  parent: 'new-sales-order-hnnkmtrehm',
  is_free_item: 0,
  conversion_factor: 1,
};

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
  const dataProductSelected = useSelector(state => state.product.dataSelected);
  const dataCheckin = useSelector(state => state.app.dataCheckIn);
  const customer = useSelector(state => state.order.customerOrder);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsPromotion, setProductsPromotion] = useState<
    IProductPromotion[]
  >([]);
  const [productDetail, setProductDetail] = useState<IProduct | any>();

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

  const totalPrice = useMemo(() => {
    let sum: number = 0;
    if (products.length > 0) {
      products.forEach(item => {
        if (item.total_item_money) {
          sum += item.total_item_money;
        }
      });
    }
    return sum;
  }, [products]);

  const total_Discount = useMemo(() => {
    const discountPercent = Number(percentageLabel.replace(',', '.'));
    if (products?.length > 0 && discountPercent > 0) {
      let sum: number = 0;
      if (discount.value === 'grand') {
        products.forEach(item => {
          sum += item.total_item_money;
        });
        return (sum * discountPercent) / 100;
      } else {
        products.forEach(item => {
          sum += item.price * item.quantity - item.discount_item_amount;
        });
        return (sum * discountPercent) / 100;
      }
    } else {
      return 0;
    }
  }, [products, discount]);

  useEffect(() => {
    updateDataProduct(products);
  }, [discount]);

  const total_VAT = useMemo(() => {
    let sum: number = 0;
    if (products.length > 0) {
      products.forEach(item => {
        if (item.total_item_tax) {
          sum += item.total_item_tax;
        }
      });
    }
    return sum;
  }, [products]);

  const total_Money = useMemo(() => {
    if (totalPrice > 0) {
      return totalPrice - total_Discount; //bởi vì VAT đã được bao gồm trong tổng giá của sp rồi nên không trừ ở đây nữa.
    } else {
      return 0;
    }
  }, [totalPrice, total_VAT, total_Discount]);

  const onBackScreen = () => {
    Keyboard.dismiss();
    if (customer) {
      dispatch(orderAction.setCustomerOder(null));
    }
    dispatch(productActions.updateProductSelect([]));
    navigation.goBack();
  };

  const completeCheckin = () => {
    Keyboard.dismiss();
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
    navigation.goBack();
  };

  const showDetailProdcut = (product: IProduct) => {
    setProductDetail(product);
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

  const onOpenBottonSheetData = (typeData: string) => {
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
            console.log('prooo', productDetail);
            const priceUom = productDetail.unit.find(
              (item1: any) => item1.uom === item.label,
            );
            console.log('itemLabel', item.price, priceUom);
            const newData = {
              ...productDetail,
              stock_uom: item.label,
              price: priceUom ? priceUom.conversion_factor * item.price : 0,
            };
            setProductDetail(newData);
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
      setDataWarehouse(newData);
      setWarehouse(newData[0]);
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  const fetchProductPromotion = async () => {
    if (dataProductSelected.length > 0) {
      const newItems = dataProductSelected.map((item: any) => ({
        ...defautItem1,
        item_code: item.item_code,
        uom: item.stock_uom,
        qty: item.quantity,
        stock_qty: item?.stock_qty ? item.stock_qty : item.quantity,
      }));
      const objecData = {
        items: newItems,
        customer: dataCheckin ? dataCheckin.item.customer_code : '', // Khách hàng
        territory: 'Vietnam',
        currency: 'VND',
        price_list: 'Standard Selling',
        price_list_currency: 'VND',
        company: userInfo.company,
        doctype: 'Sales Order',
        name: 'new-sales-order-hnnkmtrehm',
        transaction_date: CommonUtils.taskDate(date),
      };
      if (type === 'ORDER') {
        const {data: res, status}: KeyAbleProps =
          await ProductService.getPromotionalProducts(objecData);
        if (status === ApiConstant.STT_OK) {
          const result: any = res.result;
          const newDataSelected = dataProductSelected.map((item, index) => {
            const element = result[index];
            if (item.item_code === element.item_code) {
              if (element.free_item_data && element.free_item_data.length > 0) {
                setProductsPromotion(element.free_item_data);
              }
              if (element?.pricing_rule_for === 'Rate') {
                return {
                  ...item,
                  price: element.price_list_rate,
                  discount_item_percent: 0,
                  discount_item_amount: 0,
                  has_pricing_rule: element.has_pricing_rule,
                };
              } else if (element?.pricing_rule_for === 'Discount Percentage') {
                return {
                  ...item,
                  discount_item_percent: element.discount_percentage,
                  discount_item_amount:
                    (element.discount_percentage / 100) *
                    item.price *
                    item.quantity,
                  price: item.price,
                  has_pricing_rule: element.has_pricing_rule,
                };
              } else if (element?.pricing_rule_for === 'Discount Amount') {
                return {
                  ...item,
                  discount_item_percent:
                    (element.discount_amount / item.price / item.quantity) *
                    100,
                  discount_item_amount: element.discount_amount,
                  price: item.price,
                  has_pricing_rule: element.has_pricing_rule,
                };
              } else {
                return {
                  ...item,
                  discount_item_percent: 0,
                  discount_item_amount: 0,
                  has_pricing_rule: element.has_pricing_rule,
                };
              }
            } else {
              return item;
            }
          });
          updateDataProduct(newDataSelected);
        }
      } else {
        const newDataSelected = dataProductSelected.map(item => {
          return {
            ...item,
            discount_item_percent: 0,
            discount_item_amount: 0,
            has_pricing_rule: 0,
          };
        });
        updateDataProduct(newDataSelected);
      }
    }
  };

  const handlerRemoveItemProduct = (id: string) => {
    const newProducts = products.filter(item => item.item_code !== id);
    dispatch(productActions.updateProductSelect(newProducts));
    setProducts(newProducts);
  };

  const updateProductOrder = useCallback(() => {
    Keyboard.dismiss();
    if (productDetail) {
      const newProducts = products.map(item =>
        item.item_code === productDetail.item_code ? productDetail : item,
      );
      dispatch(productActions.updateProductSelect(newProducts));
    }
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
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
    let status: any = 0;
    const arrItems = products.map(item => ({
      item_code: item.item_code,
      qty: item.quantity,
      rate: item.price,
      uom: item.stock_uom,
      discount_percentage: item.discount_item_percent,
      item_tax_rate: item?.rate_tax_item ? item.rate_tax_item : 0,
      item_tax_template:
        item?.item_tax_template?.length > 0
          ? item.item_tax_template[0].item_tax_template
          : '',
    }));
    const objectData: any = {
      set_warehouse: warehouse?.value,
      apply_discount_on: discount.label,
      additional_discount_percentage: discount.discount_percentage,
      discount_amount: total_Discount,
      company: organization?.company_name,
      items: arrItems,
    };
    if (dataCheckin) {
      objectData.checkin_id = dataCheckin.checkin_id;
      objectData.customer = dataCheckin.customer_name;
    }
    if (customer) {
      objectData.customer = customer.customer_name;
    }

    switch (type) {
      case 'ORDER':
        objectData.delivery_date = new Date(date).getTime() / 1000;
        objectData.grand_total = total_Money;
        console.log('object', objectData);
        status = (await OrderService.createdOrder(objectData)).status;
        break;
      case 'RETURN_ORDER':
        objectData.grand_total = -total_Money;
        status = (await OrderService.createdReturnOrder(objectData)).status;
        break;
      default:
        break;
    }

    dispatch(appActions.setProcessingStatus(false));
    if (status === ApiConstant.STT_CREATED) {
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
      fetchProductPromotion();
    }
  }, [dataProductSelected]);

  const updateDataProduct = useCallback(
    (data: IProduct[]) => {
      if (data.length > 0) {
        const newProduct = data.map(item => {
          const intoMoney =
            item.price * item.quantity - item.discount_item_amount;
          if (item?.rate_tax_item > 0) {
            if (
              discount.discount_percentage > 0 &&
              discount.value === 'grand'
            ) {
              const VAT_item_amount = (item.rate_tax_item * intoMoney) / 100; //VAT = VAT * thành tiền
              return {
                ...item,
                total_item_tax: VAT_item_amount,
                total_item_money: intoMoney + VAT_item_amount,
              };
            } else if (
              discount.discount_percentage > 0 &&
              discount.value === 'net'
            ) {
              const VAT_item_amount =
                (item.rate_tax_item / 100) *
                (intoMoney - (intoMoney * discount.discount_percentage) / 100);
              // VAT(sp) = %VAT x (thành tiền - chiết khấu(net))
              return {
                ...item,
                total_item_tax: VAT_item_amount,
                total_item_money:
                  item.price * item.quantity +
                  VAT_item_amount -
                  item.discount_item_amount,
              };
            } else {
              const VAT_item_amount =
                (item.rate_tax_item *
                  (item.price * item.quantity - item.discount_item_amount)) /
                100; // VAT(sp) = %VAT x (thành tiền - chiết khấu sp)
              return {
                ...item,
                total_item_tax: VAT_item_amount,
                total_item_money:
                  item.price * item.quantity +
                  VAT_item_amount -
                  item.discount_item_amount,
              };
            }
          } else {
            return {
              ...item,
              total_item_tax: 0,
              total_item_money:
                item.price * item.quantity - item.discount_item_amount,
            };
          }
        });
        setProducts(newProduct);
      }
    },
    [products, discount],
  );

  return (
    <>
      <MainLayout style={styles.layout}>
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
                  onPress={() => setOpenDate(true)}
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
                onPress={() => onOpenBottonSheetData('warehouse')}
                rightIcon={
                  <TextInput.Icon
                    onPress={() => onOpenBottonSheetData('warehouse')}
                    icon={'chevron-down'}
                    color={colors.text_secondary}
                  />
                }
              />
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
                  products={products}
                  productsPromotion={productsPromotion}
                  showDetailProdcut={showDetailProdcut}
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
                  onPress={() => onOpenBottonSheetData('discount')}
                  rightIcon={
                    <TextInput.Icon
                      onPress={() => onOpenBottonSheetData('discount')}
                      icon={'chevron-down'}
                      color={colors.text_secondary}
                    />
                  }
                />
                <AppInput
                  value={percentageLabel}
                  label={getLabel('discountPercentage')}
                  onChangeValue={text => {
                    setPercentageLabel(text);
                  }}
                  inputProp={{
                    keyboardType: 'numeric',
                    returnKeyType: 'done',
                    onEndEditing: event => {
                      const txt = event.nativeEvent.text;
                      setDiscount((prev: any) => ({
                        ...prev,
                        discount_percentage: Number(txt.replace(',', '.')),
                      }));
                    },
                  }}
                  rightIcon={<TextInput.Affix text="%" />}
                />
                <AppInput
                  value={CommonUtils.convertToTwoDecimalPlaces(total_Discount)}
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
              </View>
            </View>

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
                  <Text style={styles.labelPay}>{getLabel('intoMoney')}</Text>
                  <Text style={styles.price}>
                    {totalPrice
                      ? CommonUtils.convertToTwoDecimalPlaces(totalPrice)
                      : 0}
                  </Text>
                </View>
                <View style={styles.flexSpace}>
                  <Text style={styles.labelPay}>{getLabel('discount')}</Text>
                  <Text style={styles.price}>
                    {CommonUtils.convertToTwoDecimalPlaces(total_Discount)}
                  </Text>
                </View>
                <View style={styles.flexSpace}>
                  <Text style={styles.labelPay}>VAT</Text>
                  <Text style={styles.price}>
                    {total_VAT
                      ? CommonUtils.convertToTwoDecimalPlaces(total_VAT)
                      : 0}
                  </Text>
                </View>
                <View style={[styles.flexSpace, {alignItems: 'flex-end'}]}>
                  <Text style={styles.labelPay}>{getLabel('totalPrice')}</Text>
                  <Text style={styles.totalPrice}>
                    {CommonUtils.convertToTwoDecimalPlaces(total_Money)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </AppContainer>

        <View style={styles.footerView}>
          <View
            style={[
              styles.flexSpace,
              {paddingVertical: 12, alignItems: 'flex-end'},
            ]}>
            <Text style={styles.tTotalPrice}>{getLabel('totalPrice')}</Text>
            <Text style={styles.totalPrice}>
              {CommonUtils.convertToTwoDecimalPlaces(total_Money)}
            </Text>
          </View>
          <AppButton
            label={getLabel('orderCreated')}
            style={styles.button}
            disabled={isDisabled}
            onPress={() => onCreatedOrder()}
          />
        </View>
      </MainLayout>

      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={['100%']}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{paddingHorizontal: 16, flex: 1}}>
          <AppHeader
            label={getLabel('product')}
            backButtonIcon={
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  bottomSheetRef.current?.close();
                }}>
                <Image
                  source={ImageAssets.CloseIcon}
                  style={{width: 28, height: 28}}
                />
              </TouchableOpacity>
            }
          />
          <UpdateProductItem
            productDetail={productDetail}
            setProductDetail={setProductDetail}
            onOpenBottonSheetData={onOpenBottonSheetData}
          />
          <View
            style={[
              styles.flexSpace,
              {
                marginTop: 36,
                position: 'absolute',
                alignSelf: 'center',
                bottom: AppConstant.HEIGHT * 0.07,
              },
            ]}>
            <AppButton
              style={{width: '49%', backgroundColor: colors.bg_neutral}}
              styleLabel={{color: colors.text_secondary}}
              label={getLabel('cancel')}
              onPress={() => {
                Keyboard.dismiss();
                bottomSheetRef.current && bottomSheetRef.current.close();
              }}
            />
            <AppButton
              style={{width: '49%'}}
              label={getLabel('update')}
              onPress={() => updateProductOrder()}
            />
          </View>
        </Pressable>
      </AppBottomSheet>

      <AppBottomSheet
        bottomSheetRef={bottomSheetWh}
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
    </>
  );
};

export default React.memo(CreateOrder, isEqual);

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 0,
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
