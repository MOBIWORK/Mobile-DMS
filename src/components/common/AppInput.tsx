import React, {FC, ReactNode, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {Text, TextInput} from 'react-native-paper';
import {TextStyle, ViewStyle} from 'react-native';
import { Colors } from '../../assets';
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
  editable,
  hiddenRightIcon,
  onPress,
  isRequire=false,
  labelStyle,
  contentStyle
  isRequire=false,
  labelStyle,
  contentStyle
}) => {
  const {colors} = useTheme();
  const [isFocus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
    <TextInput
      onPressIn={onPress}
      contentStyle={{
        color: colors.text_primary,
        fontSize: 16,
        ...contentStyle
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
            ...labelStyle
          }}>
          {label} {isRequire ? <Text style={{color:'red'}}>*</Text> :null}
        </Text>
      }
      defaultValue={value}
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
      editable={editable}
      disabled={disable}
      secureTextEntry={isPassword && !showPassword}
      clearTextOnFocus={isPassword}
    />
    </>
  );
};
interface AppInputProps {
  label: string;
  value: string;
  onPress?: () => void;
  onChangeValue?: (text: string) => void;
  rightIcon?: ReactNode;
  hiddenRightIcon?: boolean;
  isPassword?: boolean;
  styles?: ViewStyle;
  error?: boolean;
  inputProp?: any;
  disable?: boolean;
  editable?: boolean;
  isRequire?:boolean
  labelStyle?:TextStyle;
  contentStyle?:TextStyle;
}

export default AppInput;
