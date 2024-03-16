import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';
import {Colors} from '../../../assets';
import {useTheme} from '@react-navigation/native';

const ProfileItem: FC<ProfileItemProps> = ({
  style,
  label,
  labelStyle,
  image,
  imageProps,
  onPress,
  content,
  rightComponent,
  disabled,
}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '80%',
          }}>
          {image && (
            <Image
              source={image}
              style={{
                height: 24,
                width: 24,
                tintColor: colors.text_secondary,
                ...imageProps,
              }}
              resizeMode="contain"
            />
          )}
          <View
            style={{
              alignItems: 'flex-start',
              marginHorizontal: image ? 16 : 0,
            }}>
            <Text
              style={[
                styles.label,
                {color: colors.text_primary, ...labelStyle},
              ]}>
              {label}
            </Text>
            {Boolean(content) && (
              <Text
                style={styles.content}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {content}
              </Text>
            )}
          </View>
        </View>
        {rightComponent && rightComponent}
      </View>
    </TouchableOpacity>
  );
};

interface ProfileItemProps {
  style?: object;
  label: string;
  labelStyle?: any;
  image?: ImageSourcePropType;
  imageProps?: any;
  onPress?: () => void;
  disabled?: boolean;
  content?: string;
  rightComponent?: any;
}

export default ProfileItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '400',
    fontSize: 16,
  },
  content: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.gray_400,
    marginTop: 4,
    maxWidth: 250,
  } as TextStyle,
});
