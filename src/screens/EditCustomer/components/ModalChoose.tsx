import {FlatList, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {
  AppHeader,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import Modal from 'react-native-modal';
import {AppTheme, useTheme} from '../../../layouts/theme';

import {Address, Contact, ContactCard} from '../../../models/types';
import CardChoose from './CardChoose';
type Props = {
  visible: boolean;
  onBackButtonPress: () => void;
  type: string;
  listAddress: Address[];
  listContact: ContactCard[];
  onPressData: (data: any, type: string) => void;
  onEditData: (data: any, type: string) => void;
  onPressAdding: () => void;
  // defaultData?:any
};

const ModalChoose = ({
  visible,
  onBackButtonPress,
  type,
  listAddress,
  listContact,
  onPressData,
  onEditData,
  onPressAdding,
}: // defaultData
Props) => {
  const theme = useTheme();
  const styles = modalEditStyles(theme);

  //  console.log(listAddress,'adâd')

  // console.log(listContact,'listContact')

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      animationIn={'slideInUp'}
      backdropOpacity={0.5}
      style={styles.modalStyle}
      animationOut={'slideOutDown'}>
      <Block colorTheme="bg_default" block paddingHorizontal={16}>
        {type === 'address' ? (
          <Block block>
            <AppHeader
              label="Chọn địa chỉ"
              onBack={onBackButtonPress}
              backButtonIcon={
                <SvgIcon source="Close" colorTheme="black" size={22} />
              }
            />
            {listAddress && listAddress.length > 0 && (
              <FlatList
                data={listAddress}
                initialNumToRender={listAddress.length}
                showsVerticalScrollIndicator={false}
                decelerationRate={'normal'}
                keyExtractor={(item, index) => `${index}-${item.name}`}
                renderItem={({item}) => (
                  <CardChoose
                    // key={index}
                    type="address"
                    data={item}
                    onPress={onPressData}
                    onEditPress={onEditData}
                  />
                )}
              />
            )}
          </Block>
        ) : (
          <Block block>
            <AppHeader
              label="Chọn liên hệ"
              onBack={onBackButtonPress}
              backButtonIcon={
                <SvgIcon source="Close" colorTheme="black" size={22} />
              }
            />
            {listContact && listContact.length > 0 && (
              <FlatList
                data={listContact}
                initialNumToRender={listContact.length}
                showsVerticalScrollIndicator={false}
                decelerationRate={'normal'}
                keyExtractor={(item, index) => `${index}-${item.name}`}
                renderItem={({item}) => (
                  <CardChoose
                    // key={index}
                    type="contact"
                    data={item}
                    onPress={onPressData}
                    onEditContact={onEditData}
                  />
                )}
              />
            )}
          </Block>
        )}
        <TouchableOpacity
          style={styles.containButton}
          onPress={() => {
            onBackButtonPress();
            onPressAdding();
          }}>
          <SvgIcon source="BluePlush" size={16} colorTheme="white" />
          <Text colorTheme="facebook" fontSize={14} fontWeight="500">
            {'   '}
            {type === 'address' ? 'Thêm địa chỉ mới' : 'Thêm liên hệ mới'}
          </Text>
        </TouchableOpacity>
      </Block>
    </Modal>
  );
};

export default React.memo(ModalChoose, isEqual);

const modalEditStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalStyle: {
      // paddingHorizontal:16,
      marginHorizontal: 0,
      marginVertical: 0,
    } as ViewStyle,
    containButton: {
      height: 37,
      borderRadius: 20,
      backgroundColor: theme.colors.bg_neutral,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      // flex: 1,
      marginHorizontal: 8,
      marginBottom: 20,
      borderColor: theme.colors.action,
    } as ViewStyle,
  });
