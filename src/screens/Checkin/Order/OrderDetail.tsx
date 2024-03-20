import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageStyle,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {MainLayout} from '../../../layouts';
import AppContainer from '../../../components/AppContainer';

import {AppIcons} from '../../../components/common';
import {ICON_TYPE} from '../../../const/app.const';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {CheckinOrderDetail, ItemProductOrder} from '../../../models/types';
import {useTranslation} from 'react-i18next';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallback from '../../../layouts/ErrorBoundary';
import {CommonUtils} from '../../../utils';
import ItemProduct from '../../../components/Order/ItemProduct';

const OrderDetail = (data: CheckinOrderDetail) => {
  const {colors} = useTheme();
  const styles = createStyles(useTheme());
  const {t: getLabel} = useTranslation();

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <MainLayout style={styles.layout}>
        <AppContainer style={{paddingTop: 16}}>
          <View style={{paddingHorizontal: 16, rowGap: 24, paddingBottom: 50}}>
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
                  data.list_items.map((item: ItemProductOrder, index: any) => (
                    <Pressable key={index}>
                      <ItemProduct
                        dvt={item.uom}
                        name={item.item_code}
                        quantity={item.qty}
                        price={item.amount}
                        totalPrice={item.amount * item.qty}
                        percentage_discount={item.discount_percentage.toString()}
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
                    {CommonUtils.formatCash(data.grand_total?.toString() || '')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </AppContainer>

        <View style={styles.footerDetail}>
          <View
            style={[
              styles.flexSpace,
              {alignItems: 'flex-end', paddingHorizontal: 16},
            ]}>
            <Text style={[styles.textLabel]}>{getLabel('totalPrice')} :</Text>
            <Text style={[styles.totalPrice]}>
              {CommonUtils.formatCash(
                data?.grand_total ? data.grand_total.toString() : '',
              )}
            </Text>
          </View>
        </View>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default OrderDetail;

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 0,
    } as ViewStyle,
    iconInput: {
      width: 24,
      height: 24,
    } as ImageStyle,
    flexSpace: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
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
  });
