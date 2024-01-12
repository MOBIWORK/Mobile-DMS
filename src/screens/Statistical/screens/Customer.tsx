import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../components/common';
import ItemNumber from '../components/ItemNumber';
import ItemCash from '../components/ItemCash';
import ItemCard from '../components/ItemCard';
import { dataCustomer } from '../components/data';



const Customer = () => {
  return (
    <ScrollView style={styles.root}>
      <Block direction="row">
        <ItemNumber icon="NewCustomerIcon" content={15} label="Số khách hàng" />
        <ItemNumber icon="StatisticalIcon" content={15} label="Số sản phẩm" />
      </Block>
       <ItemCash  icon='MoneyIcon'   content={10000000} label='Thành tiền'  />
      <Block marginTop={8} marginBottom={8} >
        <Text colorTheme='text_secondary' >
          Chi tiết
        </Text>
      </Block>
     {dataCustomer.map((item,index) =>{
      return <ItemCard type='customer' key={index} item={item}  />
     })}
      {/* <ItemCard  type='customer' item={}    /> */}
    </ScrollView>
  );
};

export default React.memo(Customer, isEqual);

const styles = StyleSheet.create({
  root:{
    flex:1
  }
});
