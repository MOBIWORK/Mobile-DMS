import React, {FC} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {
  Accordion,
  AppContainer,
  Block,
  AppText as Text,
} from '../../../../components/common';
import {
  ReportInventoryType,
  ReportProductInventoryType,
} from '../../../../models/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../../utils';

const Inventory: FC<InventoryProps> = ({inventoryData}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {bottom} = useSafeAreaInsets();
  const {t: getLabel} = useTranslation();
  const ProductItem = (productItem: ReportProductInventoryType) => {
    return (
      <Block paddingHorizontal={16} style={styles.productItemContainer}>
        <Block height={1} colorTheme="border" marginTop={8} marginBottom={6} />

        <View style={styles.productItem as ViewStyle}>
          <Text style={styles.productLeftLabel as ViewStyle}>
            {`${productItem?.item_name ?? ''} - ${
              productItem?.item_code ?? ''
            }`}
          </Text>
          <Text style={styles.productRightLabel}>
            {productItem?.quanity ?? 0}
          </Text>
        </View>

        <Text style={styles.productRightLabel}>
          ĐVT: {'  '}
          <Text style={{color: theme.colors.text_primary}}>
            {productItem?.item_unit ?? ''}
          </Text>
        </Text>
      </Block>
    );
  };

  const InventoryItem = (inventoryItem: ReportInventoryType) => {
    return (
      <Accordion
        type="regular"
        containerStyle={{backgroundColor: theme.colors.bg_default}}
        title={`${getLabel('day')} ${
          inventoryItem?.creation
            ? CommonUtils.convertDate(inventoryItem.creation)
            : ''
        }`}>
        <>
          <Block
            direction="row"
            justifyContent="space-between"
            paddingHorizontal={16}
            paddingVertical={8}>
            <Text fontSize={16} fontWeight="500">
              {getLabel('product')}
            </Text>
            <Text fontSize={16} fontWeight="500">
              {getLabel('quantity')}
            </Text>
          </Block>
          {inventoryItem.items.map((item, index) => {
            return (
              <Block key={index} marginBottom={8} block color={'white'}>
                {ProductItem(item)}
              </Block>
            );
          })}
        </>
      </Accordion>
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
      rowGap: 10,
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
