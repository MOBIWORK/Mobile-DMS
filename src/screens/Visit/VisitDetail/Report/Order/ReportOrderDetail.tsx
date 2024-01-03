import React, {FC} from 'react';
import {MainLayout} from '../../../../../layouts';
import {
  AppAccordion,
  AppContainer,
  AppCustomHeader,
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
import {ReportProductOrderType} from '../../../../../models/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProductOrderItem from './ProductOrderItem';

const ReportOrderDetail = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'REPORT_ORDER_DETAIL'>>();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = createSheetStyles(useTheme());
  const {t: getLabel} = useTranslation();
  const item = route.params.item;

  // const [productData, setProductData] = useState<ReportProductOrderType[]>([]);
  // const [promotionalData, setPromotionalData] = useState<ReportProductOrderType[]>([]);

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
      <View style={[styles.row as ViewStyle, style]}>
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
      </View>
    );
  };

  const _renderCustomer = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={{color: colors.text_secondary, fontWeight: '500'}}>
          Khách hàng
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
        <View>
          <RowItem
            style={{paddingBottom: 8}}
            title={'Ngày giao'}
            label={'28/11/2023'}
          />
          <RowItem
            style={{
              paddingTop: 8,
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
            title={'Kho xuất'}
            label={'Kho HN'}
          />
        </View>
      );
    };
    return (
      <AppAccordion titleInsideType={true} title={'Thông tin đơn'}>
        <OrderInfoItem />
      </AppAccordion>
    );
  };

  const _renderVAT = () => {
    return (
      <AppAccordion titleInsideType title={'VAT'}>
        <View style={{rowGap: 16}}>
          <RowItem title={'Biểu mẫu VAT'} label={'Biểu mẫu A'} />
          <RowItem title={'VAT(%)'} label={'5'} />
          <RowItem
            title={'VAT(VND)'}
            label={CommonUtils.convertNumber(100000).toString()}
          />
        </View>
      </AppAccordion>
    );
  };

  const _renderDiscount = () => {
    return (
      <AppAccordion titleInsideType title={'Chiết khấu'}>
        <View style={{rowGap: 16}}>
          <RowItem title={'Loại chiết khấu'} label={'Tổng tiền có VAT'} />
          <RowItem title={'Chiết khấu(%)'} label={'5'} />
          <RowItem
            title={'Chiết khấu(VND)'}
            label={CommonUtils.convertNumber(100000).toString()}
          />
        </View>
      </AppAccordion>
    );
  };

  const _renderPayment = () => {
    const PayItem: FC<{label: string; price: number; isTotal?: boolean}> = ({
      label,
      price,
      isTotal,
    }) => {
      return (
        <View
          style={[styles.rowItemContainer as ViewStyle, {justifyContent: 'space-between'}]}>
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
        </View>
      );
    };
    return (
      <AppAccordion titleInsideType={true} title={'Chi tiết thanh toán'}>
        <View style={{rowGap: 20}}>
          <PayItem label={'Thành tiền'} price={5000000} />
          <PayItem label={'Chiết khấu'} price={1000000} />
          <PayItem label={'VAT'} price={100000} />
          <PayItem label={'Tổng tiền'} price={4100000} isTotal />
        </View>
      </AppAccordion>
    );
  };

  return (
    <MainLayout style={{paddingHorizontal: 0}}>
      <AppCustomHeader
        styles={{flex: 1.5, paddingHorizontal: 16}}
        onBack={() => navigation.goBack()}
        title={item.label}
        icon={ImageAssets.CalenderIcon}
        description={`${item.time}, ${item.date}`}
      />
      <View style={{flex: 9, backgroundColor: colors.bg_neutral}}>
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
      </View>
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
    },
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
