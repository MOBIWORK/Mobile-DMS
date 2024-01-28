import React, {useEffect, useRef, useState,useCallback} from 'react';
import {ExtendedTheme, useNavigation, useTheme} from '@react-navigation/native';
import {MainLayout} from '../../../layouts';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  AppButton,
  AppContainer,
  AppHeader,
  SvgIcon,
} from '../../../components/common';
import {Button} from 'react-native-paper';
import {IFilterType} from '../../../components/common/FilterListComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAlbum from './SelectAlbum';
import {IAlbumImage} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {CameraUtils} from '../../../utils';
const TakePicture = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation()
  const [albumBottomSheet, setAlbumBottomSheet] =
    useState<IFilterType[]>(ListAlbumFake);
  const [albumImageData, setAlbumImageData] =
    useState<IAlbumImage[]>(AlbumImageFake);

  const handleCamera = () => {
    console.log('123');
    CameraUtils.openImagePickerCamera(image => console.log('image', image));
  };

  useEffect(() => {}, [albumBottomSheet]);

  const EmptyAlbum = () => {
    return (
      <>
        <SvgIcon source={'EmptyImg'} size={90} />
        <Text style={{color: theme.colors.text_secondary}}>
          Thêm album để chụp ảnh
        </Text>
        <Button
          style={{marginTop: 16, borderColor: theme.colors.action}}
          icon={'plus'}
          mode={'outlined'}
          labelStyle={{color: theme.colors.action}}
          onPress={() =>
            bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
          }>
          Thêm album
        </Button>
      </>
    );
  };

  const AlbumItem = useCallback((item: IAlbumImage) => {
    return (
      <View style={styles.album}>
        <View style={styles.row}>
          <Button mode={'text'} icon={'chevron-down'}>
            {item.label}
          </Button>
          <SvgIcon source={'TrashIcon'} size={25} />
        </View>
        <View style={styles.imgContainer}>
          <Pressable onPress={handleCamera} style={styles.cameraImg}>
            <SvgIcon source={'IconCamera'} size={24} />
          </Pressable>
          <FlatList
            style={{marginLeft: 8}}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={item.image}
            renderItem={({item}) => {
              return (
                <>
                  <Pressable style={styles.img}>
                    <Image
                      // @ts-ignore
                      source={item}
                      style={{width: '100%', height: '100%'}}
                      resizeMode={'contain'}
                    />
                  </Pressable>
                  <TouchableOpacity
                    style={{position: 'absolute', top: 0, right: 8}}>
                    <Image
                      source={ImageAssets.CloseFameIcon}
                      style={{width: 20, height: 20}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      </View>
    );
  },[handleCamera,albumBottomSheet]);

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <AppHeader style={styles.header} label={'Chụp ảnh'}  onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={[styles.row, {width: '100%'}]}>
          <Text style={{color: theme.colors.text_secondary}}>Hình ảnh</Text>
          <Button
            onPress={() => bottomSheetRef.current?.snapToIndex(0)}
            mode={'text'}
            icon={'plus'}
            labelStyle={{color: theme.colors.action}}>
            Thêm album
          </Button>
        </View>
        <AppContainer>
          <>
            {albumImageData.map((item, index) => {
              return (
                <View key={index} style={{width: '100%', marginVertical: 8}}>
                  {AlbumItem(item)}
                </View>
              );
            })}
          </>
        </AppContainer>
        {/*<EmptyAlbum />*/}
      </View>
      <View style={styles.footer}>
        <AppButton
          style={{width: '100%'}}
          label={'Hoàn thành'}
          onPress={() => console.log('123')}
        />
      </View>
      <SelectAlbum
        bottomSheetRef={bottomSheetRef}
        data={albumBottomSheet}
        setData={setAlbumBottomSheet}
      />
    </MainLayout>
  );
};
export default TakePicture;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    header: {
      flex: 0.5,
      alignItems: 'flex-start',
    } as ViewStyle,
    body: {
      flex: 9,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    footer: {
      flex: 1,
      alignItems: 'flex-start',
    } as ViewStyle,
    album: {
      marginTop: 8,
      padding: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      width: '100%',
    } as ViewStyle,
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    imgContainer: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    cameraImg: {
      width: AppConstant.WIDTH * 0.25,
      height: AppConstant.WIDTH * 0.25,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_neutral,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    img: {
      marginHorizontal: 8,
      width: AppConstant.WIDTH * 0.25,
      height: AppConstant.WIDTH * 0.25,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_default,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
  });

const ListAlbumFake: IFilterType[] = [
  {
    label: 'Album 91',
    value: 1,
    isSelected: false,
  },
  {
    label: 'Hình ảnh cửa hàng 1',
    value: 2,
    isSelected: false,
  },
  {
    label: 'Album 2',
    value: 3,
    isSelected: false,
  },
  {
    label: 'Hình ảnh công ty',
    value: 4,
    isSelected: false,
  },
  {
    label: 'Tình trạng viếng thăm',
    value: 5,
    isSelected: false,
  },
  {
    label: 'Báo cáo khách hàng',
    value: 6,
    isSelected: false,
  },
  {
    label: 'album6',
    value: 7,
    isSelected: false,
  },
];
const AlbumImageFake: IAlbumImage[] = [
  {
    id: 1,
    label: 'Album 1',
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
  {
    id: 2,
    label: 'Album 2',
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
  {
    id: 3,
    label: 'Album 3',
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
];
