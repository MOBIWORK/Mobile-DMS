import React, {useMemo, useState} from 'react';
import {MainLayout} from '../../layouts';
import {View} from 'react-native';
import {
  AppButton,
  AppDialog,
  AppInput,
  AuthenHeader,
} from '../../components/common';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {ApiConstant, AppConstant} from '../../const';
import {useMMKVString} from 'react-native-mmkv';
import {AppService} from '../../services';
import {Account} from '../../services/appService';
import {useDispatch} from 'react-redux';
import {appActions} from '../../redux-store/app-reducer/reducer';
const ChangePassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const dispatch = useDispatch();

  const [user_name] = useMMKVString(AppConstant.userNameStore);

  const [curPassword, setCurPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);

  const disable = useMemo(() => {
    return !password || !confirmPass || confirmPass !== password;
  }, [password, confirmPass]);

  const handleConfirm = async () => {
    dispatch(appActions.setProcessingStatus(true));
    //TODO: call API
    const params: Account = {
      user: user_name!,
      current_password: curPassword,
      new_password: password,
      new_pass_again: confirmPass,
    };
    const response: any = await AppService.changePassword(params);
    if (response?.status === ApiConstant.STT_OK) {
      setOpen(true);
    }
    dispatch(appActions.setProcessingStatus(false));
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
          label={getLabel('currentPassword')}
          value={curPassword}
          onChangeValue={setCurPassword}
          isPassword
        />
        <AppInput
          styles={{width: '100%', marginTop: 16}}
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
        style={{width: '100%', marginTop: 24}}
        label={getLabel('confirm')}
        onPress={handleConfirm}
        disabled={disable}
      />
      <AppDialog
        open={open}
        errorType={false}
        message={getLabel('updateSuccess')}
        modalType={{width: '90%'}}
        onSubmit={() => navigation.goBack()}
        viewOnly
        showButton
        submitLabel={'OK'}
      />
    </MainLayout>
  );
};
export default ChangePassword;
