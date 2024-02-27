import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  Accordion,
  AppHeader,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {IAlbumImage} from '../../../models/types';
import {CameraUtils} from '../../../utils';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {goBack} from '../../../navigation';
import {IAlbumScore, fakeData} from './ultl';

type Props = {};

const TakePictureScore = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [albumImages, setAlbumImageData] =
    React.useState<IAlbumScore[]>(AlbumImageFake);

  const handleCamera = async (item: IAlbumScore) => {
    await CameraUtils.openImagePicker((img, base64) => {
      const newListImage = [
        ...item.image,
        {url: img || '', base64: base64 || ''},
      ];
      const newItem: IAlbumScore = {
        ...item,
        image: newListImage,
      };

      setAlbumImageData(prevState => {
        const updatedState = [
          ...prevState.filter(itemPre => itemPre.id !== newItem.id),
          newItem,
        ];

        return updatedState;
      });
    });
  };
  const onDeleteImageOfAlbum = (itemSelected: IAlbumImage, img: string) => {
    const newListImage = itemSelected.image.filter(item => item.url !== img);
    const newItem: IAlbumImage = {...itemSelected, image: newListImage};
    setAlbumImageData(prevState => [
      ...prevState.filter(itemPre => itemPre.id !== newItem.id),
      newItem,
    ]);
  };

  const AlbumItem = React.useCallback(
    (itemAlbum: IAlbumImage) => {
      return (
        <Block style={styles.album}>
          <Block style={styles.imgContainer}>
            <FlatList
              numColumns={3}
              data={itemAlbum.image}
              renderItem={({item, index}) => {
                return (
                  <>
                    {index === 0 ? (
                      <Block style={{padding: 5, marginHorizontal: 4}}>
                        <Pressable
                          onPress={() => handleCamera(itemAlbum)}
                          style={styles.cameraImg}>
                          <SvgIcon source={'IconCamera'} size={24} />
                        </Pressable>
                      </Block>
                    ) : (
                      <Block
                        style={{padding: 5, rowGap: 8, marginHorizontal: 4}}>
                        <Block style={styles.img}>
                          <Image
                            // @ts-ignore
                            source={{uri: item.url}}
                            style={{width: '100%', height: '100%'}}
                            resizeMode={'contain'}
                          />
                        </Block>
                        <TouchableOpacity
                          onPress={() =>
                            onDeleteImageOfAlbum(itemAlbum, item.url)
                          }
                          style={{position: 'absolute', top: 0, right: 8}}>
                          <Image
                            source={ImageAssets.CloseFameIcon}
                            style={{width: 20, height: 20}}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      </Block>
                    )}
                  </>
                );
              }}
            />
          </Block>
        </Block>
      );
    },
    [handleCamera],
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.bg_neutral,
        paddingHorizontal: 16,
        flex: 1,
      }}
      edges={['top', 'bottom']}>
      <AppHeader
        style={styles.header}
        label={'Chấm điểm trưng bày'}
        onBack={() => goBack()}
      />
      <Block direction="row" alignItems="center" justifyContent="space-between">
        <Text style={{color: theme.colors.text_secondary}}>
          Số chương trình: 4
        </Text>
      </Block>
      <Block marginTop={8} block>
        {fakeData.map((item, index) => {
          return (
            <Accordion
              key={item.id}
              title={item.title}
              type="nested"
              titleContainerStyle={{
                paddingHorizontal: 16,
                marginHorizontal: 16,
              }}
              containerStyle={{backgroundColor: 'white'}}>
              <Block block>
                <AlbumItem
                  id={item.id}
                  label=""
                  image={albumImages[index]?.image}
                  key={index}
                />
              </Block>
            </Accordion>
          );
        })}
      </Block>
      <Block>
        <TouchableOpacity style={styles.containButton}>
          <Text colorTheme="white" fontSize={12} fontWeight="bold">
            Tải ảnh
          </Text>
        </TouchableOpacity>
      </Block>
    </SafeAreaView>
  );
};

export default TakePictureScore;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      // flex: 1,
      marginBottom: 12,
      alignItems: 'flex-start',
    } as ViewStyle,
    cameraImg: {
      width: AppConstant.WIDTH * 0.25,
      height: AppConstant.WIDTH * 0.25,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_neutral,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    img: {
      width: AppConstant.WIDTH * 0.25,
      height: AppConstant.WIDTH * 0.25,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_default,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
    imgContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: 8,
    } as ViewStyle,
    album: {
      marginTop: 8,
      padding: 16,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      width: '100%',
    } as ViewStyle,
    backgroundRoot: {
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    containButton: {
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      height: 36,
    } as ViewStyle,
  });
const AlbumImageFake: IAlbumScore[] = [
  {
    id: 1,
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
  {
    id: 2,
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
  {
    id: 3,
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
  {
    id: 4,
    image: [
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
      ImageAssets.ImgAppWatch,
    ],
  },
];
