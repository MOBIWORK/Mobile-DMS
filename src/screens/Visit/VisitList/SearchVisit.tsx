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
import {useDispatch} from 'react-redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';

const SearchVisit = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const [listVisitNearly, setListVisitNearly] = useMMKVString(
    AppConstant.ListSearchVisitNearly,
  );

  const [searchValue, setSearch] = useState<string>('');

  const SearchNearly = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={{color: colors.text_primary, fontWeight: '500'}}>
          Tìm kiếm gần đây
        </Text>
        <View style={{marginTop: 16}}>
          {listVisitNearly &&
            JSON.parse(listVisitNearly).map((item: any, index: number) => {
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
                      dispatch(appActions.setSearchVisitValue(item.label));
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
    dispatch(appActions.setSearchVisitValue(String(e.nativeEvent.text)));
    const newListNearly = listVisitNearly && JSON.parse(listVisitNearly);
    newListNearly.push({label: String(e.nativeEvent.text)});
    setListVisitNearly(JSON.stringify(newListNearly));
    navigation.goBack();
  };

  const handleItem = (item: any) => {
    const newData =
      listVisitNearly &&
      JSON.parse(listVisitNearly).filter(
        (res: any) => res.label !== item.label,
      );
    setListVisitNearly(JSON.stringify(newData));
  };

  useEffect(() => {
    if (!listVisitNearly) {
      setListVisitNearly(JSON.stringify([]));
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
          placeholder={'Tìm kiếm viếng thăm...'}
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

export default SearchVisit;
