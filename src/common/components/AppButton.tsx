import React, {FC, memo} from 'react';
import {
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import {Colors} from '../../assets';

const AppButton: FC<AppButtonProps> = ({
  disabled,
  style,
  styleLabel,
  label,
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style, disabled && [styles.bgDisable]]}
      disabled={disabled}
      onPress={onPress}>
      {children ?? <Text style={[styles.label, styleLabel]}>{label}</Text>}
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
    color: Colors.white,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  bgDisable: {
    backgroundColor: '#C4CDD5',
    borderWidth: 0,
  },
  buttonContainer: {
    backgroundColor: '#C4161C',
    width: 148,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
