import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {AppHeader, Block, SvgIcon} from '../../components/common';
import {AppTheme, useTheme} from '../../layouts/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {goBack} from '../../navigation/navigation-service';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthorizeParamsList} from '../../navigation/screen-type';
import FormData from './components/FormData';

const EditCustomerScreen = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const params =
    useRoute<RouteProp<AuthorizeParamsList, 'EDIT_CUSTOMER'>>().params;
  console.log('params', params);

  const goBackScreen = React.useCallback(() => {
    goBack();
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <AppHeader
        label="Chỉnh sửa khách hàng"
        onBack={goBackScreen}
        backButtonIcon={
          <SvgIcon
            source="arrowLeft"
            color={theme.colors.text_secondary}
            style={{marginLeft: 16}}
          />
        }
      />
      <Block block>
        <FormData data={params.data} goBack={goBackScreen} />
      </Block>
    </SafeAreaView>
  );
};

export const EditCustomer = React.memo(EditCustomerScreen, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {flex: 1} as ViewStyle,
  });
