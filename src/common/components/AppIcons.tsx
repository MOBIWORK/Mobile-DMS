import React, {FC} from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AweIcons from 'react-native-vector-icons/FontAwesome';
import AweIcons5 from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MateriallIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {AppConstant} from '../../const';

export const AppIcons: FC<AppIconsProps> = ({
  iconType,
  name,
  size,
  color,
  onPress,
}) => {
  const RenderItem = (
    iconType1: string,
    name1: string,
    size1: number,
    color1?: string,
  ) => {
    switch (iconType1) {
      case AppConstant.ICON_TYPE.AweIcons: {
        return (
          <AweIcons
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.EntypoIcon: {
        return (
          <EntypoIcon
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.AntIcon: {
        return (
          <AntIcon
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.IonIcon: {
        return (
          <IonIcon
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.MateriallIcon: {
        return (
          <MateriallIcon
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.MaterialCommunity: {
        return (
          <MaterialCommunityIcons
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.AweIcons5: {
        return (
          <AweIcons5
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
      case AppConstant.ICON_TYPE.Feather: {
        return (
          <FeatherIcon
            name={name1}
            size={size1}
            color={color1 ?? 'black'}
            onPress={onPress}
          />
        );
      }
    }
  };
  return <>{RenderItem(iconType, name, size, color)}</>;
};

interface AppIconsProps {
  iconType: string;
  name: string;
  size: number;
  color?: string;
  onPress?: () => void;
}
