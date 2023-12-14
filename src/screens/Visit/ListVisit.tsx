import React, {useRef} from 'react';
import {MainLayout} from '../../layouts';
import {AppHeader, FilterView} from '../../components/common';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../assets';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {VisitListItemType} from '../../models/types';
import VisitItem from './VisitItem';
import BottomSheet from '@gorhom/bottom-sheet';
import FilterContainer from './FilterContainer';
import {ScreenConstant} from '../../const';
import {useSelector} from 'react-redux';
import {AppSelector} from '../../redux-store';
const ListVisit = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const filterRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const searchVisitValue = useSelector(AppSelector.getSearchVisitValue);

  const _renderHeader = () => {
    return (
      <>
        <AppHeader
          hiddenBackButton
          label={'Viếng thăm'}
          labelStyle={{textAlign: 'left'}}
          rightButton={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={ImageAssets.MapIcon}
                style={{width: 24, height: 24}}
                tintColor={colors.text_secondary}
                resizeMode={'cover'}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ScreenConstant.SEARCH_VISIT)
                }>
                <Image
                  source={ImageAssets.SearchIcon}
                  style={{width: 24, height: 24, marginLeft: 16}}
                  tintColor={colors.text_secondary}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 8,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              maxWidth: 180,
            }}>
            <Text style={{color: colors.text_secondary}}>Khoảng cách:</Text>
            <Text style={{color: colors.text_primary, marginLeft: 8}}>
              Gần nhất
            </Text>
          </View>
          <FilterView
            style={{marginLeft: 12}}
            onPress={() =>
              bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
            }
          />
        </View>
      </>
    );
  };

  const _renderContent = () => {
    return (
      <View style={{marginTop: 24}}>
        <Text style={{color: colors.text_secondary}}>
          Viếng thăm 3/10 khách hàng
        </Text>
        <FlatList
          style={{height: '85%'}}
          showsVerticalScrollIndicator={false}
          data={VisitListData}
          renderItem={({item}) => <VisitItem item={item} />}
        />
      </View>
    );
  };

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
      {_renderHeader()}
      {_renderContent()}
      <FilterContainer bottomSheetRef={bottomSheetRef} filterRef={filterRef} />
    </MainLayout>
  );
};
export default ListVisit;

const VisitListData: VisitListItemType[] = [
  {
    label: 'Nintendo',
    status: true,
    address: '191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh',
    phone_number: '+84 667 435 265',
    lat: 10,
    long: 10,
    distance: 1,
  },
  {
    label: "McDonald's",
    status: false,
    address:
      'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
    phone_number: '+84 234 234 456',
    lat: 10,
    long: 10,
    distance: 1.5,
  },
  {
    label: 'General Electric',
    status: false,
    address:
      '495A Cách Mạng Tháng Tám, Phường 13, Quận 10, Thành phố Hồ Chí Minh',
    phone_number: '+84 234 234 456',
    lat: 10,
    long: 10,
    distance: 2,
  },
  {
    label: "McDonald's",
    status: false,
    address:
      'Lô A, Khu Dân Cư Cityland, 99 Nguyễn Thị Thập, Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam',
    phone_number: '+84 234 234 456',
    lat: 10,
    long: 10,
    distance: 1.5,
  },
];
