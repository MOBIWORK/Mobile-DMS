import {
  FlatList,
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppHeader,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {CameraUtils} from '../../../utils';
import {AppConstant} from '../../../const';
import {RootStackParamList, goBack} from '../../../navigation';
import isEqual from 'react-fast-compare';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';

const TakePictureScore = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [albumImage, setAlbumImage] = React.useState<any[]>(['IconCamera']);
  const [selectedImages, setSelectedImages] = React.useState<string[]>(['']);
  const itemParams =
    useRoute<RouteProp<RootStackParamList, 'TAKE_PICTURE_SCORE'>>().params.data;
  const userInfor = useSelector(state => state.app.userProfile, shallowEqual);

  const handleCameraPicture = async () => {
    await CameraUtils.openImagePickerCamera((img, base64) => {
      setAlbumImage(prevImages => {
        const updatedImages = [
          ...prevImages.slice(0, -1),
          img,
          prevImages[prevImages.length - 1],
        ];
        return updatedImages;
      });
    });
  };

  const handleSelectImage = React.useCallback(
    (image: string) => {
      if (selectedImages.includes(image)) {
        // If the image is already selected, remove it from the selectedImages array
        setSelectedImages(prevSelectedImages =>
          prevSelectedImages.filter(selectedImage => selectedImage !== image),
        );
      } else {
        // If the image is not selected, add it to the selectedImages array
        setSelectedImages(prevSelectedImages => [...prevSelectedImages, image]);
      }
    },
    [albumImage],
  );

  const EmptyAlbum = React.useCallback(() => {
    return (
      <Block middle block justifyContent="center">
        <SvgIcon source={'TakePicture'} size={90} />
        <Text style={{color: theme.colors.text_secondary}}>
          Thêm album để chụp ảnh
        </Text>
        <TouchableOpacity
          style={styles.emptyAlbumAdding}
          onPress={() => handleCameraPicture()}>
          <Text fontSize={14} colorTheme="action">
            {' '}
            + Thêm ảnh chụp
          </Text>
        </TouchableOpacity>
      </Block>
    );
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
        paddingHorizontal: 16,
        flex: 1,
      }}
      edges={['top', 'bottom']}>
      <AppHeader
        style={styles.header}
        label={'Chấm điểm trưng bày'}
        onBack={() => goBack()}
      />

      {albumImage.length === 1 ? (
        <EmptyAlbum />
      ) : (
        <FlatList
          numColumns={3}
          data={albumImage}
          keyExtractor={(item, index) => index.toString()}
          decelerationRate={'fast'}
          renderItem={({item, index}) => {
            return (
              <Block padding={5} alignItems="center">
                {index === albumImage.length - 1 ? (
                  <Block marginRight={4}>
                    <Pressable
                      style={styles.cameraImg}
                      onPress={() => handleCameraPicture()}>
                      <SvgIcon source={'IconCamera'} size={24} />
                    </Pressable>
                  </Block>
                ) : (
                  <TouchableOpacity onPress={() => handleSelectImage(item)}>
                    <Image
                      source={{uri: item}}
                      style={styles.cameraImg as ImageStyle}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </Block>
            );
          }}
        />
      )}
      {albumImage.length > 1 && (
        <Block>
          <TouchableOpacity>
            <Text>Tiếp tục</Text>
          </TouchableOpacity>
        </Block>
      )}
    </SafeAreaView>
  );
};

export default React.memo(TakePictureScore, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      // flex: 1,
      marginBottom: 12,
      alignItems: 'flex-start',
    } as ViewStyle,
    emptyAlbumAdding: {
      borderWidth: 1,
      borderColor: theme.colors.action,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      // height:30,
      paddingHorizontal: 16,
      marginTop: 8,
      paddingVertical: 8,
      // marginHorizontal:16
    } as ViewStyle,
    imageStyle: {
      width: AppConstant.WIDTH * 0.25,
      height: AppConstant.WIDTH * 0.25,
    },
    cameraImg: {
      width: AppConstant.WIDTH * 0.28,
      height: AppConstant.WIDTH * 0.28,
      borderRadius: 12,
      backgroundColor: theme.colors.bg_neutral,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
    img: {
      width: AppConstant.WIDTH * 0.28,
      height: AppConstant.WIDTH * 0.28,
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
    buttonPicture: {} as ViewStyle,
  });
