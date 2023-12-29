import React from 'react';
import {AppCustomHeader} from '../../../components/common';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation';
import {MainLayout} from '../../../layouts';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {useTheme} from '../../../layouts/theme';
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
        title={params.noteType}
        description={`${params.time}, ${params.date}`}
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
          padding: 16,
          backgroundColor: colors.bg_neutral,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{color: colors.text_primary, fontSize: 16, lineHeight: 24}}>
          {params.content}
        </Text>
      </View>
    </MainLayout>
  );
};
export default NoteDetail;
