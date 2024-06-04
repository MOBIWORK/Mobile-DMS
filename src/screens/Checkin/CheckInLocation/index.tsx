import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppButton,
  AppHeader,
  AppInput,
  Block,
  SvgIcon,
} from '../../../components/common';
import {
  ExtendedTheme,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {RouterProp} from '../../../navigation/screen-type';
import Mapbox from '@rnmapbox/maps';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {LocationProps} from '../../Visit/VisitList/VisitItem';
import {KeyAbleProps} from '../../../models/types';
import {CommonUtils} from '../../../utils';
import {AppService, CheckinService} from '../../../services';
import {IUpdateAddress} from '../../../services/checkInService';
import {
  appActions,
  setProcessingStatus,
} from '../../../redux-store/app-reducer/reducer';
import {useSelector} from '../../../config/function';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import {dispatch} from '../../../utils/redux';
import {GeolocationResponse} from '@react-native-community/geolocation';
import isEqual from 'react-fast-compare';
import {CheckinData} from '../../../services/appService';
import {shallowEqual} from 'react-redux';
import {TextInput as TextInputPaper} from 'react-native-paper';
import {
  AddressSelected,
  AddressType,
} from '../../Customer/components/FormAddress';
import SelectedAddress from '../../Customer/components/SelectedAddress';
//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const CheckInLocation = () => {
  const navigation = useNavigation<any>();

  const route = useRoute<RouterProp<'CHECKIN_LOCATION'>>();
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const styles = createStyle(theme);
  const {t: getLabel} = useTranslation();

  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );

  const listDataCity = useSelector(state => state.app.listDataCity);

  const [addressObj, setAddressObj] = useState<{
    province: {
      code: string;
      value: string;
    };
    district: {
      code: string;
      value: string;
    };
    ward: {
      code: string;
      value: string;
    };
    detail: string;
  }>({
    province: {
      code: '',
      value: '',
    },
    district: {
      code: '',
      value: '',
    },
    ward: {
      code: '',
      value: '',
    },
    detail: '',
  });

  const [showFooterBtn, setShowFooterBtn] = useState<boolean>(true);
  const [screen, setScreen] = useState<string>('');
  const [addressSelectedData, setAddressSelectedData] = useState<
    AddressSelected[]
  >([]);

  const customer_location: LocationProps =
    route.params?.data &&
    JSON.parse(route.params.data.item.customer_location_primary);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const mapboxCameraRef = useRef<CameraRef>(null);
  const zoomLevelRef = useRef<number>(15);

  const isValidAddress = useMemo(() => {
    return (
      addressObj.ward.code &&
      addressObj.province.code &&
      addressObj.district.code &&
      addressObj.detail
    );
  }, [addressObj]);

  const handleRegainLocation = () => {
    CommonUtils.getCurrentLocation(newLocation => {
      setLocation(newLocation);
      mapboxCameraRef.current &&
        mapboxCameraRef.current.moveTo(
          [newLocation.coords.longitude, newLocation.coords.latitude],
          1000,
        );
    });
  };

  const handleGetAddress = async () => {
    dispatch(appActions.setProcessingStatus(true));
    if (location) {
      await handleMarkerMap(
        location.coords.latitude,
        location.coords.longitude,
      );
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  const handleMarkerMap = async (lat: number, lng: number) => {
    Keyboard.dismiss();
    setLocation({
      // @ts-ignore
      coords: {
        latitude: lat,
        longitude: lng,
      },
    });
    const response: KeyAbleProps = await AppService.getDetailLocation(lat, lng);
    if (response.status === ApiConstant.STT_OK || 'OK') {
      const address: any = response.results[0].address_components;
      const cityValue = address[address.length - 1]?.long_name ?? '';
      const districtValue = address[address.length - 2]?.long_name ?? '';
      const wardValue = address[address.length - 3]?.long_name ?? '';
      const addLine1 = address[address.length - 4]?.long_name ?? '';
      let addressObj = {
        province: {
          code: '',
          value: cityValue,
        },
        district: {
          code: '',
          value: districtValue,
        },
        ward: {
          code: '',
          value: wardValue,
        },
        detail: addLine1,
      };
      if (cityValue) {
        const cityNameArr = listDataCity.city.map(
          cityNameArrItem => cityNameArrItem.ten_tinh,
        );
        const citySelectedName = CommonUtils.findBestMatch(
          cityValue,
          cityNameArr,
        );
        const citySelected = listDataCity.city.find(
          citySelectedItem => citySelectedItem.ten_tinh === citySelectedName,
        );
        addressObj = {
          ...addressObj,
          province: {
            code: citySelected?.ma_tinh ?? '',
            value: citySelected?.ten_tinh ?? '',
          },
        };
      }
      if (districtValue && addressObj.province.code) {
        const districtRes: any = await AppService.getListDistrict(
          addressObj.province.code,
        );
        if (districtRes?.status === ApiConstant.STT_OK) {
          const districtNameArr = districtRes.data.result.map(
            (districtNameArrItem: any) => districtNameArrItem.ten_huyen,
          );
          const districtSelectedName = CommonUtils.findBestMatch(
            districtValue,
            districtNameArr,
          );
          const districtSelected = districtRes.data.result.find(
            (item: any) => item.ten_huyen === districtSelectedName,
          );
          addressObj = {
            ...addressObj,
            district: {
              code: districtSelected?.ma_huyen ?? '',
              value: districtSelected?.ten_huyen ?? '',
            },
          };
        }
      }
      if (wardValue && addressObj.district.code) {
        const wardRes: any = await AppService.getListWard(
          addressObj.district.code,
        );
        if (wardRes?.status === ApiConstant.STT_OK) {
          const wardNameArr = wardRes.data.result.map(
            (wardNameArrItem: any) => wardNameArrItem.ten_xa,
          );
          const wardSelectedName = CommonUtils.findBestMatch(
            wardValue,
            wardNameArr,
          );
          const wardSelected = wardRes.data.result.find(
            (item: any) => item.ten_xa === wardSelectedName,
          );
          addressObj = {
            ...addressObj,
            ward: {
              code: wardSelected?.ma_xa ?? '',
              value: wardSelected?.ten_xa ?? '',
            },
          };
        }
      }
      if (addLine1) {
        addressObj = {
          ...addressObj,
          detail: addLine1,
        };
      }
      setAddressObj(addressObj);
    }
  };
  const handleComplete = async () => {
    dispatch(setProcessingStatus(true));
    let newParams = route.params;
    await CommonUtils.CheckNetworkState();
    const params: IUpdateAddress = {
      customer: route.params.data.item.name,
      long: location?.coords.longitude ?? 0,
      lat: location?.coords.latitude ?? 0,
      address_line1: addressObj.detail,
      state: {
        code: addressObj.ward.code,
        name: addressObj.ward.value,
      },
      county: {
        code: addressObj.district.code,
        name: addressObj.district.value,
      },
      city: {
        code: addressObj.province.code,
        name: addressObj.province.value,
      },
      // country: 'Việt Nam',
      checkin_id: route.params.data.checkin_id,
    };
    newParams.data.kh_diachi = params.address_line1;
    const response: any = await CheckinService.updateCustomerAddress(params);
    if (response?.status === ApiConstant.STT_OK) {
      dispatch(
        appActions.setDataCheckIn({
          ...dataCheckIn,
          item: {
            ...dataCheckIn.item,
            customer_primary_address: `${addressObj.detail},${addressObj.ward.value},${addressObj.district.value},${addressObj.province.value}`,
          },
        }),
      );
      completeCheckin();
      navigation.navigate({
        name: ScreenConstant.LIST_VISIT,
        // params: {item: newParams.data, isLocation: true},
        // merge: true,
      });
    }
    dispatch(setProcessingStatus(false));
  };

  const completeCheckin = () => {
    const newData = categoriesCheckin.map(item =>
      item.key === 'location' ? {...item, isDone: true} : item,
    );
    dispatch(checkinActions.setDataCategoriesCheckin(newData));
  };

  const fillAddressInit = useCallback(async () => {
    dispatch(appActions.setProcessingStatus(true));
    const customer_primary_address =
      route?.params && route.params.data.item.customer_primary_address;
    if (customer_primary_address) {
      let addressObj = {
        province: {
          code: customer_primary_address.city,
          value: '',
        },
        district: {
          code: customer_primary_address.county,
          value: '',
        },
        ward: {
          code: customer_primary_address.state,
          value: '',
        },
        detail: customer_primary_address.address_line1,
      };
      if (customer_primary_address.city) {
        const citySelected = listDataCity.city.find(
          item => item.ma_tinh === customer_primary_address.city,
        );
        addressObj = {
          ...addressObj,
          province: {
            ...addressObj.province,
            value: citySelected?.ten_tinh ?? '',
          },
        };
      }
      if (customer_primary_address.county) {
        const districtRes: any = await AppService.getListDistrict(
          customer_primary_address.city,
        );
        if (districtRes?.status === ApiConstant.STT_OK) {
          const districtSelected = districtRes.data.result.find(
            (item: any) => item.ma_huyen === customer_primary_address.county,
          );
          addressObj = {
            ...addressObj,
            district: {
              ...addressObj.district,
              value: districtSelected.ten_huyen,
            },
          };
        }
      }
      if (customer_primary_address.state) {
        const wardRes: any = await AppService.getListWard(
          customer_primary_address.county,
        );
        if (wardRes?.status === ApiConstant.STT_OK) {
          const wardSelected = wardRes.data.result.find(
            (item: any) => item.ma_xa === customer_primary_address.state,
          );
          addressObj = {
            ...addressObj,
            ward: {...addressObj.ward, value: wardSelected.ten_xa},
          };
        }
      }
      if (customer_primary_address.address_line1) {
        addressObj = {
          ...addressObj,
          detail: customer_primary_address.address_line1,
        };
      }
      setAddressObj(addressObj);
    }
    dispatch(appActions.setProcessingStatus(false));
  }, [listDataCity.city]);

  useLayoutEffect(() => {
    if (customer_location) {
      setLocation({
        // @ts-ignore
        coords: {
          longitude: customer_location.long,
          latitude: customer_location.lat,
        },
      });
    } else {
      CommonUtils.getCurrentLocation(locations => {
        setLocation(locations);
      });
    }
    fillAddressInit().then();
  }, []);

  useEffect(() => {
    if (listDataCity?.city?.length === 0) {
      dispatch(appActions.onGetListCity());
    }
  }, []);

  useEffect(() => {
    if (addressSelectedData.length === 3) {
      setAddressObj({
        ...addressObj,
        province: {
          code: addressSelectedData[0]?.id
            ? addressSelectedData[0].id.toString()
            : '',
          value: addressSelectedData[0].value,
        },
        district: {
          code: addressSelectedData[1]?.id
            ? addressSelectedData[1].id.toString()
            : '',
          value: addressSelectedData[1].value,
        },
        ward: {
          code: addressSelectedData[2]?.id
            ? addressSelectedData[2].id.toString()
            : '',
          value: addressSelectedData[2].value,
        },
      });
    } else if (addressSelectedData.length === 2) {
      setAddressObj({
        ...addressObj,
        province: {
          code: addressSelectedData[0]?.id
            ? addressSelectedData[0].id.toString()
            : '',
          value: addressSelectedData[0].value,
        },
        district: {
          code: addressSelectedData[1]?.id
            ? addressSelectedData[1].id.toString()
            : '',
          value: addressSelectedData[1].value,
        },
      });
    } else if (addressSelectedData.length === 1) {
      setAddressObj({
        ...addressObj,
        province: {
          code: addressSelectedData[0]?.id
            ? addressSelectedData[0].id.toString()
            : '',
          value: addressSelectedData[0].value,
        },
      });
    }
  }, [addressSelectedData]);

  useEffect(() => {
    Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setShowFooterBtn(false),
    );
    Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setShowFooterBtn(true),
    );
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardWillHide');
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 0,
        flex: 1,
        // backgroundColor:'blue'
        // height: AppConstant.HEIGHT * 0.6,
      }}
      edges={['top']}>
      {screen === 'Adding' && addressSelectedData.length !== 3 ? (
        <SelectedAddress
          setScreen={setScreen}
          data={addressSelectedData}
          setData={setAddressSelectedData}
        />
      ) : (
        <Block block>
          <AppHeader
            style={{paddingHorizontal: 16, marginTop: 0}}
            onBack={() => navigation.goBack()}
            label={getLabel('location')}
          />
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              contentInsetAdjustmentBehavior="automatic">
              <Block block>
                <Mapbox.MapView
                  onCameraChanged={state =>
                    (zoomLevelRef.current = state.properties.zoom)
                  }
                  pitchEnabled={false}
                  attributionEnabled={false}
                  scaleBarEnabled={false}
                  styleURL={Mapbox.StyleURL.Street}
                  logoEnabled={false}
                  style={{flex: 1, height: 300}}
                  onPress={feature => {
                    Keyboard.dismiss();
                    setLocation({
                      // @ts-ignore
                      coords: {
                        // @ts-ignore
                        latitude: feature.geometry.coordinates[1],
                        // @ts-ignore
                        longitude: feature.geometry.coordinates[0],
                      },
                    });
                  }}>
                  <Mapbox.RasterSource
                    id="adminmap"
                    tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
                    <Mapbox.RasterLayer
                      id={'adminmap'}
                      sourceID={'admin'}
                      style={{visibility: 'visible'}}
                    />
                  </Mapbox.RasterSource>
                  <Mapbox.Camera
                    ref={mapboxCameraRef}
                    centerCoordinate={[
                      location?.coords.longitude ?? 0,
                      location?.coords.latitude ?? 0,
                    ]}
                    animationMode={'flyTo'}
                    animationDuration={500}
                    zoomLevel={zoomLevelRef.current}
                  />
                  {location?.coords && (
                    <Mapbox.MarkerView
                      coordinate={[
                        Number(location?.coords.longitude),
                        Number(location?.coords.latitude),
                      ]}>
                      <SvgIcon source={'LocationCheckIn'} size={40} />
                    </Mapbox.MarkerView>
                  )}
                </Mapbox.MapView>
                <TouchableOpacity
                  onPress={handleRegainLocation}
                  style={styles.regainPosition}>
                  <Image
                    source={ImageAssets.MapIcon}
                    style={{width: 16, height: 16}}
                    resizeMode={'cover'}
                    tintColor={theme.colors.bg_default}
                  />
                  <Text style={{color: theme.colors.bg_default, marginLeft: 4}}>
                    {getLabel('currentPosition')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGetAddress}
                  style={styles.getLocation}>
                  <Image
                    source={ImageAssets.MapPinIcon}
                    style={{width: 16, height: 16}}
                    resizeMode={'cover'}
                    tintColor={theme.colors.text_secondary}
                  />
                  <Text
                    style={{color: theme.colors.text_primary, marginLeft: 4}}>
                    {getLabel('getAddress')}
                  </Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <AppInput
                    label={`${getLabel('province')}/${getLabel('city')}`}
                    onPress={() => {
                      setScreen('Adding');
                      setAddressSelectedData([]);
                    }}
                    value={addressObj.province.value}
                    editable={false}
                    styles={{marginBottom: 12}}
                    hiddenRightIcon={false}
                    rightIcon={
                      <TextInputPaper.Icon
                        icon={'chevron-down'}
                        style={styles.iconStyle}
                        color={theme.colors.text_secondary}
                      />
                    }
                  />
                  <AppInput
                    label={getLabel('district')}
                    value={addressObj.district.value}
                    editable={false}
                    styles={{marginBottom: 12}}
                    onPress={() => {
                      setScreen('Adding');
                      const newData = addressSelectedData.filter(
                        item => item.type === AddressType.city,
                      );
                      setAddressSelectedData(newData);
                    }}
                    rightIcon={
                      <TextInputPaper.Icon
                        icon={'chevron-down'}
                        style={styles.iconStyle}
                        color={theme.colors.text_secondary}
                      />
                    }
                  />
                  <AppInput
                    label={getLabel('ward')}
                    styles={{marginBottom: 12}}
                    value={addressObj.ward.value}
                    editable={false}
                    onPress={() => {
                      setScreen('Adding');
                      const newData = addressSelectedData.filter(
                        item => item.type !== AddressType.district,
                      );
                      setAddressSelectedData(newData);
                    }}
                    rightIcon={
                      <TextInputPaper.Icon
                        icon={'chevron-down'}
                        style={styles.iconStyle}
                        color={theme.colors.text_secondary}
                      />
                    }
                  />
                  <AppInput
                    label={getLabel('address')}
                    styles={{marginBottom: 12}}
                    value={addressObj.detail}
                    editable={true}
                    hiddenRightIcon={true}
                    onChangeValue={text =>
                      setAddressObj(prevState => ({...prevState, detail: text}))
                    }
                  />
                </View>
              </Block>
            </ScrollView>
          </KeyboardAvoidingView>
          {/*</AppContainer>*/}
        </Block>
      )}
      {showFooterBtn && (
        <View style={[styles.buttonFooter, {bottom: bottom}]}>
          <AppButton
            label={getLabel('completed')}
            onPress={handleComplete}
            disabled={!isValidAddress}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default React.memo(CheckInLocation, isEqual);
const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    searchContainer: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 12,
      marginHorizontal: 16,
      flexDirection: 'row',
      backgroundColor: theme.colors.bg_default,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      top: 20,
      position: 'absolute',
    } as ViewStyle,
    textInput: {
      color: theme.colors.text_primary,
      marginLeft: 8,
      maxWidth: '90%',
      flex: 1,
    } as TextStyle,
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 250,
      right: 0,
    } as ViewStyle,
    getLocation: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.bg_default,
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 250,
      left: 20,
    } as ViewStyle,
    buttonFooter: {
      position: 'absolute',
      width: '90%',
      alignSelf: 'center',
      bottom: 10,
    } as ViewStyle,
    iconStyle: {
      width: 24,
      height: 24,
    } as ViewStyle,
    inputContainer: {
      paddingHorizontal: 16,
      rowGap: 12,
      marginTop: 16,
      paddingVertical: 16,
    } as ViewStyle,
  });
