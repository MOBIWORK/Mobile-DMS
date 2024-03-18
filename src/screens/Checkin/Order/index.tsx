import React, {useEffect, useLayoutEffect, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppButton,
  AppContainer,
  AppHeader,
  AppIcons,
} from '../../../components/common';
import {ImageStyle, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Text} from 'react-native';
import {Button} from 'react-native-paper';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {ImageAssets} from '../../../assets';
import {Image} from 'react-native';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {ApiConstant, ScreenConstant} from '../../../const';
import {useTranslation} from 'react-i18next';
import {useSelector} from '../../../config/function';
import {OrderService} from '../../../services';
import {CheckinOrderDetail, KeyAbleProps} from '../../../models/types';
import {dispatch} from '../../../utils/redux';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallback from '../../../layouts/ErrorBoundary';
import {CommonUtils} from '../../../utils';
import {TouchableOpacity} from 'react-native';
import {ICON_TYPE} from '../../../const/app.const';
import {Pressable} from 'react-native';
import ItemProduct from './components/ItemProduct';
import { NavigationProp, RouterProp } from '../../../navigation/screen-type';

const CheckinOrder = () => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const styles = createSheetStyle(useTheme());
  const router = useRoute<RouterProp<'CHECKIN_ORDER'>>();
  const type = router.params.type;
  const dataCheckin = useSelector(state => state.app.dataCheckIn);
  const orderDetail = useSelector(state => state.checkin.orderDetail);
  const returnOrderDetail = useSelector(state => state.checkin.returnOrderDetail);
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const isForcus = useIsFocused();

  const fetchDataOrder = async () => {
    if (type == 'ORDER') {
      const {status, data}: KeyAbleProps = await OrderService.getDetailCheckinOrder({
          doctype : 'Sales Order',
          checkin_id: dataCheckin.checkin_id
        });
      if (status === ApiConstant.STT_OK) {
        if(Object.keys(data.result).length > 0) {
          dispatch(  checkinActions.setData({typeData: 'detailOrder', data: data.result}));
        }
      }
    }
    if (type == 'RETURN_ORDER') {
      const {status, data}: KeyAbleProps =  await OrderService.getDetailCheckinOrder({
          doctype : "Sales Invoice",
          checkin_id: dataCheckin.checkin_id
        });
      if (status === ApiConstant.STT_OK) {
        if(Object.keys(data.result).length > 0) {
          dispatch(  checkinActions.setData({typeData: 'returnOrder', data: data.result}));
        }

      }
    }
  };

  const renderNoDataUi = () => {
    return (
      <View style={{paddingHorizontal: 16, flex: 1}}>
        <AppContainer>
          <View>
            <View style={[styles.containerNodata as any]}>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={styles.iconImage}
                  source={ImageAssets.IconOrder}
                  resizeMode="cover"
                />
                <Text style={[styles.lableNoOr]}>
                  {type == 'ORDER'
                    ? getLabel('noOrder')
                    : getLabel('noReturnOrder')}
                </Text>
              </View>
              <View style={{marginTop: 16}}>
                <Button
                  style={{borderColor: colors.action}}
                  textColor={colors.action}
                  labelStyle={[styles.textBt]}
                  icon="plus"
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate(ScreenConstant.CHECKIN_ORDER_CREATE, {
                      type: type,
                    })
                  }>
                  {getLabel('orderCreated')}
                </Button>
              </View>
            </View>
          </View>
        </AppContainer>
        <AppButton
          label={getLabel('completed')}
          style={styles.footerBt}
          onPress={() => completeCheckin()}
        />
      </View>
    );
  };

  const renderDetailOrder = (data: CheckinOrderDetail) => {
    return (
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <AppContainer style={{marginTop: 16, paddingHorizontal: 16}}>
          <View style={{rowGap: 24, paddingBottom: 50}}>
            <View>
              <View style={{marginTop: 8, rowGap: 16}}>
                <View style={[styles.containerIfOd]}>
                  <View style={[styles.orderInforE, styles.flexSpace]}>
                    <Text style={[styles.labelDetail]}>
                      {getLabel('deliveryDate')}
                    </Text>
                    <Text style={[styles.textInforO]}>
                      {CommonUtils.convertDate(data.delivery_date * 1000)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.orderInforE,
                      styles.flexSpace,
                      {borderColor: colors.bg_default},
                    ]}>
                    <Text style={[styles.labelDetail]}>
                      {getLabel('eXwarehouse')}
                    </Text>
                    <Text style={[styles.textInforO]}>
                      {data?.set_warehouse}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View style={[styles.flexSpace]}>
                <Text style={[styles.textLabel]}>{getLabel('product')}</Text>
                <TouchableOpacity>
                  <AppIcons
                    iconType={ICON_TYPE.Feather}
                    name="chevron-down"
                    size={18}
                    color={colors.text_primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.containerOrder]}>
                {data?.list_items &&
                  data.list_items.map((item, index: any) => (
                    <Pressable key={index}>
                      <ItemProduct
                        dvt={item.uom}
                        name={item.item_name}
                        code={item.item_code}
                        quantity={item.qty}
                        price={item.amount}
                        percentage_discount={item.discount_percentage}
                        discount={(
                          item.amount *
                          (item.discount_percentage / 100)
                        ).toString()}
                      />
                    </Pressable>
                  ))}
              </View>
            </View>

            <View>
              <View style={[styles.flexSpace, {marginBottom: 8}]}>
                <Text style={[styles.textLabel]}>{getLabel('VAT')}</Text>
                <TouchableOpacity>
                  <AppIcons
                    iconType={ICON_TYPE.Feather}
                    name="chevron-down"
                    size={18}
                    color={colors.text_primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.containerIfOd,
                  {rowGap: 12, paddingVertical: 16},
                ]}>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('formVat')}
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {data?.taxes_and_charges}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('VAT')} (%){' '}
                  </Text>
                  <Text style={[styles.textInforO]}>{data?.rate}</Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('VAT')} (VND)
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {CommonUtils.formatCash(
                      data?.total_taxes_and_charges?.toString(),
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={[styles.flexSpace, {marginBottom: 8}]}>
                <Text style={[styles.textLabel]}>{getLabel('discount')}</Text>
                <TouchableOpacity>
                  <AppIcons
                    iconType={ICON_TYPE.Feather}
                    name="chevron-down"
                    size={18}
                    color={colors.text_primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.containerIfOd,
                  {rowGap: 12, paddingVertical: 16},
                ]}>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('typeDiscount')}
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {data?.apply_discount_on}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('discount')} (%){' '}
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {data?.additional_discount_percentage}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('discount')} (VND)
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {CommonUtils.formatCash(data?.discount_amount?.toString())}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={[styles.flexSpace, {marginBottom: 8}]}>
                <Text style={[styles.textLabel]}>{getLabel('detailPay')}</Text>
                <TouchableOpacity>
                  <AppIcons
                    iconType={ICON_TYPE.Feather}
                    name="chevron-down"
                    size={18}
                    color={colors.text_primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.containerIfOd,
                  {rowGap: 12, paddingVertical: 16},
                ]}>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('intoMoney')}
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {CommonUtils.formatCash(data.total?.toString())}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('discount')}
                  </Text>
                  <Text style={[styles.textInforO]}>
                    {CommonUtils.formatCash(data.discount_amount?.toString())}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>{getLabel('VAT')} </Text>
                  <Text style={[styles.textInforO]}>
                    {CommonUtils.formatCash(
                      data.total_taxes_and_charges?.toString(),
                    )}
                  </Text>
                </View>
                <View style={[styles.flexSpace]}>
                  <Text style={[styles.labelDetail]}>
                    {getLabel('totalPrice')}{' '}
                  </Text>
                  <Text style={[styles.totalPrice]}>
                    {CommonUtils.formatCash(data.grand_total?.toString())}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </AppContainer>

        <View style={styles.footerView}>
          <View style={[styles.flexSpace, {alignItems: 'flex-end'}]}>
            <Text style={styles.tTotalPrice}>{getLabel('totalPrice')}</Text>
            <Text style={styles.totalPrice}>
              {CommonUtils.formatCash(data.grand_total?.toString()) ||""}
            </Text>
          </View>
          <AppButton
            label={getLabel('completed')}
            style={styles.button}
            onPress={() => completeCheckin()}
          />
        </View>
      </ErrorBoundary>
    );
  };

  const completeCheckin = () => {
    const typ = type == 'ORDER' ? 'order' : 'return_order';
    const newData = categoriesCheckin.map(item =>
      item.key === typ ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    navigation.goBack();
  };

  useLayoutEffect(() => {
    if(isForcus){
      fetchDataOrder();
    }
  }, [isForcus]);

  return (
    <MainLayout style={styles.layout}>
      <AppHeader
        label={ type === 'ORDER' ? getLabel('putOrder') : getLabel('returnOrder')}
        onBack={() => navigation.goBack()}
        style={{paddingHorizontal: 16}}
      />
      {orderDetail && type == 'ORDER' ? renderDetailOrder(orderDetail) : returnOrderDetail && type == 'RETURN_ORDER' ? renderDetailOrder(returnOrderDetail) : renderNoDataUi()}
    </MainLayout>
  );
};

