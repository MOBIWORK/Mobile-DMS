import React, {useEffect, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {
  Image,
  NativeSyntheticEvent,
  Text,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
import {NavigationProp} from '../../../navigation';
import {useMMKVString} from 'react-native-mmkv';
import {AppConstant} from '../../../const';
import {AppIcons} from '../../../components/common';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';

const SearchProduct = ({}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {t :getLabel} = useTranslation()
  const [listProductNearly, setListProductNearly] = useMMKVString(
    AppConstant.ListSearchProductNearly,
  );

  const [searchValue, setSearch] = useState<string>('');

  const SearchNearly = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={{color: colors.text_primary, fontWeight: '500'}}>
          Tìm kiếm gần đây
        </Text>
        <View style={{marginTop: 16}}>
          {listProductNearly &&
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
                      dispatch(appActions.setSearchProductValue(item.label));
                      navigation.goBack();
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
    //TODO:save to redux
    dispatch(appActions.setSearchProductValue(String(e.nativeEvent.text)));
    const newListNearly = listProductNearly && JSON.parse(listProductNearly);
    newListNearly.push({label: String(e.nativeEvent.text)});
    setListProductNearly(JSON.stringify(newListNearly));
    navigation.goBack();
  };

  const handleItem = (item: any) => {
    const newData =
      listProductNearly &&
      JSON.parse(listProductNearly).filter(
        (res: any) => res.label !== item.label,
      );
    setListProductNearly(JSON.stringify(newData));
  };

  useEffect(() => {
    if (!listProductNearly) {
      setListProductNearly(JSON.stringify([]));
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
          placeholder={getLabel("searchProduct")}
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

export default SearchProduct;
