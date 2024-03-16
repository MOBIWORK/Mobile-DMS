import {ImageStyle, StyleSheet, ViewStyle} from 'react-native';
import {AppTheme} from '../../../layouts/theme';
import {AppConstant} from '../../../const';

export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      marginTop: 10,
      marginBottom: 24,
      marginLeft: 8,
    } as ViewStyle,
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    cameraImg: {
      width: AppConstant.WIDTH * 0.28,
      height: AppConstant.WIDTH * 0.28,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_neutral,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ImageStyle,
    buttonEnd: {
      height: 36,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 16,
    } as ViewStyle,
    modal: {
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
      width: '100%',
    } as ViewStyle,
  });
