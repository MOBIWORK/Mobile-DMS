import React, {FC, ReactNode, useState} from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Text,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from 'react-native';
import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '../../layouts/theme';
const AppInput: FC<AppInputProps> = ({
  styles,
  label,
  value,
  onChangeValue,
  rightIcon,
  isPassword,
  error,
  inputProp,
  disable = false,
  editable,
  hiddenRightIcon,
  onPress,
  isRequire = false,
  labelStyle,
  contentStyle,
  onEndEditing
  
}) => {
  const {colors} = useTheme();
  const [isFocus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const theme = useTheme();
  const inputStyle = rootStyles(theme);
  return (
    <TouchableOpacity disabled={disable} onPress={onPress}>
      <TextInput
        onPressIn={onPress}
        onEndEditing={onEndEditing}
        contentStyle={[inputStyle.contentStyle, contentStyle]}
        style={[inputStyle.rootStyle, styles]}
        outlineStyle={inputStyle.outlineStyle(isFocus)}
        mode={'outlined'}
        label={
          <Text
            style={{
              color: isFocus || value ? undefined : colors.text_disable,
              fontWeight: isFocus || value ? '600' : '400',
              fontSize: 16,
              ...labelStyle,
            }}>
            {label} {isRequire ? <Text style={{color: 'red'}}>*</Text> : null}
          </Text>
        }
        onChangeText={onChangeValue}
        value={value}
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
        clearTextOnFocus={false}
      />
    </TouchableOpacity>
  );
};
interface AppInputPropsBase {
  label: string;
  value: string;
  onPress?: () => void;
  onChangeValue?: (text: string) => void;
  rightIcon?: ReactNode;
  hiddenRightIcon?: boolean;
  isPassword?: boolean;
  styles?: ViewStyle;
  error?: boolean;
  inputProp?: TextInputProps;
  disable?: boolean;
  editable?: boolean;
  isRequire?: boolean;
  labelStyle?: TextStyle;
  contentStyle?: TextStyle;
}
type AppInputPropsEditable = {
  editable?: true;
  onEndEditing?:(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void
} & AppInputPropsBase;

type AppInputPropsNonEditable = {
  editable?: false;
  onEndEditing?:(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void
  listData?: any; // Adjust the type accordingly
  show?: boolean; // Adjust the type accordingly
} & AppInputPropsBase;
type AppInputProps = AppInputPropsEditable | AppInputPropsNonEditable;
export default React.memo(AppInput, isEqual);
const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    contentStyle: {
      color: theme.colors.text_primary,
      fontSize: 16,
    } as TextStyle,
    rootStyle: {
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    outlineStyle: (isFocus: boolean) => ({
      borderColor: !isFocus
        ? theme.colors.text_disable
        : 'rgba(99, 79, 145, 1)',
      borderRadius: 8,
    }),
  });
