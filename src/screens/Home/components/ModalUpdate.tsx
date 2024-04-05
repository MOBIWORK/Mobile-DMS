import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {
  Block,
  AppText as Text,
  ProgressLinear,
} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import AppImage from '../../../components/common/AppImage';
import isEqual from 'react-fast-compare';

type Props = {
  show: boolean;
  onPress: () => void;
  progress?: number;
};

const ModalUpdate = ({show, onPress, progress}: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  return (
    <Modal visible={show} style={styles.container} onDismiss={onPress}>
      <Block
        colorTheme="white"
        paddingHorizontal={16}
        paddingVertical={32}
        marginLeft={16}
        borderRadius={8}
        marginRight={16}>
        <StatusBar translucent barStyle={'dark-content'} />
        <Block>
          <Block middle>
            <AppImage source="LogoMBW" size={40} />
            <Block marginTop={8} marginBottom={8}>
              <Text fontSize={16} fontWeight="700" colorTheme="text">
                {progress ? 'Đang cập nhật' : 'Cập nhật ứng dụng'}
              </Text>
            </Block>
            <Block marginTop={10} marginBottom={10}>
              <Text textAlign="center" colorTheme="text_secondary">
                {progress
                  ? 'Ứng dụng đang được cập nhật, \n' +
                    'vui lòng chờ trong giây lát.'
                  : 'Để tăng trải nghiệm người dùng và tính năng, vui lòng cập nhật\n' +
                    '                ứng dụng.'}
              </Text>
            </Block>
          </Block>
          {progress ? (
            <Block paddingVertical={4} paddingHorizontal={80}>
              <ProgressLinear strokeWidth={16} progress={progress} />
            </Block>
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={onPress}>
              <Block middle>
                <Text colorTheme="white" fontWeight="700" fontSize={16}>
                  Cập nhật
                </Text>
              </Block>
            </TouchableOpacity>
          )}
        </Block>
      </Block>
    </Modal>
  );
};

export default React.memo(ModalUpdate, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {} as ViewStyle,
    textTitle: {
      paddingTop: 12,
    } as TextStyle,
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      justifyContent: 'center',
      padding: 9,
      alignContent: 'center',
      marginVertical: 8,
      marginTop: 8,
    } as ViewStyle,
  });
