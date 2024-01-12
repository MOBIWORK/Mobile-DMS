import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../components/common';
import ItemNumber from '../components/ItemNumber';
import ItemCash from '../components/ItemCash';
import ItemCard from '../components/ItemCard';
import { dataProduct } from '../components/data';




const Products = () => {
  return (
    <ScrollView style={styles.root}>
    <Block direction="row">
      <ItemNumber icon="StatisticalIcon" content={15} label="Số sản phẩm" />
      <ItemNumber icon="ReportOrder" content={200} label="Số lượng đặt" />
    </Block>
     <ItemCash  icon='MoneyIcon'   content={10000000} label='Thành tiền'  />
    <Block marginTop={8} marginBottom={8} >
      <Text colorTheme='text_secondary' >
        Chi tiết
      </Text>
    </Block>
   {dataProduct.map((item,index) =>{
    return <ItemCard type='product' key={index} item={item}  />
   })}
    {/* <ItemCard  type='customer' item={}    /> */}
  </ScrollView>
  )
}

export default React.memo(Products,isEqual)

const styles = StyleSheet.create({
  root:{
    flex:1
  }
});