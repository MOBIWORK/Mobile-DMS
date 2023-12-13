import React, {FC, memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Text, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {Searchbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {IProductInventory} from '../../../models/types';
import {CommonUtils} from '../../../utils';
const Inventory: FC<InventoryProps> = ({inventoryData}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();

  const [data, setData] = useState<IProductInventory[]>([]);

  const [searchValue, setSearch] = useState<string>('');

  useEffect(() => {
    if (data.length === 0) {
      setData(inventoryData);
    }
  }, []);

  return (
    <View style={{marginTop: 16}}>
      <Searchbar
        style={{
          backgroundColor: colors.bg_default,
          borderRadius: 10,
          width: '95%',
          marginLeft: 12,
        }}
        placeholder={getLabel('searchInventory')}
        placeholderTextColor={colors.text_disable}
        icon={ImageAssets.SearchIcon}
        value={searchValue}
        onChangeText={text =>
          CommonUtils.handleSearch(text, setSearch, inventoryData, setData)
        }
        inputStyle={{color: colors.text_primary}}
      />
      {data &&
        data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                margin: 16,
                padding: 16,
                borderRadius: 16,
                backgroundColor: colors.bg_default,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                  paddingBottom: 8,
                }}>
                <Image
                  source={ImageAssets.HomeFillIcon}
                  style={{width: 24, height: 24}}
                  resizeMode={'cover'}
                />
                <Text
                  style={{
                    color: colors.text_primary,
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: 8,
                  }}>
                  {item.label}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 16, color: colors.text_secondary}}>
                  {getLabel('inventoryNumber')}
                </Text>
                <Text style={{fontSize: 16, color: colors.text_primary}}>
                  {item.count}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};
interface InventoryProps {
  inventoryData: IProductInventory[];
}
export default memo(Inventory);
