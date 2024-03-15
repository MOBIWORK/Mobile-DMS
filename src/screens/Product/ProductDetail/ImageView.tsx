import React, {useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppHeader, AppIcons} from '../../../components/common';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation/screen-type';
import {FlatList, Image, ImageStyle, Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {AppConstant} from '../../../const';
import { useTranslation } from 'react-i18next';

const ImageView = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouterProp<'IMAGE_VIEW'>>();
  const {t :getLabel} = useTranslation();
  const {colors} = useTheme();

  const [displayImage, setDisplayImage] = useState<boolean>(false);
  const [image, setImage] = useState<any>('');

  return (
    <MainLayout style={{ backgroundColor: displayImage ? 'black' : colors.bg_neutral, paddingHorizontal: 0}}>
      <AppHeader
        style={{marginHorizontal: 16}}
        label={displayImage ? undefined : getLabel("image")}
        backButtonIcon={
          displayImage ? (
            <AppIcons
              iconType={AppConstant.ICON_TYPE.AntIcon}
              name={'close'}
              size={24}
              color={'white'}
            />
          ) : undefined
        }
        onBack={
          displayImage
            ? () => setDisplayImage(false)
            : () => navigation.goBack()
        }
      />
      {!displayImage ? (
        <FlatList
          style={{marginTop: 16}}
          data={route.params.data}
          renderItem={({item}) => {
            return (
              <Pressable onPress={() => { setImage(item); setDisplayImage(true)}}
                style={[styles.imgContainer,{backgroundColor: colors.bg_default}]}>
                <Image source={{ uri :item.link_image }} style={styles.img} resizeMode="cover" />
              </Pressable>
            );
          }}
          numColumns={3}
        />
      ) : (
        <View
          style={{
            marginTop: 16,
            width: '100%',
            height: AppConstant.HEIGHT * 0.75,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={image}
            style={{width: '100%', height: '100%'}}
            resizeMode={'contain'}
          />
        </View>
      )}
    </MainLayout>
  );
};
export default ImageView;
const styles = StyleSheet.create({
  imgContainer: {
    width: AppConstant.WIDTH * 0.32,
    height: AppConstant.WIDTH * 0.32,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }as ViewStyle ,
  img: {
    width: AppConstant.WIDTH * 0.3,
    height: AppConstant.WIDTH * 0.3,
    marginHorizontal: 4,
  } as ImageStyle,
});
