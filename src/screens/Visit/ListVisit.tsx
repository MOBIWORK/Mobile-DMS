import React from 'react';
import {MainLayout} from '../../layouts';
import {AppHeader, FilterView} from '../../components/common';
import {Image, Text, View} from 'react-native';
import {ImageAssets} from '../../assets';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../navigation';
import {VisitListItem} from '../../models/types';
const ListVisit = () => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();

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
              <Image
                source={ImageAssets.SearchIcon}
                style={{width: 24, height: 24, marginLeft: 16}}
                tintColor={colors.text_secondary}
                resizeMode={'cover'}
              />
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
            onPress={() => console.log('123')}
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
      </View>
    );
  };

  const VisitItem = (item: VisitListItem) => {
    return (
      <View
        style={{
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.bg_default,
        }}
        >
      </View>
    );
  };

  return (
    <MainLayout>
      {_renderHeader()}
      {_renderContent()}
    </MainLayout>
  );
};
export default ListVisit;
