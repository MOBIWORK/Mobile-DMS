import React, {useMemo, useState} from 'react';
import {MainLayout} from '../../layouts';
import {View} from 'react-native';
import {AppButton, AppInput, AuthenHeader} from '../../components/common';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {useTranslation} from 'react-i18next';
import {ScreenConstant} from '../../const';
const ChangePassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();

  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');

  const disable = useMemo(() => {
    return !password || !confirmPass || confirmPass !== password;
  }, [password, confirmPass]);

  const handleConfirm = async () => {
    //TODO: call API
    navigation.navigate(ScreenConstant.SUCCESS_CHANGE);
  };

  return (
    <MainLayout>
      <AuthenHeader
        onBack={() => navigation.goBack()}
        title={getLabel('changePassword')}
      />
      <View
        style={{
          marginTop: 32,
          marginBottom: 16,
          width: '100%',
        }}>
        <AppInput
          styles={{width: '100%'}}
          label={getLabel('password')}
          value={password}
          onChangeValue={setPassword}
          isPassword
        />
        <AppInput
          styles={{width: '100%', marginTop: 16}}
          label={getLabel('confirmPassword')}
          value={confirmPass}
          onChangeValue={setConfirmPass}
          isPassword
        />
      </View>
      <AppButton
        style={{width: '100%'}}
        label={getLabel('confirm')}
        onPress={handleConfirm}
        disabled={disable}
      />
    </MainLayout>
  );
};
export default ChangePassword;
