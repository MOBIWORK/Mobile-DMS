import React, {FC} from 'react';
import {
  Image,
  View,
  ViewStyle,
  ImageStyle,
  StyleSheet,
  StyleProp,
} from 'react-native';
const AvatarAccessory: FC<AvatarAccessoryProps> = ({
  img,
  size,
  icon,
  borderColor,
  style,
}) => {
  return (
    <View style={[styles.root, {...style}]}>
      <View style={styles.containContentStyle(size)}>
        <View style={styles.contentViewStyle(size, borderColor)}>
          <Image
            source={{uri: img}}
            style={styles.imageStyle(size)}
            resizeMode={'cover'}
          />
        </View>

        {icon && (
          <Image
            source={icon}
            style={styles.iconStyle(size)}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  containContentStyle: (size: number) =>
    ({
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    } as StyleProp<ViewStyle>),
  contentViewStyle: (size: number, borderColor: any) =>
    ({
      width: (size * 6) / 7,
      height: (size * 6) / 7,
      borderRadius: (size * 3) / 7,
      borderWidth: borderColor ? 3 : 0,
      borderColor: borderColor ?? null,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle),
  imageStyle: (size: number) =>
    ({
      width: '100%',
      height: '100%',
      borderRadius: (size * 3) / 7,
      position: 'relative',
    } as ImageStyle),
  iconStyle: (size: number) =>
    ({
      width: size / 6,
      height: size / 6,
      position: 'absolute',
      bottom: (size * 7) / 60,
      right: size * 0.15,
    } as ImageStyle),
});

export default AvatarAccessory;
