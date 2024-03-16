import React, {useEffect, useMemo, useState} from 'react';
import {MainLayout} from '../../layouts';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {
  AppButton,
  AppDialog,
  AppHeader,
  AppInput,
} from '../../components/common';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../navigation/screen-type';
import {ApiConstant, AppConstant, ScreenConstant} from '../../const';
import {useMMKVBoolean, useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {CommonUtils} from '../../utils';
import {ImageAssets} from '../../assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  ILoginResponse,
  IResOrganization,
  KeyAbleProps,
} from '../../models/types';
import {AppService} from '../../services';

import {useTranslation} from 'react-i18next';
import {setProcessingStatus} from '../../redux-store/app-reducer/reducer';
import {dispatch, getState} from '../../utils/redux';

const SignIn = () => {
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const app = getState('checkin')
  const [loginFirst] = useMMKVBoolean(AppConstant.FirstLogin);
  const [isLogOut] = useMMKVBoolean(AppConstant.isLogOut);
  const [organiztion] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );

  const [userNameStore, setUserNameStore] = useMMKVString(
    AppConstant.userNameStore,
  );
  const [passwordStore, setPasswordStore] = useMMKVString(
    AppConstant.passwordStore,
  );
  const [biometricObject, setBiometricObject] = useMMKVObject<{
    enable: boolean;
    type: string;
  }>(AppConstant.biometricObject);

  const [userName, setUserName] = useState<string>(userNameStore ?? '');
  const [password, setPassword] = useState<string>(passwordStore ?? '');
  const [biometricType, setBiometricType] = useState<string>(
    AppConstant.BiometricType.null,
  );
  const [fcmToken] = useMMKVString(AppConstant.FCM_TOKEN);

  const [open, setOpen] = useState<boolean>(false);

  const disable = useMemo(() => {
    return !(userName && password);
  }, [userName, password]);

  console.log(app,'app')

  const handleLogin = async () => {
    //TODO: call API
    dispatch(setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    const response: KeyAbleProps = await AppService.login(
      {
        usr: userName,
        pwd: password,
        device_name: Platform.OS,
        device_id: fcmToken ?? '',
      },
      true,
    );

    if (response.status === ApiConstant.STT_OK) {
      const result: ILoginResponse = response.data.result;
      CommonUtils.storage.set(AppConstant.Api_key, result.key_details.api_key);
      CommonUtils.storage.set(
        AppConstant.Api_secret,
        result.key_details.api_secret,
      );
      setUserNameStore(userName);
      setPasswordStore(password);

      await CommonUtils.dismissKeyboard(() => {
        navigation.navigate(ScreenConstant.MAIN_TAB);
      });
    }

    dispatch(setProcessingStatus(false));
  };

  const Authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        setBiometricObject({
          enable: true,
          type: biometricType,
        });
        navigation.navigate(ScreenConstant.MAIN_TAB);
      }
    } catch (e) {
      console.log('biometric Error', e);
    }
  };

  //auto Login
  useEffect(() => {
    if (!isLogOut) {
      if (biometricObject?.enable) {
        Authenticate()
        }
      // } else if (userNameStore && passwordStore) {
      //   navigation.navigate(ScreenConstant.MAIN_TAB);
      // }
    }
  }, []);

  useEffect(() => {
    CommonUtils.biometric(setBiometricType, setOpen);
  }, []);

  useEffect(() => {
    if (biometricType !== AppConstant.BiometricType.null) {
      setBiometricObject({
        enable: false,
        type: biometricType,
      });
    }
  }, [biometricType]);

  return (
    <MainLayout>
      <AppHeader
        hiddenBackButton
        label={organiztion?.company_name}
        labelStyle={{fontSize: 16, color: colors.text_secondary}}
      />
      <View style={{marginTop: 32}}>
        <Text
          style={{
            color: colors.text_primary,
            fontSize: 24,
            fontWeight: '700',
          }}>
          {getLabel('signIn')}
        </Text>
        <View style={styles.input}>
          <AppInput
            label={getLabel('userName')}
            value={userName}
            onChangeValue={setUserName}
          />
          <AppInput
            styles={{marginTop: 16}}
            label={getLabel('password')}
            value={password}
            onChangeValue={setPassword}
            isPassword
          />
        </View>
        <View style={styles.checkBox as ViewStyle}>
          <Text
            style={{color: colors.primary}}
            onPress={() => navigation.navigate(ScreenConstant.FORGOT_PASSWORD)}>
            {getLabel('forgotPassword')}
          </Text>
        </View>
        <AppButton
          style={{marginVertical: 24, width: '100%'}}
          label={getLabel('signIn')}
          disabled={disable}
          onPress={handleLogin}
        />
        <Text
          style={{color: colors.text_secondary, textAlign: 'center'}}
          onPress={() =>
            navigation.navigate(ScreenConstant.SELECT_ORGANIZATION, {})
          }>
          {getLabel('anotherOrganization')}
        </Text>
      </View>
      <View
        style={{
          marginTop: 32,
          width: 44,
          height: 44,
          alignSelf: 'center',
        }}>
        {biometricType !== AppConstant.BiometricType.null &&
          biometricObject &&
          loginFirst && (
            <TouchableOpacity onPress={Authenticate}>
              <Image
                source={
                  biometricType === AppConstant.BiometricType.FaceID
                    ? ImageAssets.FaceIDIcon
                    : ImageAssets.TouchIDIcon
                }
                style={{
                  width: 44,
                  height: 44,
                  tintColor: colors.text_secondary,
                  alignSelf: 'center',
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          )}
      </View>

      <AppDialog
        open={open}
        title={getLabel('biometricOff')}
        message={getLabel('biometricDescription')}
        errorType
        showButton
        closeLabel={getLabel('cancel')}
        onClose={() => setOpen(false)}
        submitLabel={getLabel('setting')}
        onSubmit={() => Linking.openSettings()}
        modalType={{width: '90%'}}
      />
    </MainLayout>
  );
};
export default SignIn;
const styles = StyleSheet.create({
  input: {
    marginVertical: 20,
  },
  checkBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
