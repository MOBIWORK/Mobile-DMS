import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  startTransition,
  useMemo,
} from 'react';
import {ExtendedTheme, useNavigation, useRoute} from '@react-navigation/native';
import {MainLayout} from '../../../layouts';
import {
  Alert,
  FlatList,
  Image,
  ImageStyle,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  AppButton,
  AppContainer,
  AppHeader,
  AppText as Text,
  Block,
  SvgIcon,
} from '../../../components/common';
import {Button, Icon} from 'react-native-paper';
import {IFilterType} from '../../../components/common/FilterListComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectAlbum from './SelectAlbum';
import {IAlbumImage, ImageCheckIn, ListAlbumType} from '../../../models/types';
import {ImageAssets} from '../../../assets';
import {AppConstant} from '../../../const';
import {CameraUtils} from '../../../utils';
import {RouterProp} from '../../../navigation/screen-type';
import {CheckinData, DMSConfigMobile} from '../../../services/appService';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {dispatch} from '../../../utils/redux';
import {useSelector} from '../../../config/function';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {shallowEqual} from 'react-redux';
import {useTheme} from '../../../layouts/theme';
import ProgressCircle from 'react-native-progress-circle';
import {CheckinService} from '../../../services';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {storage} from '../../../utils/commom.utils';
import moment from 'moment';
import {useMMKVString} from 'react-native-mmkv';
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
  const [error, setError] = useState(false);
  const [albumError, setAlbumError] = useState<any[]>([]);
  const [storedStartTime, set] = useMMKVString('time');

  const totalImageRequire = useMemo(
    () =>
      albumImageData
        .map(item =>
          item.numberImageReq != null || item.numberImageReq != undefined
            ? item.numberImageReq
            : 0,
        )
        .reduce((acc, curr) => acc + parseInt(curr), 0),
    [albumImageData.length],
  );

  const dataCheckIn = useRef<CheckinData>(params.data);
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app?.systemConfig,
    shallowEqual,
  );
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
    shallowEqual,
  );
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
    setMessage(0);
    if (albumImageData.length > 0) {
      let totalItemsProcessed = 0;
      try {
        setLoading(true);
        for (let index = 0; index < albumImageData.length; index++) {
          if (systemConfig.batbuoc_chupanh === 1) {
            if (
              albumImageData[index].image.length - 1 >=
                albumImageData[index].numberImageReq &&
              albumImageData[index].numberImageReq != undefined
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
                  startTransition(() => {
                    setMessage(totalItemsProcessed);
                    dispatch(appActions.postImageCheckIn(data.current));
                    setError(false);
                  });
                }
              }
            } else {
              if (albumImageData[index].numberImageReq === undefined) {
                setLoading(false);
              } else {
                setLoading(false);
                setAlbumError(prev => [...prev, albumImageData[index].label]);
                setError(true);
              }
            }
          } else {
            if (data?.current) {
              data.current.album_id = String(albumImageData[index].id + 1);
              data.current.album_name = albumImageData[index].label;
            }
            try {
              const element = albumImageData[index].image;
              for (let i = 1; i < element.length; i++) {
                let image = element[i];
                if (data?.current) {
                  data.current.image = image?.base64!;
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  totalItemsProcessed++;
                  startTransition(() => {
                    setMessage(totalItemsProcessed);
                    dispatch(appActions.postImageCheckIn(data.current));
                    // storage.set(
                    //   'time',
                    //   String(
                    //     Number(storedStartTime) - moment(new Date()).valueOf(),
                    //   ),
                    // );
                    setError(false);
                  });
                }
              }
            } catch (e) {
              // console.log('fuckkkkk', e);
            }
          }
        }
      } catch (error) {
        console.error('Error during image processing', error);
      } finally {
        // completeCheckin();
      }
    } else {
      Alert.alert('Bạn chưa hoàn thành bước chụp ảnh');
    }
  };
  // dispatch(appActions.clearListImage([]));

  // setAlbumError([])
  const completeCheckin = () => {
    const newData = categoriesCheckin.map((item: any) =>
      item.key === 'camera' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
    dispatch(appActions.clearListImage());
    setLoading(false);
    navigation.goBack();
  };

  const handleCamera = async (item: IAlbumImage) => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      (granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']) ||
      Platform.OS === 'ios'
    ) {
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
    } else {
      Alert.alert('Bạn chưa cấp quyền');
    }
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

  const onBackButtonUpdate = useCallback(() => {
    dispatch(appActions.clearListImage());
    setLoading(false);
  }, [loading]);

  const onBackButtonError = useCallback(() => {
    setAlbumError([]);
    setError(false);
  }, [error]);
  // console.log(systemConfig.batbuoc_chupanh,'ap')

  useEffect(() => {
    const getListAlbum = async () => {
      const res: any = await CheckinService.getListAlbum();
      if (res?.result?.length > 0) {
        const listAlbumResult: ListAlbumType[] = res.result;
        console.log(res.result, 'result album');
        const listAlbum = listAlbumResult.map((item, index) => {
          return {
            id: item.ma_album,
            label: item.ten_album,
            value: item.ma_album,
            isSelected: false,
            numPicsRequired:
              item?.so_anh_toi_thieu != null ||
              item?.so_anh_toi_thieu != undefined
                ? item?.so_anh_toi_thieu
                : undefined,
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
          {getLabel('chooseAlbum')}
        </Button>
      </>
    );
  }, []);

  const AlbumItem = useCallback(
    (itemAlbum: IAlbumImage) => {
      const isError = albumError.findIndex(item => item === itemAlbum.label);
      return (
        <View style={styles.album(isError)}>
          <View style={styles.row}>
            <Block direction="row" marginLeft={8}>
              <Block marginRight={8}>
                <Icon source={'chevron-down'} size={20} />
              </Block>
              <Text fontSize={14} lineHeight={21} colorTheme="text_primary">
                {itemAlbum.label}
              </Text>
              <Block
                marginLeft={8}
                direction="row"
                // borderWidth={1}
                // borderColor={theme.colors.text_disable}
                padding={2}
                justifyContent="center"
                alignItems="center">
                {itemAlbum.numberImageReq !== null &&
                  itemAlbum.numberImageReq != undefined &&
                  itemAlbum?.image.length - 1 != 0 && (
                    <Block
                      width={13}
                      marginRight={3}
                      height={13}
                      borderRadius={13}
                      justifyContent="center"
                      alignItems="center"
                      color={
                        itemAlbum.image?.length - 1 == itemAlbum.numberImageReq
                          ? theme.colors.success
                          : theme.colors.bg_disable
                      }>
                      <SvgIcon source="CheckNonBorder" size={10} />
                    </Block>
                  )}

                <Text
                  color={theme.colors.text_primary}
                  fontSize={14}
                  colorTheme="text_primary">
                  {itemAlbum.image.length - 1 === 0 &&
                  itemAlbum.numberImageReq != null &&
                  itemAlbum.numberImageReq != undefined
                    ? `( Tối thiểu ${
                        itemAlbum?.numberImageReq ?? itemAlbum.numberImageReq
                      } ảnh )`
                    : itemAlbum.numberImageReq === 0 ||
                      itemAlbum.numberImageReq === null ||
                      itemAlbum.numberImageReq === undefined
                    ? ''
                    : `${itemAlbum.image?.length - 1} ảnh`}{' '}
                </Text>
              </Block>
            </Block>
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
          {getLabel('chooseAlbum')}
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
          label={getLabel('uploadImage')}
          onPress={() => {
            handlePushImageData();
            setAlbumError([]);
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
      <Modal
        isVisible={loading}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        onBackButtonPress={onBackButtonUpdate}
        onBackdropPress={onBackButtonUpdate}>
        <Block
          colorTheme="white"
          width={350}
          marginTop={20}
          padding={16}
          marginBottom={20}
          borderRadius={16}>
          <Block justifyContent="center" alignItems="center">
            <Block marginTop={16}>
              <Text color="black">Đang cập nhật</Text>
            </Block>
            <Block marginTop={16} marginBottom={16}>
              <ProgressCircle
                percent={(message / totalImageRequire) * 100}
                radius={50}
                borderWidth={12}
                color={theme.colors.success}
                shadowColor={theme.colors.bg_disable}
                bgColor="#fff">
                <Text>{message}</Text>
              </ProgressCircle>
            </Block>
          </Block>

          <Block
            marginTop={20}
            marginBottom={20}
            direction={message < totalImageRequire ? 'row' : undefined}
            justifyContent={
              message < totalImageRequire ? 'space-around' : undefined
            }
            paddingHorizontal={8}
            block
            paddingBottom={20}>
            {message < totalImageRequire && (
              <TouchableOpacity
                onPress={onBackButtonUpdate}
                style={[styles.buttonCancel]}>
                <Text
                  fontSize={14}
                  colorTheme="text_secondary"
                  fontWeight="700"
                  lineHeight={24}>
                  Hủy
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              disabled={message >= totalImageRequire ? false : true}
              onPress={completeCheckin}
              style={[
                styles.buttonConfirm,
                styles.uploadImage(message, totalImageRequire),
              ]}>
              <Text
                fontSize={14}
                colorTheme="bg_default"
                fontWeight="700"
                lineHeight={24}>
                Hoàn thành
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Modal>
      <Modal
        isVisible={error}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        onBackButtonPress={onBackButtonError}
        onBackdropPress={onBackButtonError}>
        <Block
          // justifyContent="center"
          // alignItems="center"
          colorTheme="white"
          width={350}
          marginTop={20}
          padding={16}
          marginBottom={20}
          borderRadius={16}>
          <Block justifyContent="center" alignItems="center">
            <Image
              source={ImageAssets.ErrorApiIcon}
              style={styles.imageError}
            />
          </Block>
          <Block justifyContent="center" alignItems="center">
            <Text
              textAlign="center"
              fontSize={16}
              colorTheme="text_primary"
              lineHeight={24}
              fontWeight="700">
              Chưa đủ ảnh tối thiểu
            </Text>
            <Text
              textAlign="center"
              fontSize={14}
              colorTheme="text_secondary"
              lineHeight={22}
              fontWeight="400">
              {albumError.join(',')} chưa đủ ảnh tối thiểu, vui lòng cập nhật đủ
              ảnh để hoàn thành bước Chụp ảnh{' '}
            </Text>
          </Block>
          <Block marginTop={20} marginBottom={20}>
            <TouchableOpacity
              onPress={() => {
                setError(false);
              }}
              style={styles.buttonConfirm}>
              <Text
                fontSize={14}
                colorTheme="bg_default"
                fontWeight="700"
                lineHeight={24}>
                Đồng ý
              </Text>
            </TouchableOpacity>
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
    album: (isError: number) =>
      ({
        marginTop: 8,
        padding: 16,
        paddingHorizontal: 8,
        backgroundColor: theme.colors.bg_default,
        borderColor: isError === -1 ? 'transparent' : theme.colors.error,
        borderRadius: 16,
        width: '100%',
        borderWidth: isError === -1 ? 0 : 1,
      } as ViewStyle),
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
    buttonConfirm: {
      height: 36,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 16,
      // width:'100%'
    } as ViewStyle,
    imageError: {
      width: 80,
      height: 80,
    } as ImageStyle,
    uploadImage: (mess: number, total: number) =>
      ({
        backgroundColor:
          total != 0
            ? mess >= total
              ? theme.colors.primary
              : theme.colors.bg_disable
            : theme.colors.primary,
      } as ViewStyle),
    buttonCancel: {
      height: 36,
      backgroundColor: theme.colors.bg_default,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,

      // width:'100%'
    } as ViewStyle,
  });
