import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useMMKVString} from 'react-native-mmkv';
import {dispatch} from '../../utils/redux';
import {AppTheme, useTheme} from '../../layouts/theme';
import {NavigationProp} from '../../navigation';
import {AppConstant} from '../../const';
import {AppText as Text, Block, SvgIcon} from '../../components/common';
import {MainLayout} from '../../layouts';
import {Searchbar} from 'react-native-paper';
import {ImageAssets} from '../../assets';
import {appActions} from '../../redux-store/app-reducer/reducer';
import {useTranslation} from 'react-i18next';

type Props = {};

const SearchCustomer = (props: Props) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {t: getLabel} = useTranslation();
  const [listCustomerNearly, setListCustomerNearly] = useMMKVString(
    AppConstant.ListSearchCustomerNearly,
  );
  const [searchValue, setSearchValue] = useState<string>('');

  const handleItem = (item: any) => {
    const newData =
      listCustomerNearly &&
      JSON.parse(listCustomerNearly).filter(
        (res: any) => res.label !== item.label,
      );
    setListCustomerNearly(JSON.stringify(newData));
  };

  const SearchNearly = () => {
    return (
      <Block marginTop={20}>
        <Text colorTheme="text_primary" fontWeight="500">
          {getLabel('recentSearches')}
        </Text>
        <Block marginTop={16}>
          {listCustomerNearly &&
            JSON.parse(listCustomerNearly).map((item: any, index: number) => {
              return (
                <Block
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginVertical={6}>
                  <Text
                    onPress={() => {
                      dispatch(appActions.setSearchCustomerValue(item.label));
                      navigation.goBack();
                    }}
                    colorTheme="text_primary"
                    style={{width: '80%'}}>
                    {item.label}
                  </Text>
                  <SvgIcon
                    source="Close"
                    color={theme.colors.text_secondary}
                    size={24}
                    onPress={() => handleItem(item)}
                  />
                </Block>
              );
            })}
        </Block>
      </Block>
    );
  };

  const onSubmitEnditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    dispatch(appActions.setSearchCustomerValue(String(e.nativeEvent.text)));
    const newListNearly = listCustomerNearly && JSON.parse(listCustomerNearly);
    newListNearly.push({label: String(e.nativeEvent.text)});
    setListCustomerNearly(JSON.stringify(newListNearly));
    navigation.goBack();
  };
  useEffect(() => {
    if (!listCustomerNearly) {
      setListCustomerNearly(JSON.stringify([]));
    }
  }, []);

  return (
    <MainLayout>
      <Block
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        width={'100%'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcon size={24} source="arrowLeft" colorTheme="text_primary" />
        </TouchableOpacity>
        <Searchbar
          placeholder={getLabel('pSearchCustomer')}
          value={searchValue}
          onChangeText={setSearchValue}
          onSubmitEditing={onSubmitEnditing}
          icon={ImageAssets.SearchIcon}
          placeholderTextColor={theme.colors.text_disable}
          inputStyle={{color: theme.colors.text_primary}}
          style={styles(theme).searchBar}
        />
      </Block>
      <SearchNearly />
    </MainLayout>
  );
};

export default SearchCustomer;

const styles = (theme: AppTheme) =>
  StyleSheet.create({
    searchBar: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 10,
      width: '90%',
      marginLeft: 12,
    } as ViewStyle,
  });
