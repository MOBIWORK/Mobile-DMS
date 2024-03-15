import React from 'react';
import {MainLayout} from '../../layouts';
import {Image, Text, View} from 'react-native';
import {AppButton, AppHeader} from '../../components/common';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ImageAssets} from '../../assets';
import {useTranslation} from 'react-i18next';
import {ScreenConstant} from '../../const';
import { NavigationProp } from '../../navigation/screen-type';
const SuccessChanged = () => {
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();

  const goLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{name: ScreenConstant.SIGN_IN}],
    });
  };

  return (
    <MainLayout>
      <AppHeader onBack={() => navigation.goBack()} />
      <View style={{marginVertical: 32}}>
        <Image
          source={ImageAssets.IcCheckIcon}
          style={{width: 96, height: 96, alignSelf: 'center'}}
          resizeMode={'cover'}
        />
        <Text
          style={{
            textAlign: 'center',
            marginTop: 24,
            color: colors.text_primary,
            fontSize: 24,
            fontWeight: '700',
          }}>
          {getLabel('updateSuccess')}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 16,
            color: colors.text_secondary,
            fontSize: 16,
          }}>
          {getLabel('passChanged')}
        </Text>
      </View>
      <AppButton
        style={{width: '100%'}}
        label={getLabel('goBackLogin')}
        onPress={goLogin}
      />
    </MainLayout>
  );
};
export default SuccessChanged;
