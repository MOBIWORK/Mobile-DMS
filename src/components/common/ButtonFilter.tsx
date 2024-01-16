import { Image, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { ImageAssets } from '../../assets';
import React, { FC } from 'react';
import { useTheme } from '@react-navigation/native';

const ButtonFilter: FC<FilterViewProp> = ({ style, label,value, onPress }) => {
    const { colors } = useTheme();
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
                ...style,
            }}>
            <Text style={{color: colors.text_secondary}}>
                {label ?? 'Trạng thái'} :
            </Text>
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={{
                    color: colors.text_primary,
                    marginLeft: 8,
                    maxWidth :"55%",
                }}>
                {value ?? 'Tất cả'}
            </Text>
        </TouchableOpacity>
    );
};
interface FilterViewProp {
    style?: ViewStyle;
    label?: string;
    value? :string
    onPress: () => void;
}
export default ButtonFilter;
