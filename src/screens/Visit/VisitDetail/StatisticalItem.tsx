import React, {FC} from 'react';
import {Image, Text, ViewStyle} from 'react-native';
import {ImageAssets} from '../../../assets';
import {CommonUtils} from '../../../utils';
import {useTheme} from '@react-navigation/native';
import {Block} from '../../../components/common';
import {useTranslation} from 'react-i18next';

const StatisticalItem: FC<StatisticalItemProps> = ({
  orderCount,
  payment,
  style,
}) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();

  const Item: FC<ItemProps> = ({isRevenue, count}) => {
    return (
      <Block
        width="45%"
        // block
        height="100%"
        borderRadius={20}
        colorTheme="bg_default"
        padding={16}
        marginHorizontal={16}>
        <Image
          source={isRevenue ? ImageAssets.Statistical : ImageAssets.OrderIcon}
          style={{width: 40, height: 40}}
          resizeMode={'contain'}
        />
        <Text style={{color: colors.text_secondary, marginVertical: 8}}>
          {isRevenue ? getLabel('haveToPay') : getLabel('billCount')}
        </Text>
        <Text
          style={{color: colors.text_primary, fontSize: 16, fontWeight: '500'}}>
          {CommonUtils.convertNumber(count)}
        </Text>
      </Block>
    );
  };

  return (
    <Block
      style={{...style}}
      direction="row"
      alignItems="center"
      justifyContent="space-around">
      <Item isRevenue={false} count={orderCount} />
      <Item isRevenue={true} count={payment} />
    </Block>
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
