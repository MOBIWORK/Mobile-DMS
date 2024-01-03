import React, {FC} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Accordion, AppContainer,Block} from '../../../../components/common';
import {
  ReportInventoryType,
  ReportProductInventoryType,
} from '../../../../models/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';

const Inventory: FC<InventoryProps> = ({inventoryData}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {bottom} = useSafeAreaInsets();
  console.log(inventoryData,'a')
  const ProductItem = (productItem: ReportProductInventoryType) => {
    return (
      <Block paddingHorizontal={16} style={styles.productItemContainer}>
        <Block height={1}  colorTheme='border' marginTop={8} marginBottom={6}  />

        <View style={styles.productItem as ViewStyle}>
          <Text style={styles.productLeftLabel as ViewStyle}>{productItem.productName}</Text>
          <Text style={styles.productRightLabel}>x{productItem.count}</Text>
        </View>

        <Text style={styles.productRightLabel}>
          ĐVT: {'  '}
          <Text style={{color: theme.colors.text_primary}}>
            {productItem.unit}
          </Text>
        </Text>
      </Block>
    );
  };

  const InventoryItem = (inventoryItem: ReportInventoryType) => {

    return (
      <Accordion
        type='regular'
        containerStyle={{backgroundColor:theme.colors.bg_default}}
        title={`Ngày ${inventoryItem.dateTime.toString()}`}>
        <>
          {inventoryItem.listProduct.map((item, index) => {
            return <Block key={index} marginBottom={8} color={'white'}>{ProductItem(item)}</Block>;
          })}
        </>
      </Accordion>
    );
  };
  return (
    <AppContainer style={{marginBottom: bottom, marginTop: 16}}  >
      {inventoryData.map((item, index) => {
        return <View key={index}>{InventoryItem(item)}</View>;
      })}
    </AppContainer>
  );
};
interface InventoryProps {
  inventoryData: ReportInventoryType[];
}
export default Inventory;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    productItemContainer: {
      // paddingVertical: 16,
      rowGap: 10,
      // borderTopWidth: 1,
      // borderColor: theme.colors.border,
    },
    productItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    productLeftLabel: {
      color: theme.colors.text_primary,
      fontSize: 16,
      maxWidth: '80%',
      lineHeight: 24,
    },
    productRightLabel: {
      color: theme.colors.text_secondary,
      fontSize: 16,
    },
  });
