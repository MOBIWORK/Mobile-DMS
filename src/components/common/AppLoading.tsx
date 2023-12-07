import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../assets';

const AppLoading: React.FC<AppLoadingProps> = ({style, size, color}) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator size={size ?? 'large'} color={color ?? Colors.white} />
  </View>
);

interface AppLoadingProps {
  style?: ViewStyle;
  size?: number | 'large' | 'small';
  color?: ColorValue;
}

export default AppLoading;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
