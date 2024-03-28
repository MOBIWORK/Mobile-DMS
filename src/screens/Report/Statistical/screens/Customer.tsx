import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../../components/common';
import ItemNumber from '../components/ItemNumber';
import ItemCash from '../components/ItemCash';
import { StatisticsOrder, StatisticsOrderCustomer } from '../../../../models/types';
import { formatMoney } from '../../../../config/function';
import { useTranslation } from 'react-i18next';

const Customer = ({dataStatistics,data}:PropsType) => {
  const {t : getLabel} = useTranslation()

  const renderItem = (item :StatisticsOrderCustomer)=>{
    return (
      <Block colorTheme="white" borderRadius={12} marginTop={8} marginBottom={8}>
      <TouchableOpacity style={{paddingHorizontal :16 ,paddingVertical :12}}>
        <Text fontSize={16} fontWeight="500" colorTheme="text_primary">
          {item.customer}
        </Text>
        <Text fontSize={14} fontWeight="400" colorTheme="text_primary">
          {item.customer_code}
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
        <ItemNumber icon="NewCustomerIcon" content={dataStatistics?.total_customers} label={getLabel("numberCustomer")} />
        <ItemNumber icon="StatisticalIcon" content={dataStatistics?.total_items} label={getLabel("numberProduct")} />
      </Block>
      <ItemCash icon="MoneyIcon" content={dataStatistics?.sum_amount} label={getLabel("intoMoney")} />
      <Block marginTop={8} marginBottom={8}>
        <Text colorTheme="text_secondary">{getLabel("detail")}</Text>
      </Block>
      {data.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
    </ScrollView>
  );
};


type PropsType = {
  dataStatistics : StatisticsOrder | any,
  data : StatisticsOrderCustomer[]
}

export default React.memo(Customer, isEqual);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
