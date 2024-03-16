import React, {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {
  AppButton,
  AppDialog,
  AppInput,
  AuthenHeader,
} from '../../components/common';
import {MainLayout} from '../../layouts';
import {ApiConstant} from '../../const';
import {KeyAbleProps} from '../../models/types';
import {AppService} from '../../services';
// @ts-ignore
import StringFormat from 'string-format';


import {CommonUtils} from '../../utils';
import { appActions } from '../../redux-store/app-reducer/reducer';
import { dispatch } from '../../utils/redux';

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  

  const [email, setEmail] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const disable = useMemo(() => {
    return !email;
  }, [email]);

  const handleAccuracy = async () => {
    dispatch(appActions.setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    const response: KeyAbleProps = await AppService.resetPassword(email, true);
    if (response?.status === ApiConstant.STT_OK) {
      setOpen(true);
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  return (
    <MainLayout>
      <AuthenHeader
        onBack={() => navigation.goBack()}
        title={getLabel('forgotPassword')}
        description={getLabel('emailAccuracy')}
      />
      <AppInput
        styles={{marginTop: 32, marginBottom: 16}}
        label={'Email'}
        value={email}
        onChangeValue={setEmail}
      />
      <AppButton
        label={getLabel('accuracy')}
        onPress={handleAccuracy}
        style={{width: '100%'}}
        disabled={disable}
      />
      <AppDialog
        open={open}
        errorType={false}
        showButton
        viewOnly
        modalType={{width: '75%'}}
        title={getLabel('forgotPassTitle')}
        message={StringFormat(getLabel('forgotPassMessage'), {email: email})}
        submitLabel={getLabel('OK')}
        onSubmit={() => {
          setOpen(false);
          navigation.goBack();
        }}
      />
    </MainLayout>
  );
};
export default ForgotPassword;