export default CheckinOrder;

const createSheetStyle = (theme: AppTheme) =>
  StyleSheet.create({
    footerView: {
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 16,
    } as ViewStyle,
    button: {
      width: '100%',
      marginVertical: 12,
    } as ViewStyle,
    layout: {
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 0,
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
      width: 68,
      height: 76,
    } as ImageStyle,
    lableNoOr: {
      marginTop: 8,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      color: theme.colors.text_disable,
    } as TextStyle,
    textBt: {
      marginTop: 8,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    } as TextStyle,
    footerBt: {
      width: '100%',
      marginBottom: 20,
    } as ViewStyle,
    iconInput: {
      width: 24,
      height: 24,
    } as ImageStyle,
    containerIfOd: {
      backgroundColor: theme.colors.bg_default,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 16,
    } as ViewStyle,
    textLabel: {
      color: theme.colors.text_secondary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    } as TextStyle,
    labelDetail: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      color: theme.colors.text_disable,
      marginBottom: 4,
    } as TextStyle,
    divCustomer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 8,
      borderRadius: 16,
    },
    inforCustomer: {
      color: theme.colors.text_primary,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    } as TextStyle,
    inforDesc: {
      color: theme.colors.text_primary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
    KHinforDesc: {
      color: theme.colors.text_primary,
      marginLeft: 6,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400',
    } as TextStyle,
    shadow: {
      shadowColor: '#919EAB',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
    },
    orderInforE: {
      borderColor: theme.colors.border,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    textInforO: {
      color: theme.colors.text_primary,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } as TextStyle,
    totalPrice: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    footerBttSheet: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingTop: 10,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignSelf: 'center',
    } as ViewStyle,
    footerDetail: {
      paddingVertical: 16,
      backgroundColor: theme.colors.bg_default,
      borderColor: theme.colors.border,
      borderTopWidth: 1,
    } as ViewStyle,
    itemPro: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    } as ViewStyle,
    containerOrder: {
      rowGap: 8,
      marginTop: 12,
    } as ViewStyle,
    tTotalPrice: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_secondary,
    } as TextStyle,
  });
