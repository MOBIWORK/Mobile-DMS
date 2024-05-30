import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {
  AppHeader,
  AppIcons,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {useTranslation} from 'react-i18next';
import {AppConstant} from '../../../const';
import Modal from 'react-native-modal';

type Props = {
  modal: boolean;
  onBackButtonPress: () => void;
  handleCameraPicker: () => void;
  handleImagePicker: () => void;
};

const ModalCamera = (props: Props) => {
  const {onBackButtonPress, handleCameraPicker, handleImagePicker, modal} =
    props;
  const theme = useTheme();
  const styles = modalStyles(theme);
  const {t: getLabel} = useTranslation();

  return (
    <Modal
      isVisible={modal}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      backdropOpacity={0.5}
      style={styles.modalStyle}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <Block
        height={220}
        colorTheme="bg_default"
        borderTopLeftRadius={16}
        marginTop={16}
        paddingHorizontal={16}
        borderTopRightRadius={16}>
        <Block >
          <AppHeader
            label={getLabel('chooseImage')}
            onBack={() => {}}
            backButtonIcon={
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name="close"
                size={26}
                color={theme.colors.black}
                onPress={onBackButtonPress}
              />
            }
          />
        </Block>
        <Block>
          <TouchableOpacity
            style={styles.containButton}
            onPress={handleCameraPicker}>
            <Block style={styles.containIconView}>
              <SvgIcon source="IconCamera" size={24} />
              <Text fontSize={16} fontWeight="500" colorTheme="black">
                {'  '} {getLabel('takePicture')}
              </Text>
            </Block>

            <SvgIcon source="arrowRight" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.containButton}
            onPress={handleImagePicker}>
            <Block style={styles.containIconView}>
              <SvgIcon source="IconImage" size={24} />
              <Text fontSize={16} fontWeight="500" colorTheme="black">
                {'  '} {getLabel('chooseFromLibrary')}
              </Text>
            </Block>
            <SvgIcon source="arrowRight" size={20} />
          </TouchableOpacity>
        </Block>
      </Block>
    </Modal>
  );
};

export default ModalCamera;

const modalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      marginVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    } as ViewStyle,
    containIconView: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    modalStyle: {
      marginHorizontal: 0,
      marginVertical: 0,
      justifyContent: 'flex-end',
    } as ViewStyle,
  });
