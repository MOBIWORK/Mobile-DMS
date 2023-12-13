import {Image, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {ImageAssets} from '../../assets';
import React, {FC} from 'react';
import {useTheme} from '@react-navigation/native';

const FilterView: FC<FilterViewProp> = ({style, label, onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 120,
        ...style,
      }}>
      <Image
        source={ImageAssets.FilterIcon}
        style={{height: 16, width: 16}}
        resizeMode={'cover'}
      />
      <Text
        style={{
          color: colors.text_primary,
          marginLeft: 8,
        }}>
        {label ?? 'Bộ lọc khác'}
      </Text>
    </TouchableOpacity>
  );
};
interface FilterViewProp {
  style?: ViewStyle;
  label?: string;
  onPress: () => void;
}
export default FilterView;
