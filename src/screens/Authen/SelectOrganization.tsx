import React, {useEffect, useRef, useState} from 'react';
import {MainLayout} from '../../layouts';
import {Image, Keyboard, Text, View} from 'react-native';
import {ImageAssets} from '../../assets';
import {
  AppBottomSheet,
  AppButton,
  AppInput,
  LangItem,
} from '../../components/common';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {
  IResOrganization,
  KeyAbleProps,
  LanguageItemType,
} from '../../models/types';
import {
  ApiConstant,
  AppConstant,
  LangConstant,
  ScreenConstant,
} from '../../const';
import BottomSheet from '@gorhom/bottom-sheet';
import LanguageBottomSheet from '../../components/common/LanguageBottomSheet';
import {NavigationProp, RouterProp} from '../../navigation';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {CommonUtils} from '../../utils';

import {useDispatch} from 'react-redux';
import {AppService} from '../../services';
import { appActions } from '../../redux-store/app-reducer/reducer';

const SelectOrganization = () => {
  const {t: getLabel, i18n} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'SELECT_ORGANIZATION'>>();
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [organizationName, setOrganizationName] = useState<string>(
    route.params?.data ?? '',
  );
  const [langCode, setLangCode] = useMMKVString(AppConstant.Language_Code);
  const [_, setOrganization] = useMMKVObject<IResOrganization>(
    AppConstant.Organization,
  );
  const [langData, setLangData] = useState<LanguageItemType[]>(
    LangConstant.LANG_LIST,
  );
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleChangeLang = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const onSelectItem = (id: string, code: string) => {
    const newLangData = langData.map(item => {
      if (item.id === id) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setLangData(newLangData);
    setLangCode(code);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
    i18n.changeLanguage(code);
  };

  const getOrganization = async () => {
    await CommonUtils.CheckNetworkState();
    console.log('run first')
    const response: KeyAbleProps = await AppService.verifyOrganization({
      organization: organizationName,
    });
    console.log(response,'run second')
    if (response.status === ApiConstant.STT_OK) {
      const {result} = response.data;
      setOrganization(result);
      navigation.navigate(ScreenConstant.SIGN_IN, {
        organizationName: organizationName,
      });
    }
  };

  useEffect(() => {
    if (!langCode) {
      setLangCode('vi');
    }
    const newData = langData.map(item => {
      if (item.code === langCode) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setLangData(newData);
  }, [langCode]);

  useEffect(() => {
    dispatch(appActions.setShowErrorModalStatus(true));
  }, []);

  return (
    <MainLayout>
      <View style={{flex: 1}} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={ImageAssets.InitLogo}
          style={{width: 142, height: 100}}
          resizeMode={'cover'}
        />
        <LangItem
          flagSource={
            langCode === 'vi' ? ImageAssets.VNFLag : ImageAssets.ENFlag
          }
          onPress={() => handleChangeLang()}
          styles={{marginTop: 24}}
        />
      </View>
      <View style={{flex: 1}} />
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.text_primary,
            textAlign: 'center',
          }}>
          {getLabel('organization')}
        </Text>
        <AppInput
          styles={{marginVertical: 20}}
          label={getLabel('organizationName')}
          value={organizationName}
          onChangeValue={setOrganizationName}
          rightIcon={
            <TextInput.Icon
              icon={'line-scan'}
              size={35}
              color={colors.primary}
              onPress={() => {
                Keyboard.dismiss();
                CommonUtils.sleep(200).then(() =>
                  navigation.navigate(ScreenConstant.SCANNER),
                );
              }}
            />
          }
        />
        <AppButton
          style={{width: '100%'}}
          label={getLabel('continue')}
          onPress={() => getOrganization()}
          disabled={!organizationName}
        />
      </View>
      <View style={{flex: 1}} />
      <AppBottomSheet bottomSheetRef={bottomSheetRef} useBottomSheetView>
        <LanguageBottomSheet data={langData} handleItem={onSelectItem} />
      </AppBottomSheet>
    </MainLayout>
  );
};

export default SelectOrganization;
