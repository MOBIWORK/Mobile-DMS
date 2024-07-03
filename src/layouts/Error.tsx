import {Image, ImageStyle, StyleSheet} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../components/common';
import {ImageAssets} from '../assets';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/screen-type';
import {useTheme} from './theme';

const Error = () => {
  const routeParams = useRoute<RouteProp<RootStackParamList, 'ERROR'>>().params;
  const theme = useTheme();

  return (
    <Block block justifyContent="center" alignItems="center">
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
          Đã có lỗi xảy ra, xin vui lòng liên hệ kỹ thuật để được hỗ trợ{' '}
        </Text>
        <Text fontSize={15} color={theme.colors.error}>
          {routeParams ? routeParams.error : ''}
        </Text>
      </Block>
    </Block>
  );
};

export default Error;

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  } as ImageStyle,
});
