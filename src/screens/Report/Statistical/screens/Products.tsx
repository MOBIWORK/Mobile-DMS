import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {AppIcons, Block, AppText as Text} from '../../../../components/common';
import ItemNumber from '../components/ItemNumber';
import ItemCash from '../components/ItemCash';
import { StatisticsOrder, StatisticsOrderProduct } from '../../../../models/types';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatMoney } from '../../../../config/function';
import { ICON_TYPE } from '../../../../const/app.const';
import { useTheme } from '../../../../layouts/theme';

const Products = ({data,dataStatistics}:PropsType) => {
  const {t : getLabel} = useTranslation();
  const {colors} = useTheme();

  const renderItem = (item :StatisticsOrderProduct)=>{
    return (
      <Block colorTheme="white" borderRadius={12} marginTop={8} marginBottom={8}>
      <TouchableOpacity style={{paddingHorizontal :16 ,paddingVertical : 12}}>
        <View style={{flexDirection:"row", alignItems:"center" ,columnGap : 4 }} >
          <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' color={colors.text_secondary} size={18} />
          <Text fontSize={16} fontWeight="400" colorTheme="text_secondary">
            {item.item_code}
          </Text>
        </View>
      
        <Text fontSize={16} fontWeight="500" colorTheme="text_primary">
          {item.item_name}
        </Text>
        <Block height={1} marginTop={8} marginBottom={8} colorTheme="divider" />
        <Block direction="row" justifyContent="space-between" alignItems="center" >
          <Text colorTheme="text_secondary" fontSize={12} fontWeight="500" lineHeight={18}>
            {getLabel("quantity")}
          </Text>
          <Text colorTheme="text_primary" fontSize={14} fontWeight="400" lineHeight={21}>
            {item.qty}
          </Text>
        </Block>
        <Block direction="row" justifyContent="space-between" alignItems="center">
          <Text colorTheme="text_secondary" fontSize={12} fontWeight="500" lineHeight={18}>
            {getLabel("intoMoney")}
          </Text>
          <Text colorTheme="text_primary" fontSize={14} fontWeight="400" lineHeight={21}>
            {formatMoney(item.amount)} VNĐ
          </Text>
        </Block>
      </TouchableOpacity>
    </Block>
    )
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <Block direction="row">
        <ItemNumber icon="StatisticalIcon" content={dataStatistics?.total_items} label={getLabel("numberProduct")} />
        <ItemNumber icon="ReportOrder" content={dataStatistics?.total_qty} label={getLabel("quantityOrder")} />
      </Block>
      <ItemCash icon="MoneyIcon" content={dataStatistics?.sum_amount} label={getLabel("intoMoney")} />
      <Block marginTop={16} marginBottom={8}>
        <Text colorTheme="text_secondary">{getLabel("detail")}</Text>
      </Block>
      {data.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
      {/* <ItemCard  type='customer' item={}    /> */}
    </ScrollView>
  );
};



type PropsType = {
  dataStatistics : StatisticsOrder | any,
  data : StatisticsOrderProduct[]
}

export default React.memo(Products, isEqual);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
