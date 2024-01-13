import React, {FC, memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Text, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {Searchbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {StockProduct} from '../../../models/types';

const Inventory: FC<InventoryProps> = ({inventoryData}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();

  const [data, setData] = useState<StockProduct[]>(inventoryData);

  const [searchValue, setSearch] = useState<string>('');

  const onChangeSearcData = ()=>{
    const newArr = inventoryData.filter(item => item.t_warehouse.includes(searchValue))
    setData(newArr)
  }

  useEffect(()=>{
    onChangeSearcData()
  },[searchValue])

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
        onChangeText={text =>setSearch(text)}
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
                  {item.t_warehouse}
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
                  {item.qty}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};
interface InventoryProps {
  inventoryData: StockProduct[];
}
export default memo(Inventory);
