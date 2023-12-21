import React, {FC} from 'react';
import {AppHeader} from './index';
import {View, Text, Image, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
const AppCustomHeader: FC<AppCustomHeaderProps> = ({
  title,
  description,
  onBack,
  icon,
  styles,
}) => {
  const {colors} = useTheme();
  return (
    <View style={{...styles}}>
      <AppHeader onBack={onBack} />
      <View style={{margin: 8}}>
        <Text
          style={{
            color: colors.text_primary,
            fontSize: 24,
            fontWeight: '600',
            marginTop: 12,
          }}>
          {title}
        </Text>
        {description && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {icon && (
              <Image
                source={icon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
              />
            )}
            <Text
              style={{
                color: colors.text_secondary,
                fontSize: 16,
                lineHeight: 24,
                marginLeft: icon ? 4 : 0,
              }}>
              {description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
interface AppCustomHeaderProps {
  onBack: () => void;
  title: string;
  description?: string;
  icon?: any;
  styles?: ViewStyle;
}
export default AppCustomHeader;
