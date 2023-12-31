import React, {FC} from 'react';
import {AppHeader, AppIcons} from './index';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {MainLayout} from '../../layouts';
import {AppConstant} from '../../const';
import {useTheme} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
import {ImageAssets} from '../../assets';
import {
  Image,
  NativeSyntheticEvent,
  Text,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';

const FilterListComponent: FC<FilterListComponentProps> = ({
  title,
  searchPlaceholder,
  data,
  onChangeSearch,
  searchValue,
  handleItem,
  onClose,
  onSubmitEditing,
}) => {
  const {colors} = useTheme();
  return (
    <MainLayout style={{backgroundColor: colors.bg_default, paddingTop: 16}}>
      <AppHeader
        label={title}
        labelStyle={{fontSize: 18}}
        onBack={onClose}
        backButtonIcon={
          <AppIcons
            iconType={AppConstant.ICON_TYPE.IonIcon}
            name={'close'}
            size={24}
            color={colors.text_primary}
          />
        }
      />
      {searchValue && onChangeSearch && (
        <Searchbar
          style={{
            backgroundColor: colors.bg_neutral,
            borderRadius: 10,
            marginTop: 16,
          }}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.text_disable}
          icon={ImageAssets.SearchIcon}
          value={searchValue}
          onChangeText={onChangeSearch}
          inputStyle={{color: colors.text_primary}}
          onSubmitEditing={onSubmitEditing}
        />
      )}
      <BottomSheetScrollView
        style={{flex: 1, marginTop: 16}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          {data.map((item, index) => {
            return (
              <TouchableOpacity
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
                onPress={() => handleItem(item)}
                key={index}>
                <Text style={{color: colors.text_primary}}>{item.label}</Text>
                <Image
                  source={ImageAssets.CheckIcon}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: item.isSelected
                      ? colors.primary
                      : colors.bg_default,
                  }}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </MainLayout>
  );
};
interface FilterListComponentProps {
  title: string | undefined;
  searchPlaceholder?: string;
  data: IFilterType[] | [];
  handleItem: (item: IFilterType) => void;
  searchValue?: string;
  onChangeSearch?: (text: string) => void;
  onClose: () => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
}
export default FilterListComponent;

export type IFilterType = {
  label: string;
  value?: string | number;
  isSelected: boolean;
};
