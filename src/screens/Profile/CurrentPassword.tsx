import React, {useMemo, useState} from 'react';
import {MainLayout} from '../../layouts';
import {AppButton, AppInput, AuthenHeader} from '../../components/common';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {useTranslation} from 'react-i18next';
import {ScreenConstant} from '../../const';
const CurrentPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const [pass, setPass] = useState<string>('');

  const disable = useMemo(() => {
    return !pass;
  }, [pass]);
  return (
    <MainLayout>
      <AuthenHeader
        onBack={() => navigation.goBack()}
        title={getLabel('enterPassword')}
      />
      <AppInput
        styles={{marginTop: 24}}
        label={getLabel('password')}
        value={pass}
        onChangeValue={setPass}
        isPassword
      />
      <AppButton
        style={{marginTop: 16, width: '100%'}}
        label={getLabel('continue')}
        disabled={disable}
        onPress={() =>
          navigation.navigate(ScreenConstant.CHANGE_PASSWORD, {
            isForgotPassword: false,
          })
        }
      />
    </MainLayout>
  );
};
export default CurrentPassword;
