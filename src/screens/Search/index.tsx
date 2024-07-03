import React, {useEffect, useState} from 'react';
import {MainLayout} from '../../layouts';
import {
  Image,
  Keyboard,
  NativeSyntheticEvent,
  Text,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageAssets} from '../../assets';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
import {NavigationProp, RouterProp} from '../../navigation/screen-type';
import {useMMKVString} from 'react-native-mmkv';
import {AppConstant} from '../../const';
import {AppIcons} from '../../components/common';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {ListSearchOrderNearly} from '../../const/app.const';
import {CommonUtils} from '../../utils';

const SearchScreen = ({}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const {t: getLabel} = useTranslation();
  const router = useRoute<RouterProp<'SEARCH_COMMON_SCREEN'>>();

  const [listProductNearly, setListProductNearly] = useMMKVString(
    AppConstant.ListSearchProductNearly,
  );
  const [listOrderNearly, setListOrderNearly] = useMMKVString(
    AppConstant.ListSearchOrderNearly,
  );

  const [searchValue, setSearch] = useState<string>('');

  const SearchNearly = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={{color: colors.text_primary, fontWeight: '500'}}>
          {getLabel('recentSearches')}
        </Text>
        <View style={{marginTop: 16}}>
          {router?.params?.type === 'order' && listOrderNearly
            ? JSON.parse(listOrderNearly).map((item: any, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 6,
                    }}>
                    <Text
                      onPress={() => {
                        Keyboard.dismiss();
                        dispatch(appActions.setSearchOrderValue(item.label));
                        CommonUtils.sleep(200).then(() => navigation.goBack());
                      }}
                      style={{
                        color: colors.text_primary,
                        width: '80%',
                      }}>
                      {item.label}
                    </Text>
                    <AppIcons
                      iconType={AppConstant.ICON_TYPE.IonIcon}
                      name={'close'}
                      size={24}
                      color={colors.text_secondary}
                      onPress={() => handleItem(item)}
                    />
                  </View>
                );
              })
            : listProductNearly &&
              JSON.parse(listProductNearly).map((item: any, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 6,
                    }}>
                    <Text
                      onPress={() => {
                        Keyboard.dismiss();
                        dispatch(appActions.setSearchProductValue(item.label));
                        CommonUtils.sleep(200).then(() => navigation.goBack());
                      }}
                      style={{
                        color: colors.text_primary,
                        width: '80%',
                      }}>
                      {item.label}
                    </Text>
                    <AppIcons
                      iconType={AppConstant.ICON_TYPE.IonIcon}
                      name={'close'}
                      size={24}
                      color={colors.text_secondary}
                      onPress={() => handleItem(item)}
                    />
                  </View>
                );
              })}
        </View>
      </View>
    );
  };

  const onSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    Keyboard.dismiss();
    //TODO:save to redux
    const newListNearly = listProductNearly && JSON.parse(listProductNearly);
    newListNearly.push({label: String(e.nativeEvent.text)});
    if (router?.params?.type === 'order') {
      dispatch(appActions.setSearchOrderValue(String(e.nativeEvent.text)));
      setListOrderNearly(JSON.stringify(newListNearly));
    } else {
      dispatch(appActions.setSearchProductValue(String(e.nativeEvent.text)));
      setListProductNearly(JSON.stringify(newListNearly));
    }
    CommonUtils.sleep(200).then(() => navigation.goBack());
  };

  const handleItem = (item: any) => {
    Keyboard.dismiss();
    if (router?.params.type === 'order') {
      const newData =
        listOrderNearly &&
        JSON.parse(listOrderNearly).filter(
          (res: any) => res.label !== item.label,
        );
      setListOrderNearly(JSON.stringify(newData));
    } else {
      const newData =
        listProductNearly &&
        JSON.parse(listProductNearly).filter(
          (res: any) => res.label !== item.label,
        );
      setListProductNearly(JSON.stringify(newData));
    }
  };

  useEffect(() => {
    if (!listProductNearly) {
      setListProductNearly(JSON.stringify([]));
    } else if (!listOrderNearly) {
      setListOrderNearly(JSON.stringify([]));
    }
  }, []);

  return (
    <MainLayout>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={ImageAssets.ArrowLeftIcon}
            style={{width: 24, height: 24}}
            resizeMode={'cover'}
            tintColor={colors.text_primary}
          />
        </TouchableOpacity>
        <Searchbar
          style={{
            backgroundColor: colors.bg_neutral,
            borderRadius: 10,
            width: '90%',
            marginLeft: 12,
          }}
          placeholder={
            router?.params?.type === 'order'
              ? getLabel('searchOrder')
              : getLabel('searchProduct')
          }
          placeholderTextColor={colors.text_disable}
          icon={ImageAssets.SearchIcon}
          value={searchValue}
          onChangeText={setSearch}
          inputStyle={{color: colors.text_primary}}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
      <SearchNearly />
    </MainLayout>
  );
};

export default SearchScreen;
