import {
  Button,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback} from 'react';
import {Block, AppText as Text} from '../components/common';
import {AppTheme, useTheme} from './theme';
import isEqual from 'react-fast-compare';
import RNRestart from 'react-native-restart';
import {ImageAssets} from '../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from '../config/function';
import {shallowEqual} from 'react-redux';
import {DMSConfigMobile, logError} from '../services/appService';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {AppConstant} from '../const';
import {IResOrganization} from '../models/types';

const ErrorFallback = ({error}: {error: Error}) => {
  const onPressReset = useCallback(() => {
    // Immediately reload the React Native Bundle
    handleError(error);
    RNRestart.Restart();
  }, [error]);

  const theme = useTheme();
  const styles = styless(theme);
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );
  const [userNameStore] = useMMKVString(AppConstant.userNameStore);



  const handleError = async (errorCrash: Error) => {
    // Ghi lại thông tin lỗi vào sv
    let data = {
      orgid: organiztion?.company_name || '',
      user: userNameStore || '',
      api: errorCrash.name || '',
      screen: errorCrash.stack || '',
      detail: errorCrash.message || '',
    };
    await logError(data);
  };

  if (error) {
    handleError(error);
  }
  return (
    <SafeAreaView style={styles.root}>
      <Block marginLeft={16} marginRight={16}>
        <Image
          source={ImageAssets.ErrorApiIcon}
          style={styles.image}
          resizeMode="contain"
        />
        <Block justifyContent="center" alignItems="center" maxWidth={200}>
          <Text
            textAlign="center"
            fontSize={14}
            color={theme.colors.text_primary}>
            {' '}
            Đã có lỗi xảy ra, xin vui lòng thử lại
          </Text>
          <Text fontSize={15} color={theme.colors.error}>
            {error.message}
          </Text>
        </Block>
        <TouchableOpacity style={styles.buttonReset} onPress={onPressReset}>
          <Text
            fontSize={16}
            color={theme.colors.bg_default}
            textAlign="center">
            Khởi động lại
          </Text>
        </TouchableOpacity>
      </Block>
    </SafeAreaView>
  );
};

export default React.memo(ErrorFallback, isEqual);

const styless = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
      justifyContent: 'center',
    } as ViewStyle,
    image: {
      width: 200,
      height: 200,
    } as ImageStyle,
    buttonReset: {
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      padding: 16,
    } as ViewStyle,
  });
