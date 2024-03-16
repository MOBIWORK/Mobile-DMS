import React from 'react';
import {AppCustomHeader} from '../../../components/common';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation';
import {MainLayout} from '../../../layouts';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {useTheme} from '../../../layouts/theme';
import { CommonUtils } from '../../../utils';
import RenderHTML from 'react-native-render-html';

const NoteDetail = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'NOTE_DETAIL'>>();
  const {colors} = useTheme();
  const params = route.params?.data ?? null;
  return (
    <MainLayout style={{paddingHorizontal: 0}}>
      <AppCustomHeader
        styles={{paddingHorizontal: 16}}
        onBack={() => navigation.goBack()}
        title={params.title}
        description={CommonUtils.convertDateToString(params.creation)}
        rightButton={
          <TouchableOpacity>
            <Image
              source={ImageAssets.IconKebab}
              resizeMode={'cover'}
              style={{width: 24, height: 24}}
              tintColor={colors.text_secondary}
            />
          </TouchableOpacity>
        }
      />
      <View
        style={{
          flex: 8,
          backgroundColor: colors.bg_neutral,
          paddingHorizontal :16,
        }}>
            <RenderHTML
              source={{html : params.content}}
              tagsStyles={{
                span :{fontSize :16 , color :colors.text_primary},
                p :{fontSize :16 ,color :colors.text_primary}
              }}
            />
      </View>
    </MainLayout>
  );
};
export default NoteDetail;
