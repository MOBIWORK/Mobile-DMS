import React, {useState} from 'react';
import {MainLayout} from '../../layouts';
import {AppHeader, AppInput} from '../../components/common';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../navigation/screen-type';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {IProfile} from '../../services/appService';
import {CommonUtils} from '../../utils';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {AppService} from '../../services';
import {ApiConstant, ScreenConstant} from '../../const';
import {IUser} from '../../models/types';

const EditAccount = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'EDIT_ACCOUNT'>>();
  const {t: getLabel} = useTranslation();
  const dispatch = useDispatch();
  const {colors} = useTheme();

  const [content, setContent] = useState<string>(route.params.content ?? '');

  const apiCaller = async (data: IProfile) => {
    dispatch(appActions.setProcessingStatus(true));
    await CommonUtils.CheckNetworkState();
    const response: any = await AppService.updateProfile(data);
    if (response.status === ApiConstant.STT_OK) {
      await updateUser();
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  const updateUser = async () => {
    const response: any = await AppService.getUserProfile();
    if (Object.keys(response?.result).length > 0) {
      const info: IUser = response.result;
      //set userInfo storage
      dispatch(appActions.setUserProfile(info));
      navigation.replace(ScreenConstant.USER_INFO_SCREEN);
    }
  };

  const handleSave = async (title: string) => {
    switch (title) {
      case getLabel('phoneNumber'): {
        await apiCaller({cell_number: content});
        break;
      }
      case getLabel('address'): {
        await apiCaller({current_address: content});
        break;
      }
    }
  };

  return (
    <MainLayout>
      <AppHeader
        onBack={() => navigation.goBack()}
        label={
          route.params.title === getLabel('address')
            ? getLabel('editAddress')
            : getLabel('editPhoneNumber')
        }
      />
      <View style={{flex: 1, marginTop: 32}}>
        <AppInput
          label={route.params.title}
          value={content}
          onChangeValue={setContent}
        />
        <TouchableOpacity
          onPress={() => handleSave(route.params.title)}
          style={{
            alignSelf: 'flex-end',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginTop: 32,
            backgroundColor:
              content !== route.params.content
                ? colors.primary
                : colors.bg_disable,
          }}
          disabled={route.params.content === content}>
          <Text style={{color: colors.bg_default}}>{getLabel('save')}</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};
export default EditAccount;
