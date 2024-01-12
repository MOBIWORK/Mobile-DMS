import {StyleSheet, ViewStyle} from 'react-native';
import {AppTheme} from '../../../layouts/theme';

export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    touchable: (selected: number, index: number) =>
      ({
        paddingVertical: 12,
        backgroundColor:
          selected === index ? theme.colors.primaryBackground : 'transparent',
        borderRadius: 24,
        marginHorizontal: 4,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle),
  });
