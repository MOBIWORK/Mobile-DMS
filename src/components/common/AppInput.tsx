import React, {FC, ReactNode, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {Text, TextInput} from 'react-native-paper';
import {ViewStyle} from 'react-native';
const AppInput: FC<AppInputProps> = ({
  styles,
  label,
  value,
  onChangeValue,
  rightIcon,
  isPassword,
  error,
  inputProp,
  disable,
  hiddenRightIcon,
}) => {
  const {colors} = useTheme();
  const [isFocus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TextInput
      contentStyle={{
        color: colors.text_primary,
        fontSize: 16,
      }}
      style={{
        backgroundColor: colors.bg_default,
        ...styles,
      }}
      outlineStyle={{
        borderColor: !isFocus ? colors.text_disable : 'rgba(99, 79, 145, 1)',
      }}
      mode={'outlined'}
      label={
        <Text
          style={{
            color: isFocus || value ? undefined : colors.text_disable,
            fontWeight: isFocus || value ? '600' : '400',
            fontSize: 16,
          }}>
          {label}
        </Text>
      }
      value={value}
      onChangeText={onChangeValue}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...inputProp}
      error={error}
      right={
        rightIcon ? (
          rightIcon
        ) : isPassword ? (
          <TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            color={colors.text_secondary}
            onPress={() => setShowPassword(!showPassword)}
          />
        ) : value && !hiddenRightIcon ? (
          <TextInput.Icon
            icon={'close-circle'}
            color={colors.bg_disable}
            onPress={() => (onChangeValue ? onChangeValue('') : null)}
          />
        ) : null
      }
      disabled={disable}
      secureTextEntry={isPassword && !showPassword}
      clearTextOnFocus={isPassword}
    />
  );
};
interface AppInputProps {
  label: string;
  value: string;
  onChangeValue?: (text: string) => void;
  rightIcon?: ReactNode;
  hiddenRightIcon?: boolean;
  isPassword?: boolean;
  styles?: ViewStyle;
  error?: boolean;
  inputProp?: any;
  disable?: boolean;
}
export default AppInput;
