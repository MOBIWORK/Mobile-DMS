import {ImageStyle, StyleSheet, ViewStyle} from 'react-native';
import {AppTheme} from '../../layouts/theme';

export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
    } as ViewStyle,
    iconSearch: {
      width: 30,
      height: 30,
      tintColor: theme.colors.text_secondary,
    } as ImageStyle,
    viewItem: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      backgroundColor: theme.colors.white,
      paddingHorizontal: 16,
      paddingVertical: 14,
      // borderBottomWidth: 1,
      // borderBottomColor: theme.colors.black,
      borderRadius:16,
      marginVertical:5
    } as ViewStyle ,
  });
