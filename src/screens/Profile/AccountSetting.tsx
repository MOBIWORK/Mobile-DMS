import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Switch, View} from 'react-native';
import {useMMKVObject} from 'react-native-mmkv';
// @ts-ignore
import StringFormat from 'string-format';
import {NavigationProp} from '../../navigation/screen-type';
import {AppConstant, ScreenConstant} from '../../const';
import {MainLayout} from '../../layouts';
import {AppHeader} from '../../components/common';
import ProfileItem from './components/ProfileItem';
import {ImageAssets} from '../../assets';

const AccountSetting = () => {
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();

  const [biometricObject, setBiometricObject] = useMMKVObject<any>(
    AppConstant.biometricObject,
  );

  const [isOn, setIsOn] = useState<boolean>(true);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setBiometricObject({
      enable: !isOn,
      type: biometricObject.type,
    });
  };

  useEffect(() => {
    if (biometricObject) {
      setIsOn(biometricObject.enable);
    }
  }, [biometricObject]);

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
      <AppHeader
        label={getLabel('accountSetting')}
        onBack={() => navigation.goBack()}
      />
      <View
        style={{
          marginTop: 32,
          borderRadius: 8,
          backgroundColor: colors.bg_default,
        }}>
        {biometricObject.type !== 'null' && (
          <ProfileItem
            label={StringFormat(getLabel('loginToBiometric'), {
              biometric: biometricObject.type,
            })}
            image={
              biometricObject.type === AppConstant.BiometricType.FaceID
                ? ImageAssets.FaceIDIcon
                : ImageAssets.TouchIDIcon
            }
            rightComponent={
              <Switch value={isOn} onValueChange={toggleSwitch} />
            }
          />
        )}
        <ProfileItem
          label={getLabel('changePassword')}
          image={ImageAssets.SettingIcon}
          onPress={() => navigation.navigate(ScreenConstant.CURRENT_PASSWORD)}
        />
        <ProfileItem
          label={getLabel('notifySetting')}
          image={ImageAssets.NotifyIcon}
          onPress={() => navigation.navigate(ScreenConstant.NOTIFY_SETTING)}
        />
      </View>
    </MainLayout>
  );
};
export default AccountSetting;
