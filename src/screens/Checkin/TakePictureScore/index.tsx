import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppBottomSheet,
  AppHeader,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {CameraUtils} from '../../../utils';
import {RootStackParamList, goBack, navigate} from '../../../navigation';
import isEqual from 'react-fast-compare';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useDisableBackHandler, useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {IUser} from '../../../models/types';
import {dispatch} from '../../../utils/redux';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import ListAlbum from './listAlbum';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import ListProgram from './listProgram';
import {Modal} from 'react-native-paper';
import {ScreenConstant} from '../../../const';
import {ImageAssets} from '../../../assets';

const TakePictureScore = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [albumImage, setAlbumImage] = React.useState<any[]>([]);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState(false);
  const itemParams =
    useRoute<RouteProp<RootStackParamList, 'TAKE_PICTURE_SCORE'>>().params.data;
    const screen=    useRoute<RouteProp<RootStackParamList, 'TAKE_PICTURE_SCORE'>>().params.screen
  const snapPoints = React.useMemo(() => ['45%'], []);
  const bottomSheetRef = React.useRef<BottomSheetMethods>();
  const userInfor: IUser = useSelector(
    state => state.app.userProfile,
    shallowEqual,
  );
  const listProgram = useSelector(
    state => state.checkin.listProgramCampaign,
    shallowEqual,
  );
  const listProgramSelected = useSelector(
    state => state.checkin.selectedProgram,
    shallowEqual,
  );
  const listImageSelected = useSelector(
    state => state.checkin.listImageSelect,
    shallowEqual,
  );
  
  useDisableBackHandler(true);

  const onPressConfirm = useCallback(
    async (listProgram: any[]) => {
      await dispatch(checkinActions.setListImageSelect(selectedImages));
      bottomSheetRef?.current?.close();
      const newArray = listProgram.map((item:any,index:number) =>({
        title:item,
        image:selectedImages[index] ? selectedImages[index] : []
      }))
       dispatch(checkinActions.setListImageProgram(newArray))
       console.log(newArray,'bbbb')
      try {
        setLoading(true);

        for (let i = 0; i < selectedImages.length; i++) {
          const formData = new FormData(); // Create a new FormData object for each image
          formData.append('folder', 'Home');
          formData.append('is_private', 0);
          let parts = selectedImages[i].split('/');
          const trimmedURI =
            Platform.OS === 'android'
              ? selectedImages[i]
              : selectedImages[i].replace('file://', '');
          const fileData = {
            uri: trimmedURI,
            type: 'image/jpeg',
            name: parts[parts.length - 1],
          };
          formData.append('file', fileData);
          console.log(formData, 'formData');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay if needed
          await dispatch(checkinActions.postImageScore(formData));
        }
      } catch (err) {
        console.log('Error uploading images:', err);
      } finally {
        setSelectedImages([]);
        setLoading(false);
      }
    },
    [selectedImages],
  );

  const handleCameraPicture = React.useCallback(async () => {
    await CameraUtils.openImagePicker((img, base64) => {
      setAlbumImage(prevImages => {
        if (prevImages.length === 0) {
          // If no images exist, add the new image as the initial picture
          return ['IconCamera', ...prevImages.slice(1), img];
        } else {
          // If images exist, keep the initial picture at index 0 and add the new image at the end
          return [prevImages[0], ...prevImages.slice(1), img];
        }
      });
    });
  }, [selectedImages]);

  const handleSelectImage = useCallback(
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

      // Update the order of selected images array
    },
    [selectedImages, setSelectedImages],
  );
  const onPressMarkProgram = () => {
    if (listProgramSelected < listProgram) {
      setShowModal(true);
    } else {
      navigate(ScreenConstant.LIST_ALBUM_SCORE,{
        data:itemParams
      });
    }
  };

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

  useEffect(() => {
    const data = {
      customer_code: itemParams.kh_ten,
      e_name: userInfor.employee,
    };
    dispatch(checkinActions.getListProgram(data));
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
        label={
          listProgram && listProgram.length > 0
            ? `Chấm điểm: ${
                listProgramSelected && listProgramSelected.length > 0
                  ? listProgramSelected.length
                  : 0
              }/${listProgram.length}`
            : 'Chấm điểm'
        }
        onBack={() => goBack()}
      />
      <Block justifyContent="center" alignItems="center">
        <Text textAlign="center" fontSize={12} colorTheme="bg_disable">
          Vui lòng chọn ảnh để chấm điểm trưng bày
        </Text>
      </Block>

      {albumImage.length === 0 ? (
        <EmptyAlbum />
      ) : (
        <ListAlbum
          albumImage={albumImage}
          listImageResponse={listImageSelected}
          selectedImages={selectedImages}
          handleCameraPicture={handleCameraPicture}
          handleSelectImage={handleSelectImage}
          theme={theme}
          onPressAdding={() => bottomSheetRef.current?.snapToIndex(0)}
        />
      )}
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={snapPoints}>
        <ListProgram
          bottomSheetMethod={bottomSheetRef}
          data={listProgram}
          onPressConfirm={(listProgram: any) => onPressConfirm(listProgram)}
        />
      </AppBottomSheet>

      {albumImage.length >= 1 && (
        <Block marginBottom={8}>
          <TouchableOpacity
            style={styles.buttonEnd(listProgramSelected.length)}
            disabled={listProgramSelected.length > 0 ? false : true}
            onPress={onPressMarkProgram}>
            <Text fontSize={14} fontWeight="bold" colorTheme="white">
              Chấm điểm trưng bày
            </Text>
          </TouchableOpacity>
        </Block>
      )}
      <Modal visible={loading} style={styles.modal}>
        <Block
          borderRadius={16}
          justifyContent="center"
          alignItems="center"
          colorTheme="white"
          padding={80}>
          <ActivityIndicator size="large" color={theme.colors.action} />
          <Text>Đang tải ảnh, từ từ</Text>
        </Block>
      </Modal>
      <Modal visible={showModal} style={styles.modalError}>
        <Block
          borderRadius={16}
          justifyContent="center"
          alignItems="center"
          colorTheme="white">
          <Image source={ImageAssets.ErrorApiIcon} style={styles.errorIcon} />
          <Block
            marginLeft={16}
            marginRight={16}
            marginBottom={16}
            marginTop={16}
            paddingHorizontal={16}>
            <Text textAlign="center" fontSize={16}>
              Còn {listProgram.length - listProgramSelected.length} chương trình chưa chấm điểm, bạn có muốn tiếp tục?
            </Text>
            <Block
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginTop={30}>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => setShowModal(false)}>
                <Text
                  fontSize={14}
                  lineHeight={24}
                  fontWeight="700"
                  colorTheme="text_secondary">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContinue} onPress={() => navigate(ScreenConstant.LIST_ALBUM_SCORE,{data:itemParams})}>
                <Text
                  fontSize={14}
                  lineHeight={24}
                  fontWeight="700"
                  colorTheme="white">
                  Tiếp tục
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(TakePictureScore, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    buttonEnd: (length: number) =>
      ({
        justifyContent: 'center',
        backgroundColor:
          length > 0 ? theme.colors.primary : theme.colors.bg_disable,
        alignItems: 'center',
        borderRadius: 16,
        height: 36,
      } as ViewStyle),
    errorIcon: {
      width: 66,
      height: 66,
      marginBottom: 8,
      marginTop: 16,
    } as ImageStyle,
    buttonCancel: {
      justifyContent: 'center',
      backgroundColor: theme.colors.bg_neutral,
      flex: 1,
      borderRadius: 16,
      height: 36,
      alignItems: 'center',
      marginHorizontal: 4,
    } as ViewStyle,
    buttonContinue: {
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      flex: 1,
      borderRadius: 16,
      height: 36,
      alignItems: 'center',
      marginHorizontal: 4,
    } as ViewStyle,
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
    modal: {
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
      width: '100%',
    } as ViewStyle,
    modalError: {
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
      // width: '100%',
      marginHorizontal: 16,
    } as ViewStyle,
  });
