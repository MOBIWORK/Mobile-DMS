import React, {FC} from 'react';
import {Image, View, ViewStyle} from 'react-native';
const AvatarAccessory: FC<AvatarAccessoryProps> = ({
  img,
  size,
  icon,
  borderColor,
  style,
}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: (size * 6) / 7,
            height: (size * 6) / 7,
            borderRadius: (size * 3) / 7,
            borderWidth: borderColor ? 3 : 0,
            borderColor: borderColor ?? null,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: img}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: (size * 3) / 7,
              position: 'relative',
            }}
            resizeMode={'cover'}
          />
        </View>

        {icon && (
          <Image
            source={icon}
            style={{
              width: size / 6,
              height: size / 6,
              position: 'absolute',
              bottom: (size * 7) / 60,
              right: size * 0.15,
            }}
            resizeMode={'cover'}
          />
        )}
      </View>
    </View>
  );
};
interface AvatarAccessoryProps {
  size: number;
  img: any;
  icon?: any;
  borderColor?: any;
  style?: ViewStyle;
}
export default AvatarAccessory;
