import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {AppTheme, useTheme} from '../../../layouts/theme';
import AppImage from '../../../components/common/AppImage';
import {Block, AppText as Text} from '../../../components/common';

type Props = {
  show: boolean;
  onPress: () => void;
  text: string;
};

const ModalErrorLocation = ({show, onPress, text}: Props) => {
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
        <Block>
          <Block middle>
            <AppImage source="ErrorApiIcon" size={40} />
            <Block marginTop={8} marginBottom={8}>
              <Text fontSize={16} fontWeight="700" colorTheme="text">
                Đã có lỗi xảy ra
              </Text>
            </Block>
            <Block marginTop={10} marginBottom={10}>
              <Text textAlign="center" colorTheme="text_secondary">
                {text}
              </Text>
            </Block>
          </Block>
          <TouchableOpacity style={styles.updateButton} onPress={onPress}>
            <Block middle>
              <Text colorTheme="white" fontWeight="700" fontSize={16}>
                Lấy lại vị trí
              </Text>
            </Block>
          </TouchableOpacity>
        </Block>
      </Block>
    </Modal>
  );
};

export default ModalErrorLocation;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      // backgroundColor:theme.colors.white,
      // height:'40%',
    } as ViewStyle,
    textTitle: {
      paddingTop: 12,
    } as TextStyle,
    updateButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      justifyContent: 'center',
      padding: 9,
      //   width: '100%',
      //   justifyContent: 'center',
      alignContent: 'center',
      marginVertical: 8,
      marginTop: 8,
    } as ViewStyle,
  });
