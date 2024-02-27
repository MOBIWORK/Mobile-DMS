import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  ExtendedTheme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
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
import {IAlbumImage, ImageCheckIn} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {CameraUtils} from '../../../utils';
import {RouterProp} from '../../../navigation';
import {CheckinData} from '../../../services/appService';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import { dispatch } from '../../../utils/redux';
import { useSelector } from '../../../config/function';
import { checkinActions } from '../../../redux-store/checkin-reducer/reducer';
const TakePicture = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [albumBottomSheet, setAlbumBottomSheet] =
    useState<IFilterType[]>(ListAlbumFake);
  const [albumImageData, setAlbumImageData] = useState<IAlbumImage[]>([]);
  const params = useRoute<RouterProp<'TAKE_PICTURE_VISIT'>>().params;
  const dataCheckIn = useRef<CheckinData>(params.data);
  const categoriesCheckin = useSelector(state => state.checkin.categoriesCheckin)
  const [message,setMessage] = useState<string>('')
  const data = useRef<ImageCheckIn>({
    album_id: '',
    album_name: '',
    address: '',
    customer_code: dataCheckIn.current?.kh_ma,
    checkin_id: dataCheckIn?.current.checkin_id,
    customer_id: dataCheckIn?.current.kh_ma,
    customer_name: dataCheckIn?.current.kh_ten,
    image: '',
    lat: dataCheckIn?.current.checkin_lat
      ? dataCheckIn?.current.checkin_lat
      : 0,
    long: dataCheckIn?.current.checkin_long
      ? dataCheckIn?.current.checkin_long
      : 0,
  });

  const [loading, setLoading] = useState(false);

  const handlePushImageData = useCallback(async () => {
    let totalItemsProcessed = 0;
    try {
      setLoading(true);

      for (let index = 0; index < albumImageData.length; index++) {
        if (data?.current) {
          data.current.album_id = String(albumImageData[index].id);
          data.current.album_name = albumImageData[index].label;
        }
        const element = albumImageData[index].image;
        for (let i = 0; i < element.length; i++) {
          let image = element[i];
          if (data?.current) {
            data.current.image = image.base64!;
            dispatch(appActions.postImageCheckIn(data?.current));
            totalItemsProcessed++;
          }
        }
      }

     
    } catch (error) {
      console.error('Error during image processing', error);
    } finally {
      setLoading(false);
      setMessage(`Done processing ${totalItemsProcessed-1} items`)
      console.log(`Done processing ${totalItemsProcessed-1} items`);
    }
    completeCheckin();
  }, [albumImageData, data]);

  const completeCheckin = () => {
    const newData = categoriesCheckin.map(item => item.key === "camera" ? ({ ...item, isDone: true }) : item);
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    navigation.goBack();
}



  const handleCamera = async (item: IAlbumImage) => {
    await CameraUtils.openImagePickerCamera((img, base64) => {
      const newListImage = [
        ...item.image,
        {url: img || '', base64: base64 || ''},
      ];
      const newItem: IAlbumImage = {
        ...item,
        image: newListImage,
      };

      setAlbumImageData(prevState => {
        const updatedState = [
          ...prevState.filter(itemPre => itemPre.label !== newItem.label),
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
      ...prevState.filter(itemPre => itemPre.label !== newItem.label),
      newItem,
    ]);
  };

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

  const AlbumItem = useCallback(
    (itemAlbum: IAlbumImage) => {
      return (
        <View style={styles.album}>
          <View style={styles.row}>
            <Button mode={'text'} icon={'chevron-down'}>
              {itemAlbum.label}
            </Button>
            <SvgIcon source={'TrashIcon'} size={25} />
          </View>
          <View style={styles.imgContainer}>
            <FlatList
              numColumns={3}
              data={itemAlbum.image}
              renderItem={({item, index}) => {
                return (
                  <>
                    {index === 0 ? (
                      <View style={{padding: 5, marginHorizontal: 4}}>
                        <Pressable
                          onPress={() => handleCamera(itemAlbum)}
                          style={styles.cameraImg}>
                          <SvgIcon source={'IconCamera'} size={24} />
                        </Pressable>
                      </View>
                    ) : (
                      <View
                        style={{padding: 5, rowGap: 8, marginHorizontal: 4}}>
                        <View style={styles.img}>
                          <Image
                            // @ts-ignore
                            source={{uri: item.url}}
                            style={{width: '100%', height: '100%'}}
                            resizeMode={'contain'}
                          />
                        </View>
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
                      </View>
                    )}
                  </>
                );
              }}
            />
          </View>
        </View>
      );
    },
    [handleCamera, albumBottomSheet],
  );

  return (
    <MainLayout style={{backgroundColor: theme.colors.bg_neutral}}>
      <AppHeader
        style={styles.header}
        label={'Chụp ảnh'}
        onBack={() => navigation.goBack()}
      />
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
      <View style={styles.body}>
        {albumImageData.length > 0 ? (
          <AppContainer style={{width: AppConstant.WIDTH - 32}}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {albumImageData.map((item, index) => {
                return (
                  <View key={index} style={{width: '100%', marginVertical: 8}}>
                    {AlbumItem(item)}
                  </View>
                );
              })}
            </View>
          </AppContainer>
        ) : (
          <EmptyAlbum />
        )}
      </View>
      <View style={styles.footer}>
        <AppButton
          style={{width: '100%'}}
          label={'Hoàn thành'}
          onPress={handlePushImageData}
        />
      </View>
      <SelectAlbum
        bottomSheetRef={bottomSheetRef}
        data={albumBottomSheet}
        setData={setAlbumBottomSheet}
        albumImageData={albumImageData}
        setAlbumImageData={setAlbumImageData}
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
      paddingHorizontal: 8,
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
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: 8,
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
  });

const ListAlbumFake: any[] = [
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
