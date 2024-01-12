import {StyleSheet} from 'react-native';
import React from 'react';
import {
  Block,
  AppText as Text,
} from '../../.././components/common/index';
import {calculateDateDifference} from '../../../config/function';
import { IDataNonOrderCustomer } from './ultil';
import isEqual from 'react-fast-compare';
type Props = {
    item:IDataNonOrderCustomer
};

const CardNonOrder = ({item}: Props) => {
  const result = calculateDateDifference(item.lastTimeOrder);
  const formattedResult =
    result.years > 0
      ? `${result.years} năm`
      : result.months > 0
      ? `${result.months} tháng`
      : `${result.days} ngày`;
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
          {item.nameCompany}
        </Text>
        <Text
          fontSize={14}
          colorTheme="text_primary"
          lineHeight={21}
          fontWeight="400">
          {item.customerCode}
        </Text>
      </Block>
      <Block colorTheme="divider" height={1} marginTop={8} marginBottom={8} />
      <Block direction="row" justifyContent="space-between" alignItems="center">
        <Text fontSize={12} colorTheme="text_secondary" fontWeight="500">
          Địa chỉ
        </Text>
        <Text>{item.address === '' ?  '---' : item.address}</Text>
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
          <Text fontSize={14} colorTheme="text_primary" fontWeight="400" textAlign='right'>
            {item.lastTimeOrder}
          </Text>
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
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(CardNonOrder,isEqual);

const styles = StyleSheet.create({});
