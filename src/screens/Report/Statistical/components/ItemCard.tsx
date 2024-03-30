import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import {Block, AppText as Text} from '../../../../components/common';
import {formatMoney} from '../../../../config/function';
import {ItemCardCustomer, ItemCardProduct} from './data';
import isEqual from 'react-fast-compare';
import { StatisticsOrderCustomer, StatisticsOrderProduct } from '../../../../models/types';

type Product = {
  item: StatisticsOrderProduct;
  type: 'product';
};
type Customer = {
  item: StatisticsOrderCustomer;
  type: 'customer';
};

type Props = Customer | Product;
const ItemCard = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  return (
    <Block colorTheme="white" borderRadius={12} marginTop={8} marginBottom={8}>
      <TouchableOpacity style={styles.containContent}>
        <Text fontSize={16} fontWeight="500" colorTheme="text_primary">
          {props.item.customer}
        </Text>
        <Text fontSize={12} fontWeight="400" colorTheme="text_primary">
          {props.item.customer_code}
        </Text>
        <Block height={1} marginTop={8} marginBottom={8} colorTheme="divider" />
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Text
            colorTheme="text_secondary"
            fontSize={12}
            fontWeight="500"
            lineHeight={18}>
            Số lượng
          </Text>
          <Text
            colorTheme="text_primary"
            fontSize={14}
            fontWeight="400"
            lineHeight={21}>
            {props.item.amount}
            {props.type === 'product' && <Text> {props.item.unit}</Text>}{' '}
          </Text>
        </Block>
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Text
            colorTheme="text_secondary"
            fontSize={12}
            fontWeight="500"
            lineHeight={18}>
            Thành tiền
          </Text>
          <Text
            colorTheme="text_primary"
            fontSize={14}
            fontWeight="400"
            lineHeight={21}>
            {formatMoney(props.item.total)} VNĐ
          </Text>
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

export default React.memo(ItemCard, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containContent: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    } as ViewStyle,
  });
