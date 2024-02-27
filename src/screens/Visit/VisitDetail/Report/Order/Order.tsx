import React, {FC} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {ImageAssets} from '../../../../../assets';
import {ReportOrderItemType} from '../../../../../models/types';
import StatisticalItem from '../../StatisticalItem';
import {useTranslation} from 'react-i18next';
const Order: FC<OrderProps> = ({orderData, handleItem}) => {
  const {colors} = useTheme();
  const styles = createStyleSheet(useTheme());
  const {t: getLabel} = useTranslation();

  const OrderItem = (item: ReportOrderItemType, index: number) => {
    return (
      <Pressable
        onPress={() => handleItem(item)}
        style={[
          styles.itemContainer as ViewStyle,
          {borderBottomWidth: index === orderData.length - 1 ? 0 : 1},
        ]}>
        <View style={{rowGap: 5}}>
          <Text style={styles.text as TextStyle}>DH-22344</Text>
          <View style={styles.itemTitle as any}>
            <Image
              source={ImageAssets.CalenderIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
            />
            <Text style={{color: colors.text_secondary, marginLeft: 4}}>
              20/11/2023
            </Text>
          </View>
        </View>
        <Text style={styles.text as TextStyle}>6.000.000</Text>
      </Pressable>
    );
  };

  return (
    <View style={{marginTop: 32}}>
      <StatisticalItem orderCount={15} payment={10000000} />
      <View style={styles.listProduct as ViewStyle}>
        <Text style={{color: colors.text_secondary}}>
          {getLabel('listOrder')}
        </Text>
        <FlatList
          style={{marginTop: 16}}
          showsVerticalScrollIndicator={false}
          data={orderData}
          renderItem={({item, index}) => OrderItem(item, index)}
        />
      </View>
    </View>
  );
};
interface OrderProps {
  orderData: ReportOrderItemType[];
  handleItem: (item: ReportOrderItemType) => void;
}
export default Order;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 16,
      marginTop: 16,
      borderColor: theme.colors.border,
    },
    itemTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    text: {
      color: theme.colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
    },
    listProduct: {
      borderRadius: 16,
      marginTop: 16,
      backgroundColor: theme.colors.bg_default,
      padding: 16,
      maxHeight: '70%',
    },
  });
