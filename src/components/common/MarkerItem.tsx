
import React ,{FC}from 'react'
import { TouchableOpacity,View,Text,Image } from 'react-native';
import { VisitListItemType } from '../../models/types';
import { useTheme } from '../../layouts/theme';
import { ImageAssets } from '../../assets';


interface MarkerItemProps {
    item: VisitListItemType;
    index: number;
    onPress:() =>void
  }

const MarkerItem: FC<MarkerItemProps> = ({item, index,onPress}) => {
    const theme = useTheme()
    const {colors} = theme
    return (
      <TouchableOpacity
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={onPress}>
        <Image
          source={ImageAssets.TooltipIcon}
          style={{width: 20, height: 20, marginBottom: -5}}
          resizeMode={'contain'}
          tintColor={colors.text_primary}
        />
        <Text style={{color: colors.bg_default, position: 'absolute', top: 0}}>
          {index + 1}
        </Text>
        <Image
          source={ImageAssets.MapPinFillIcon}
          style={{width: 32, height: 32}}
          tintColor={item.status ? colors.success : colors.warning}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };
  export default React.memo(MarkerItem)