import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  startTransition,
} from 'react';
import {ExtendedTheme, useNavigation, useRoute} from '@react-navigation/native';
import {MainLayout} from '../../../layouts';
import {
  Alert,
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
  AppText,
  Block,
  SvgIcon,
} from '../../../components/common';
import {Button, Modal} from 'react-native-paper';
import {IFilterType} from '../../../components/common/FilterListComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAlbum from './SelectAlbum';
import {IAlbumImage, ImageCheckIn, ListAlbumType} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {CameraUtils} from '../../../utils';
import {RouterProp} from '../../../navigation/screen-type';
import {CheckinData} from '../../../services/appService';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {dispatch} from '../../../utils/redux';
import {useSelector} from '../../../config/function';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {shallowEqual} from 'react-redux';
import {useTheme} from '../../../layouts/theme';
import ProgressCircle from 'react-native-progress-circle';
import {CheckinService} from '../../../services';
import {useTranslation} from 'react-i18next';

export interface AlbumBottomSheet extends IFilterType {
  numPicsRequired?: string;
}

const TakePicture = () => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {t: getLabel} = useTranslation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const [albumBottomSheet, setAlbumBottomSheet] =
    useState<AlbumBottomSheet[]>();
  const [albumImageData, setAlbumImageData] = useState<IAlbumImage[]>([]);
  const params = useRoute<RouterProp<'TAKE_PICTURE_VISIT'>>().params;
  const [isDone, setDone] = useState(true);

  const dataCheckIn = useRef<CheckinData>(params.data);
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
    shallowEqual,
  );
  const listImage = useSelector(
    state => state.app.dataCheckIn?.listImage,
    shallowEqual,
  );
  const listImageLength = listImage?.length || 1;
  const [message, setMessage] = useState<number>(0);
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

  const handlePushImageData = async () => {
    if (albumImageData.length > 0) {
      let totalItemsProcessed = 0;
      try {
        setLoading(true);
        for (let index = 0; index < albumImageData.length; index++) {
          if (
            albumImageData[index].image.length - 1 >=
            albumImageData[index].numberImageReq
          ) {
            if (data?.current) {
              data.current.album_id = String(albumImageData[index].id + 1);
              data.current.album_name = albumImageData[index].label;
            }
            const element = albumImageData[index].image;
            for (let i = 1; i < element.length; i++) {
              let image = element[i];
              if (data?.current) {
                data.current.image = image?.base64!;
                await new Promise(resolve => setTimeout(resolve, 1500));
                totalItemsProcessed++;
                setMessage(totalItemsProcessed);
                dispatch(appActions.postImageCheckIn(data.current));
                setDone(true);
              }
            }
          } else {
            Alert.alert('Bạn chưa chụp đủ ảnh tối thiểu');
            setDone(false);
          }
        }
      } catch (error) {
        console.error('Error during image processing', error);
      } finally {
        dispatch(appActions.clearListImage([]));
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } else {
      Alert.alert('Bạn chưa hoàn thành bước chụp ảnh');
    }
  };

  const completeCheckin = () => {
    console.log('run ???')
    const newData = categoriesCheckin.map((item: any) =>
      item.key === 'camera' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    navigation.goBack();
    
  };

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
      const updatedState = albumImageData.map(itemState => {
        if (itemState.id === newItem.id) {
          return newItem;
        } else {
          return itemState;
        }
      });
      setAlbumImageData(updatedState);
    });
  };

  const onDeleteImageOfAlbum = (itemSelected: IAlbumImage, img: string) => {
    const newListImage = itemSelected.image.filter(item => item.url !== img);
    const newItem: IAlbumImage = {...itemSelected, image: newListImage};
    const updatedState = albumImageData.map(itemState => {
      if (itemState.id === newItem.id) {
        return newItem;
      } else {
        return itemState;
      }
    });
    setAlbumImageData(updatedState);
  };

  const onDeleteAlbum = (label: string) => {
    const newAlbum = albumImageData.filter(item => item.label !== label);
    const newAlbumBottomSheet = albumBottomSheet?.map(item => {
      if (item.label === label) {
        return {...item, isSelected: false};
      } else {
        return item;
      }
    });
    setAlbumImageData(newAlbum);
    setAlbumBottomSheet(newAlbumBottomSheet);
  };

  useEffect(() => {
    const getListAlbum = async () => {
      const res: any = await CheckinService.getListAlbum();
      if (res?.result?.length > 0) {
        const listAlbumResult: ListAlbumType[] = res.result;
        const listAlbum = listAlbumResult.map((item, index) => {
          return {
            id: item.ma_album,
            label: item.ten_album,
            value: item.ma_album,
            isSelected: false,
            numPicsRequired: item.so_anh_toi_thieu,
          };
        });
        setAlbumBottomSheet(listAlbum);
      }
    };
    getListAlbum();
  }, []);

  const EmptyAlbum = useCallback(() => {
    return (
      <>
        <SvgIcon source={'EmptyImg'} size={90} />
        <Text style={{color: theme.colors.text_secondary}}>
          {getLabel('addAlbumToTakePicture')}
        </Text>
        <Button
          style={{marginTop: 16, borderColor: theme.colors.action}}
          icon={'plus'}
          mode={'outlined'}
          labelStyle={{color: theme.colors.action}}
          onPress={() =>
            bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
          }>
          {getLabel('addAlbum')}
        </Button>
      </>
    );
  }, []);

  const AlbumItem = useCallback(
    (itemAlbum: IAlbumImage) => {
      return (
        <View style={styles.album}>
          <View style={styles.row}>
            <Button mode={'text'} icon={'chevron-down'}>
              {itemAlbum.label}
              {'  '}
              {itemAlbum.image.length - 1 === 0
                ? `( Tối thiểu ${
                    itemAlbum?.numberImageReq ? itemAlbum.numberImageReq : 0
                  } ảnh )`
                : `(${itemAlbum.image?.length - 1 || 0}/${
                    itemAlbum?.numberImageReq ? itemAlbum.numberImageReq : 0
                  })`}
            </Button>
            <SvgIcon
              source={'TrashIcon'}
              size={25}
              onPress={() => onDeleteAlbum(itemAlbum.label)}
            />
          </View>
          <View style={styles.imgContainer}>
            <FlatList
              numColumns={3}
              data={itemAlbum.image}
              keyExtractor={(item, index) => index.toString()}
              decelerationRate={'fast'}
              bounces={false}
              renderItem={({item, index}) => {
                return (
                  <>
                    {index === 0 ? (
                      <Block padding={5} marginRight={4} marginLeft={4}>
                        <Pressable
                          onPress={() => handleCamera(itemAlbum)}
                          style={styles.cameraImg}>
                          <SvgIcon source={'IconCamera'} size={24} />
                        </Pressable>
                      </Block>
                    ) : (
                      <View
                        style={{
                          padding: 5,
                          rowGap: 8,
                          marginHorizontal: 4,
                        }}>
                        <View style={styles.img}>
                          <Image
                            // @ts-ignore
                            source={{uri: item.url}}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                            }}
                            resizeMode={'cover'}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            onDeleteImageOfAlbum(itemAlbum, item.url)
                          }
                          style={{position: 'absolute', top: 0, right: 0}}>
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
        label={getLabel('takePicture')}
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
            <Block width={'100%'} alignItems="center" justifyContent="center">
              {albumImageData.map((item, index) => {
                return (
                  <Block key={index} marginVertical={8} width={'100%'}>
                    {AlbumItem(item)}
                  </Block>
                );
              })}
            </Block>
          </AppContainer>
        ) : (
          <EmptyAlbum />
        )}
      </View>
      <View style={styles.footer}>
        <AppButton
          style={{width: '100%'}}
          label={getLabel('completed')}
          onPress={() => {
            handlePushImageData();
            if (isDone) {
              completeCheckin();
            } else {
              return null;
            }
          }}
        />
      </View>
      <SelectAlbum
        key={albumBottomSheet?.length}
        bottomSheetRef={bottomSheetRef}
        data={albumBottomSheet}
        setData={setAlbumBottomSheet}
        albumImageData={albumImageData}
        setAlbumImageData={setAlbumImageData}
      />

      <Modal visible={loading} style={styles.modal}>
        <Block
          justifyContent="center"
          alignItems="center"
          colorTheme="white"
          width={350}
          marginTop={20}
          marginBottom={20}
          borderRadius={16}>
          <Block marginTop={16}>
            <AppText color="black">Đang cập nhật</AppText>
          </Block>
          <Block marginTop={16} marginBottom={16}>
            <ProgressCircle
              percent={((message + 1) / listImageLength) * 100}
              radius={50}
              borderWidth={12}
              color={theme.colors.success}
              shadowColor={theme.colors.bg_disable}
              bgColor="#fff">
              <Text>{message}</Text>
            </ProgressCircle>
          </Block>
        </Block>
      </Modal>
    </MainLayout>
  );
};
export default TakePicture;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    modal: {
      justifyContent: 'center',
      borderRadius: 16,
      alignItems: 'center',
    } as ViewStyle,
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
