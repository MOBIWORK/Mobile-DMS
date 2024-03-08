import React, {FC, useEffect, useState} from 'react';
import {MainLayout} from '../../../../../layouts';
import {
  AppContainer,
  AppCustomHeader,
  Accordion,
  Block,
} from '../../../../../components/common';
import {
  ExtendedTheme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../../../navigation';
import {useTranslation} from 'react-i18next';
import {ImageAssets} from '../../../../../assets';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {CommonUtils} from '../../../../../utils';
import {
  IOrderDetailItem,
  ReportProductOrderType,
} from '../../../../../models/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProductOrderItem from './ProductOrderItem';
import {OrderService} from '../../../../../services';
import {ApiConstant} from '../../../../../const';

const ReportOrderDetail = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'REPORT_ORDER_DETAIL'>>();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = createSheetStyles(useTheme());
  const {t: getLabel} = useTranslation();
  const item = route.params.item;

  const [data, setData] = useState<IOrderDetailItem>();

  const getData = async () => {
    const res: any = await OrderService.getDetail(item.name);
    if (res?.status === ApiConstant.STT_OK) {
      setData(res.data.result);
    }
  };

  useEffect(() => {
    getData().then();
  }, [item]);

  const RowItem: FC<RowItemProps> = ({
    style,
    icon,
    title,
    iconStyles,
    titleStyle,
    labelStyle,
    label,
  }) => {
    return (
      <Block style={[styles.row as ViewStyle, style]}>
        {title ? (
          <Text
            style={{color: colors.text_secondary, fontSize: 16, ...titleStyle}}>
            {title}
          </Text>
        ) : (
          <Image
            source={icon}
            style={[styles.rowItemIcon, iconStyles]}
            resizeMode={'cover'}
          />
        )}
        <Text
          style={{
            color: colors.text_primary,
            marginLeft: 4,
            maxWidth: '90%',
            ...labelStyle,
          }}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {label}
        </Text>
      </Block>
    );
  };

  const _renderCustomer = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={{color: colors.text_secondary, fontWeight: '500'}}>
          {getLabel('customer')}
        </Text>
        <View style={styles.customerContainer}>
          <View style={styles.customerTitle}>
            <Text style={styles.label as ViewStyle}>Vinamilk - KH1234</Text>
          </View>
          <View style={{marginTop: 16, rowGap: 10}}>
            <RowItem
              style={{justifyContent: 'flex-start'}}
              icon={ImageAssets.UserCircle}
              label={'Chu quỳnh Anh'}
            />
            <RowItem
              style={{justifyContent: 'flex-start'}}
              icon={ImageAssets.MapPinIcon}
              label={'101 Tôn Dật Tiên, Tân Phú, Quận 7, Thành phố Hồ Chí Minh'}
            />
            <RowItem
              style={{justifyContent: 'flex-start'}}
              icon={ImageAssets.PhoneIcon}
              label={'+84 667 778 889'}
            />
          </View>
        </View>
      </View>
    );
  };

  const _renderOrderInfo = () => {
    const OrderInfoItem = () => {
      return (
        <Block
          colorTheme="bg_default"
          padding={4}
          borderRadius={16}
          paddingHorizontal={16}>
          <RowItem
            style={{paddingBottom: 8}}
            title={getLabel('deliveryDate')}
            label={
              data?.delivery_date
                ? CommonUtils.convertDate(data.delivery_date * 1000)
                : ''
            }
          />
          <RowItem
            style={{
              paddingTop: 8,
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
            title={getLabel('eXwarehouse')}
            label={data?.set_warehouse ?? 'Không'}
          />
        </Block>
      );
    };
    return (
      <Accordion type="nested" title={getLabel('orderInfor')}>
        <OrderInfoItem />
      </Accordion>
    );
  };

  const _renderVAT = () => {
    return (
      <Accordion type="nested" title={'VAT'}>
        <Block
          colorTheme="white"
          style={{rowGap: 8}}
          padding={4}
          borderRadius={16}>
          <RowItem
            title={getLabel('formVat')}
            label={data?.taxes_and_charges ?? 'Không'}
          />
          <RowItem
            title={'VAT(%)'}
            label={data?.total_taxes_and_charges.toString() ?? '0'}
          />
          <RowItem
            title={'VAT(VND)'}
            label={CommonUtils.convertNumber(100000).toString()}
          />
        </Block>
      </Accordion>
    );
  };

  const _renderDiscount = () => {
    return (
      <Accordion type="nested" title={getLabel('discount')}>
        <Block
          style={{rowGap: 6}}
          colorTheme="white"
          borderRadius={16}
          padding={4}>
          <RowItem
            title={getLabel('typeDiscount')}
            label={data?.apply_discount_on ?? 'Không'}
          />
          <RowItem
            title={'Chiết khấu(%)'}
            label={data?.additional_discount_percentage.toString() ?? '0'}
          />
          <RowItem
            title={`${getLabel('discount')}(VND)`}
            label={CommonUtils.convertNumber(
              data?.discount_amount ?? 0,
            ).toString()}
          />
        </Block>
      </Accordion>
    );
  };

  const _renderPayment = () => {
    const PayItem: FC<{label: string; price: number; isTotal?: boolean}> = ({
      label,
      price,
      isTotal,
    }) => {
      return (
        <Block
          style={[
            styles.rowItemContainer as ViewStyle,
            {justifyContent: 'space-between'},
          ]}>
          <Text style={{color: colors.text_secondary, fontSize: 16}}>
            {label}
          </Text>
          <Text
            style={{
              color: colors.text_primary,
              fontSize: isTotal ? 20 : 16,
              fontWeight: isTotal ? '500' : '400',
            }}>
            {CommonUtils.convertNumber(price)}
          </Text>
        </Block>
      );
    };
    return (
      <Accordion type="nested" title={getLabel('detailPay')}>
        <Block
          colorTheme="white"
          style={{rowGap: 10}}
          borderRadius={16}
          padding={16}>
          <PayItem
            label={getLabel('intoMoney')}
            price={data?.rounded_total ?? 0}
          />
          <PayItem
            label={getLabel('discount')}
            price={data?.discount_amount ?? 0}
          />
          <PayItem label={'VAT'} price={100000} />
          <PayItem
            label={getLabel('totalPrice')}
            price={data?.grand_total ?? 0}
            isTotal
          />
        </Block>
      </Accordion>
    );
  };

  return (
    <MainLayout style={{paddingHorizontal: 0}}>
      <AppCustomHeader
        styles={{flex: 1.5, paddingHorizontal: 16, marginBottom: 12}}
        onBack={() => navigation.goBack()}
        title={item.name}
        icon={ImageAssets.CalenderIcon}
        description={CommonUtils.convertDate(item.transaction_date)}
      />
      <Block flex={9} style={{backgroundColor: colors.bg_neutral}}>
        <AppContainer style={{marginBottom: bottom}}>
          <View
            style={{
              flex: 1,
              borderTopWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 16,
            }}>
            {_renderCustomer()}
            {_renderOrderInfo()}
            <ProductOrderItem
              productData={OrderProductData}
              promotionalData={OrderProductData}
            />
            {_renderVAT()}
            {_renderDiscount()}
            {_renderPayment()}
          </View>
        </AppContainer>
      </Block>
    </MainLayout>
  );
};
interface RowItemProps {
  style?: ViewStyle;
  title?: any;
  icon?: any;
  label: string;
  labelStyle?: TextStyle;
  titleStyle?: TextStyle;
  iconStyles?: ImageStyle;
}
export default ReportOrderDetail;

const createSheetStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    customerContainer: {
      marginTop: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
    },
    customerTitle: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
      marginLeft: 8,
    },
    label: {
      color: theme.colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 4,
    } as ViewStyle,
    rowItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    rowItemIcon: {width: 24, height: 24, tintColor: theme.colors.text_primary},
    productItemContainer: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    productRowItem: {
      rowGap: 10,
      marginVertical: 8,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
  });

const OrderProductData: ReportProductOrderType[] = [
  {
    id: 1,
    label: 'Sp-123',
    count: 10,
    unit: 'Cái',
    price: 700000,
    discount_percent: 3,
    discount_VND: 10000,
    total: 7000000,
  },
  {
    id: 2,
    label: 'Sp-123',
    count: 10,
    unit: 'Cái',
    price: 700000,
    discount_percent: null,
    discount_VND: null,
    total: 7000000,
  },
  {
    id: 3,
    label: 'Sp-123',
    count: 10,
    unit: 'Cái',
    price: 700000,
    discount_percent: null,
    discount_VND: null,
    total: 7000000,
  },
];
