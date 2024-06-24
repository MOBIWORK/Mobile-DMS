import {StyleSheet} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../../../../../components/common';
import {calculateDateDifference} from '../../../../../config/function';
import isEqual from 'react-fast-compare';
import {INonCustomerDetailItem} from '../../../../../models/types';
type Props = {
  item: INonCustomerDetailItem;
};

const CardNonOrder = ({item}: Props) => {
  const formattedResult =
    item?.so_ngay_chua_dat_hang > 0
      ? calculateDateDifference(item.so_ngay_chua_dat_hang)
      : null;

  return (
    <Block
      colorTheme="white"
      borderRadius={12}
      marginTop={12}
      paddingVertical={12}
      paddingHorizontal={16}>
      <Block>
        <Text
          fontSize={16}
          colorTheme="text_primary"
          lineHeight={24}
          fontWeight="500">
          {item.ten_kh}
        </Text>
        <Text
          fontSize={14}
          colorTheme="text_primary"
          lineHeight={21}
          fontWeight="400">
          {item.ma_kh}
        </Text>
      </Block>
      <Block colorTheme="divider" height={1} marginTop={8} marginBottom={8} />
      <Block direction="row" justifyContent="space-between" alignItems="center">
        <Text
          fontSize={12}
          colorTheme={item?.dia_chi ? 'text_primary' : 'text_secondary'}
          fontWeight="500">
          Địa chỉ
        </Text>
        <Text>{item?.dia_chi ?? '---'}</Text>
      </Block>
      <Block
        direction="row"
        justifyContent="space-between"
        // alignItems="center"
        marginTop={8}>
        <Text fontSize={12} colorTheme="text_secondary" fontWeight="500">
          Lần đặt cuối
        </Text>
        <Block>
          <Text
            fontSize={14}
            colorTheme={
              item?.ngay_dat_hang_cuoi ? 'text_primary' : 'text_secondary'
            }
            fontWeight="400"
            textAlign="right">
            {item?.ngay_dat_hang_cuoi ?? '---'}
          </Text>
          {formattedResult && (
            <Block
              colorTheme="bg_neutral"
              alignItems="center"
              justifyContent="center"
              marginTop={8}
              paddingHorizontal={4}
              borderRadius={8}
              paddingVertical={8}>
              <Text fontSize={14} colorTheme="text_primary" fontWeight="400">
                {formattedResult}
              </Text>
            </Block>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(CardNonOrder, isEqual);

const styles = StyleSheet.create({});
