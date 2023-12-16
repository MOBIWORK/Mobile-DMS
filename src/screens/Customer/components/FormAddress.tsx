import {
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppHeader,
  AppIcons,
  AppInput,
  AppText,
  SvgIcon,
} from '../../../components/common';
import {AppConstant} from '../../../const';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {AppTheme, useTheme} from '../../../layouts/theme';

type Props = {
  ref: React.RefObject<BottomSheetMethods>;
};

const FormAddress = (props: Props) => {
  const {ref} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [addressValue, setAddressValue] = useState({
    city: '',
    district: '',
    ward: '',
    detailAddress: '',
    addressOrder: false,
    addressGet: false,
  });

  return (
    <SafeAreaView style={styles.root}>
      <AppHeader
        label="Địa chỉ chính"
        onBack={() => ref.current?.close}
        backButtonIcon={
          <AppIcons
            iconType={AppConstant.ICON_TYPE.EntypoIcon}
            name="close"
            size={24}
            color={theme.colors.border}
          />
        }
      />
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.buttonStyle}>
          <SvgIcon source="iconMap" size={20} colorTheme="action" />
          <AppText
            style={styles.marginText}
            fontSize={14}
            colorTheme="action"
            fontWeight="500">
            Lấy vị trí hiện tại
          </AppText>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppInput
          label=""
          value={addressValue.city}
          editable={false}
          styles={styles.marginInputView}
          rightIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.EntypoIcon}
              name="chevron-down"
              size={20}
            />
          }
        />
        <AppInput
          label=""
          value={addressValue.district}
          editable={false}
          styles={styles.marginInputView}
          rightIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.EntypoIcon}
              name="chevron-down"
              size={20}
            />
          }
        />
        <AppInput
          label=""
          value={addressValue.ward}
          editable={false}
          styles={styles.marginInputView}
          rightIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.EntypoIcon}
              name="chevron-down"
              size={20}
            />
          }
        />
        <AppInput
          label=""
          value={addressValue.detailAddress}
          editable={true}
          styles={styles.marginInputView}
          rightIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.EntypoIcon}
              name="chevron-down"
              size={20}
            />
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormAddress;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    buttonStyle: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 12,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
      flexDirection: 'row',
    } as ViewStyle,
    marginText: {
      marginLeft: 8,
    } as TextStyle,
    marginInputView: {
      marginBottom: 20,
    } as ViewStyle,
    buttonView: {
      marginBottom: 20,
    } as ViewStyle,
  });
