import {StyleSheet} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../components/common';
import ItemNumber from '../components/ItemNumber';
import ItemCash from '../components/ItemCash';



const Customer = () => {
  return (
    <Block marginTop={24} block>
      <Block direction="row">
        <ItemNumber icon="NewCustomerIcon" content={15} label="Số khách hàng" />
        <ItemNumber icon="StatisticalIcon" content={15} label="Số sản phẩm" />
      </Block>
       <ItemCash  icon='MoneyIcon'   content={10000000} label='Thành tiền'  />
      <Block marginTop={8} >
        <Text colorTheme='text_secondary' >
          Chi tiết
        </Text>
      </Block>
    </Block>
  );
};

export default React.memo(Customer, isEqual);

const styles = StyleSheet.create({});
