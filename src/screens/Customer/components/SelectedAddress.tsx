import React, {FC, useEffect, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {Block, SvgIcon} from '../../../components/common';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {ImageAssets} from '../../../assets';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {AddressSelected, AddressType} from './FormAddress';
import {ResponseGenerator} from '../../../saga/app-saga/saga';
import {AppService} from '../../../services';
import {ApiConstant, AppConstant} from '../../../const';
import {IFilterType} from '../../../components/common/FilterListComponent';
import {
  ListCity,
  ListDistrict,
  ListWard,
} from '../../../redux-store/app-reducer/type';
import {useTranslation} from 'react-i18next';
const SelectedAddress: FC<SelectedAddressProps> = ({
  setScreen,
  data,
  setData,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);
  const {t: getLabel} = useTranslation();

  const [searchValue, setSearch] = useState<string>('');
  const [listCity, setListCity] = useState<IFilterType[]>([]);

  const handleItem = (item: IFilterType) => {
    const type =
      data.length === 0
        ? AddressType.city
        : data.length === 1
        ? AddressType.ward
        : data.length === 2
        ? AddressType.district
        : '';
    setData([
      ...data,
      {type: type, value: item.label!.toString(), id: item.value},
    ]);
  };

  const ListAddressSelected = (item: AddressSelected, isBorder: boolean) => {
    return (
      <View
        style={{
          paddingBottom: 8,
          width: AppConstant.WIDTH,
          alignSelf: 'center',
          marginTop: 16,
          borderBottomWidth: isBorder ? 8 : 0,
          borderBottomColor: theme.colors.divider,
          paddingHorizontal: 16,
        }}>
        <Text style={{color: theme.colors.text_primary}}>
          {item.type === AddressType.city
            ? `${getLabel('province')}/${getLabel('city')}`
            : item.type === AddressType.ward
            ? getLabel('district')
            : getLabel('ward')}
        </Text>
        <Text
          style={{
            marginTop: 16,
            color: theme.colors.action,
            fontSize: 16,
            fontWeight: '500',
          }}>
          {item.value}
        </Text>
      </View>
    );
  };

  const ListAddressContent = () => {
    return (
      <View
        style={{
          marginTop: 16,
        }}>
        <Text style={{color: theme.colors.text_primary}}>
          {data.length === 0
            ? `${getLabel('province')}/${getLabel('city')}`
            : data.length === 1
            ? getLabel('district')
            : data.length === 2
            ? getLabel('ward')
            : ''}
        </Text>
        {listCity.length > 0 && (
          <FlatList
            style={{marginTop: 16, height: data.length === 0 ? '80%' : '70%'}}
            data={listCity}
            renderItem={({item}) => (
              <Pressable
                style={{marginVertical: 8}}
                onPress={() => handleItem(item)}>
                <Text style={{color: theme.colors.text_primary, fontSize: 16}}>
                  {item.label}
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  const getListCity = async () => {
    switch (data.length) {
      case 0: {
        const response: ResponseGenerator = await AppService.getListCity();
        if (response.status === ApiConstant.STT_OK) {
          const newCity: IFilterType[] = response.data.result.map(
            (item: ListCity) => {
              return {
                label: item.ten_tinh,
                value: item.ma_tinh,
                isSelected: false,
              };
            },
          );
          setListCity(newCity);
        }
        break;
      }
      case 1: {
        const response: ResponseGenerator = await AppService.getListDistrict(
          data[0].id,
        );
        if (response.status === ApiConstant.STT_OK) {
          const newCity: IFilterType[] = response.data.result.map(
            (item: ListDistrict) => {
              return {
                label: item.ten_huyen,
                value: item.ma_huyen,
                isSelected: false,
              };
            },
          );
          setListCity(newCity);
        }
        break;
      }
      case 2: {
        const response: ResponseGenerator = await AppService.getListWard(
          data[1].id,
        );
        if (response.status === ApiConstant.STT_OK) {
          const newCity: IFilterType[] = response.data.result.map(
            (item: ListWard) => {
              return {
                label: item.ten_xa,
                value: item.ma_xa,
                isSelected: false,
              };
            },
          );
          setListCity(newCity);
        }
        break;
      }
    }
  };

  useEffect(() => {
    getListCity();
  }, [data.length]);

  return (
    <MainLayout style={{paddingHorizontal: 16}}>
      <Block
        direction="row"
        // paddingHorizontal={16}
        alignItems="center"
        justifyContent="flex-start"
        width={'100%'}>
        <TouchableOpacity onPress={() => setScreen('')}>
          <SvgIcon size={24} source="arrowLeft" colorTheme="text_primary" />
        </TouchableOpacity>
        <Searchbar
          placeholder={getLabel('search')}
          value={searchValue}
          onChangeText={setSearch}
          onSubmitEditing={e => console.log(e.nativeEvent.text)}
          icon={ImageAssets.SearchIcon}
          placeholderTextColor={theme.colors.text_disable}
          inputStyle={{color: theme.colors.text_primary}}
          style={styles.searchBar}
        />
      </Block>
      {data.map((item, index) => {
        return (
          <View key={index}>
            {ListAddressSelected(item, index === data.length - 1)}
          </View>
        );
      })}
      <ListAddressContent />
    </MainLayout>
  );
};
interface SelectedAddressProps {
  setScreen: (text: string) => void;
  data: AddressSelected[];
  setData: (data: AddressSelected[]) => void;
}
export default SelectedAddress;
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    searchBar: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 10,
      width: '90%',
      marginLeft: 12,
    } as ViewStyle,
  });
