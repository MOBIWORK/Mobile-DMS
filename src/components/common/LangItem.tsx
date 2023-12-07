import React, {FC} from 'react';
import {Image, TouchableOpacity, ViewStyle} from 'react-native';
import {ImageAssets} from '../../assets';
import {AppIcons} from './AppIcons';
import {AppConstant} from '../../const';
import {useTheme} from '@react-navigation/native';
const LangItem: FC<LangItemProps> = ({styles, flagSource, onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...styles,
      }}
      onPress={onPress}>
      <Image
        source={flagSource ?? ImageAssets.VNFLag}
        style={{width: 24, height: 16, marginRight: 8}}
        resizeMode={'cover'}
      />
      <AppIcons
        iconType={AppConstant.ICON_TYPE.EntypoIcon}
        name={'chevron-down'}
        size={16}
        color={colors.text_primary}
      />
    </TouchableOpacity>
  );
};
export default LangItem;
interface LangItemProps {
  onPress: () => void;
  flagSource?: string;
  styles?: ViewStyle;
}
