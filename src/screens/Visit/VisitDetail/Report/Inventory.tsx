import React, {FC} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {AppAccordion, AppContainer} from '../../../../components/common';
import {
  ReportInventoryType,
  ReportProductInventoryType,
} from '../../../../models/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Inventory: FC<InventoryProps> = ({inventoryData}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {bottom} = useSafeAreaInsets();
  const ProductItem = (productItem: ReportProductInventoryType) => {
    return (
      <View style={styles.productItemContainer}>
        <View style={styles.productItem}>
          <Text style={styles.productLeftLabel}>{productItem.productName}</Text>
          <Text style={styles.productRightLabel}>x{productItem.count}</Text>
        </View>

        <Text style={styles.productRightLabel}>
          DVT: {'  '}
          <Text style={{color: theme.colors.text_primary}}>
            {productItem.unit}
          </Text>
        </Text>
      </View>
    );
  };

  const InventoryItem = (inventoryItem: ReportInventoryType) => {
    return (
      <AppAccordion
        titleInsideType={false}
        title={`Ngày ${inventoryItem.dateTime.toString()}`}>
        <>
          {inventoryItem.listProduct.map((item, index) => {
            return <View key={index}>{ProductItem(item)}</View>;
          })}
        </>
      </AppAccordion>
    );
  };
  return (
    <AppContainer style={{marginBottom: bottom, marginTop: 16}}>
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
      paddingVertical: 16,
      rowGap: 10,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
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
      color: theme.colors.text_primary,
      fontSize: 16,
    },
  });
