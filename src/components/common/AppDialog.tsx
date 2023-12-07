import React, {FC, ReactElement} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  Image,
} from 'react-native';
import {ImageAssets} from '../../assets';
import Backdrop from './Backdrop';
import {useTheme} from '@react-navigation/native';

const AppDialog: FC<DialogProps> = ({
  open,
  errorType,
  title,
  message,
  closeLabel,
  submitLabel,
  onClose,
  onSubmit,
  onRequestClose,
  modalWrapType,
  modalType,
  buttonType,
  titleType,
  messageType,
  viewOnly,
  showButton,
  customModal,
}) => {
  const {colors} = useTheme();
  return (
    <>
      <View style={[styles.centeredView, modalWrapType]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={onRequestClose}>
          <View style={[styles.centeredView, modalType]}>
            <View
              style={[styles.modalView, {backgroundColor: colors.bg_paper}]}>
              {customModal ? (
                <>{customModal}</>
              ) : (
                <>
                  <Image
                    source={
                      errorType
                        ? ImageAssets.ErrorApiIcon
                        : ImageAssets.SuccessApiIcon
                    }
                    style={{width: 54, height: 54}}
                    resizeMode="contain"
                  />

                  {title && (
                    <Text
                      style={[
                        styles.modalText,
                        titleType,
                        {color: colors.text_primary},
                      ]}>
                      {title}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      messageType,
                      {color: colors.text_secondary},
                    ]}>
                    {message}
                  </Text>
                  <View style={styles.buttonContainer}>
                    {showButton ? (
                      <>
                        {(Boolean(onClose) || !viewOnly) && (
                          <Pressable
                            style={[
                              styles.button,
                              buttonType,
                              // @ts-ignore
                              {
                                backgroundColor: colors.bg_neutral,
                                paddingHorizontal: 16,
                              },
                            ]}
                            onPress={onClose}>
                            <Text
                              style={[
                                styles.textStyle,
                                {color: colors.text_secondary},
                              ]}>
                              {closeLabel}
                            </Text>
                          </Pressable>
                        )}
                        <Pressable
                          style={[
                            styles.button,
                            buttonType,
                            // @ts-ignore
                            {
                              backgroundColor: colors.primary,
                              paddingHorizontal: 16,
                            },
                          ]}
                          onPress={onSubmit}>
                          <Text style={styles.textStyle}>{submitLabel}</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      <Backdrop open={open} />
    </>
  );
};

interface DialogProps {
  open: boolean;
  errorType?: boolean;
  title?: string;
  message?: string;
  closeLabel?: string;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: () => void;
  onRequestClose?: () => void;
  modalWrapType?: ViewStyle;
  buttonType?: StyleProp<ViewStyle>;
  titleType?: StyleProp<TextStyle>;
  messageType?: StyleProp<TextStyle>;
  modalType?: ViewStyle;
  viewOnly?: boolean;
  customModal?: ReactElement;
  showButton?: boolean;
}

export default AppDialog;

const styles = StyleSheet.create({
  centeredView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  modalView: {
    margin: 20,
    width: '100%',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    borderRadius: 16,
    marginTop: 24,
    maxWidth: '40%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
  },
  textStyle: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
  },
  modalText: {
    marginVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    marginTop: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
