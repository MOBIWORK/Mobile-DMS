import React, {FC} from 'react';
import {Image, Text, View, ViewStyle} from 'react-native';
import {ImageAssets} from '../../../assets';
import {CommonUtils} from '../../../utils';
import {useTheme} from '@react-navigation/native';

const StatisticalItem: FC<StatisticalItemProps> = ({
  orderCount,
  payment,
  style,
}) => {
  const {colors} = useTheme();

  const Item: FC<ItemProps> = ({isRevenue, count}) => {
    return (
      <View
        style={{
          width: '48%',
          padding: 16,
          backgroundColor: colors.bg_default,
          borderRadius: 16,
        }}>
        <Image
          source={isRevenue ? ImageAssets.Statistical : ImageAssets.OrderIcon}
          style={{width: 40, height: 40}}
          resizeMode={'contain'}
        />
        <Text style={{color: colors.text_secondary, marginVertical: 8}}>
          {isRevenue ? 'Doanh thu trong tháng' : 'Số đơn trong tháng'}
        </Text>
        <Text
          style={{color: colors.text_primary, fontSize: 16, fontWeight: '500'}}>
          {CommonUtils.convertNumber(count)}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}>
      <Item isRevenue={false} count={orderCount} />
      <Item isRevenue={true} count={payment} />
    </View>
  );
};
interface StatisticalItemProps {
  orderCount: number;
  payment: number;
  style?: ViewStyle;
}
interface ItemProps {
  isRevenue: boolean;
  count: number;
}
export default StatisticalItem;
