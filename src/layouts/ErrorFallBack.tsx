import {Button, Platform, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../components/common';
import {AppTheme, useTheme} from './theme';
import isEqual from 'react-fast-compare';

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const theme = useTheme();
  return (
    <Block
      justifyContent="center"
      alignItems="center"
      style={styles(theme).card}>
      <Text>Đã có lỗi xảy ra:</Text>
      <Text>{error.message}</Text>
      <Button title="Thử lại" onPress={resetErrorBoundary} />
    </Block>
  );
};

export default React.memo(ErrorFallback, isEqual);

const styles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      // borderWidth: 0.1,
      paddingVertical: 12,
      marginVertical: 8,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.23,
          elevation: 2,
        },
        android: {
          elevation: 4,
          shadowRadius: 6.4,
        },
      }),
    } as ViewStyle,
  });
