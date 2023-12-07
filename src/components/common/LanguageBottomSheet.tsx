import React, {FC} from 'react';
import {LanguageItemType} from '../../models/types';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../assets';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';

const LanguageBottomSheet: FC<LanguageBottomSheetProps> = ({
  data,
  handleItem,
}) => {
  const {colors} = useTheme();

  const bottomSheetRenderItem = (item: LanguageItemType) => (
    <TouchableOpacity
      onPress={() => handleItem(item.id, item.code)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        marginBottom: 16,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Image
          source={item.image}
          style={{width: 24, height: 24}}
          resizeMode="contain"
        />
        <Text style={{fontSize: 16, color: colors.text_primary, marginLeft: 8}}>
          {item.label}
        </Text>
      </View>
      {item.isSelected ? (
        <Image
          source={ImageAssets.CheckIcon}
          style={{width: 24, height: 24, tintColor: colors.primary}}
          resizeMode="contain"
        />
      ) : (
        <View style={{width: 24, height: 24}} />
      )}
    </TouchableOpacity>
  );

  return (
    <BottomSheetFlatList
      data={data}
      renderItem={({item}) => bottomSheetRenderItem(item)}
    />
  );
};
interface LanguageBottomSheetProps {
  data: LanguageItemType[];
  handleItem: (id: string, code: string) => void;
}

export default LanguageBottomSheet;
