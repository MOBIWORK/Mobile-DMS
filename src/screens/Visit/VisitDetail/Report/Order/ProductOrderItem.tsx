import React, {FC, useState} from 'react';
import {
  FlatList,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ReportProductOrderType} from '../../../../../models/types';
import {ImageAssets} from '../../../../../assets';
import {CommonUtils} from '../../../../../utils';
import {AppAccordion} from '../../../../../components/common';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

const ProductOrderItem: FC<ProductOrderItemProps> = ({
  productData,
  promotionalData,
}) => {
  const {colors} = useTheme();
  const styles = createSheetStyles(useTheme());

  const [isPromotional, setIsPromotional] = useState<boolean>(false);

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
      <View style={[styles.row, style]}>
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

  const renderHeader = () => {
    return (
      <>
        {promotionalData.length === 0 ? (
          <Text
            style={{
              color: colors.text_primary,
              fontWeight: '500',
              fontSize: 16,
            }}>
            {`Sản phẩm(${productData.length})`}
          </Text>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={() => setIsPromotional(!isPromotional)}
              style={[
                styles.productHeader,
                {
                  backgroundColor: !isPromotional
                    ? 'rgba(196, 22, 28, 0.08)'
                    : undefined,
                },
              ]}>
              <Text
                style={{
                  color: !isPromotional
                    ? colors.primary
                    : colors.text_secondary,
                  fontWeight: '500',
                }}>
                {`Sản phẩm(${productData.length})`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPromotional(!isPromotional)}
              style={[
                styles.productHeader,
                {
                  backgroundColor: isPromotional
                    ? 'rgba(196, 22, 28, 0.08)'
                    : undefined,
                },
              ]}>
              <Text
                style={{
                  color: isPromotional ? colors.primary : colors.text_secondary,
                  fontWeight: '500',
                }}>
                {`Sản phẩm KM(${promotionalData.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderProductItem = (item: ReportProductOrderType) => {
    return (
      <View style={styles.productItemContainer}>
        <RowItem
          style={{
            justifyContent: 'flex-start',
          }}
          icon={ImageAssets.BarCodeIcon}
          iconStyles={styles.rowItemIcon}
          label={item.label}
        />
        <View style={styles.productRowItem}>
          <RowItem title={'Đơn vị tính'} label={item.unit} />
          <RowItem title={'Số lượng'} label={item.count.toString()} />
          <RowItem title={'Đơn giá'} label={item.price.toString()} />
          {item.discount_percent && item.discount_VND && (
            <>
              <RowItem
                title={'Chiết khấu(%)'}
                label={item.discount_percent.toString()}
              />
              <RowItem
                title={'Chiết khấu(VND)'}
                label={item.discount_VND.toString()}
              />
            </>
          )}
        </View>
        <RowItem
          title={'Thành tiền'}
          label={CommonUtils.convertNumber(7000000).toString()}
          titleStyle={{fontWeight: '500'}}
          labelStyle={{fontWeight: '500', fontSize: 16}}
        />
      </View>
    );
  };
  return (
    <AppAccordion titleInsideType title={'Sản phẩm'}>
      <View style={{rowGap: 10}}>
        {renderHeader()}
        <FlatList
          contentContainerStyle={{rowGap: 30}}
          data={isPromotional ? promotionalData : productData}
          renderItem={({item}) => renderProductItem(item)}
        />
      </View>
    </AppAccordion>
  );
};
interface ProductOrderItemProps {
  productData: ReportProductOrderType[];
  promotionalData: ReportProductOrderType[];
}
interface RowItemProps {
  style?: ViewStyle;
  title?: any;
  icon?: any;
  label: string;
  labelStyle?: TextStyle;
  titleStyle?: TextStyle;
  iconStyles?: ImageStyle;
}
export default ProductOrderItem;
const createSheetStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
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
    productHeader: {
      padding: 10,
      borderRadius: 16,
      width: '40%',
      alignItems: 'center',
    },
  });
