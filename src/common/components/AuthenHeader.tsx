import React, {FC} from 'react';
import {AppHeader} from './index';
import {View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
const AuthenHeader: FC<AuthenHeaderProps> = ({title, description, onBack}) => {
  const {colors} = useTheme();
  return (
    <>
      <AppHeader onBack={onBack} />
      <View style={{margin: 8}}>
        <Text
          style={{
            color: colors.text_primary,
            fontSize: 24,
            fontWeight: '600',
            marginTop: 24,
          }}>
          {title}
        </Text>
        {description && (
          <Text
            style={{
              color: colors.text_secondary,
              marginTop: 12,
              fontSize: 16,
              lineHeight: 24,
            }}>
            {description}
          </Text>
        )}
      </View>
    </>
  );
};
interface AuthenHeaderProps {
  onBack: () => void;
  title: string;
  description?: string;
}
export default AuthenHeader;
