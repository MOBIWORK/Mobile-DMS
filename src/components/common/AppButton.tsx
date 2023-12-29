import React, {FC, memo} from 'react';
import {
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import {useTheme} from '@react-navigation/native';

const AppButton: FC<AppButtonProps> = ({
  disabled,
  style,
  styleLabel,
  label,
  children,
  onPress,
}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        disabled && [styles.bgDisable],
        {backgroundColor: colors.primary},
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      {children ?? (
        <Text style={[styles.label, {color: colors.bg_default}, styleLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export interface AppButtonProps {
  disabled?: boolean;
  style?: ViewStyle;
  styleLabel?: TextStyle;
  label?: string;
  onPress: () => void;
  children?: JSX.Element;
}

export default memo(AppButton);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 24,
  } as TextStyle,
  bgDisable: {
    backgroundColor: '#C4CDD5',
    borderWidth: 0,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
