import {
  Keyboard,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  startTransition,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import {
  AppHeader,
  AppIcons,
  AppInput,
  AppText as Text,
  AppText,
  Block,
  SvgIcon,
} from '../../../components/common';
import { ApiConstant, AppConstant, ScreenConstant } from '../../../const';
import { AppTheme, useTheme } from '../../../layouts/theme';
import { getDetailLocation } from '../../../services/appService';
import Colors from '../../../assets/Colors';
import {
  DetailCustomerType,
  IDataCustomer,
  IDataCustomers,
  KeyAbleProps,
  RootEkMapResponse,
} from '../../../models/types';
import { dispatch } from '../../../utils/redux';
import SelectedAddress from './SelectedAddress';
import { customerActions } from '../../../redux-store/customer-reducer/reducer';
import { MainAddress, MainContactAddress } from './CardAddress';
import { useTranslation } from 'react-i18next';
import { CommonUtils } from '../../../utils';
import Mapbox from '@rnmapbox/maps';
import { AppService, CustomerService } from '../../../services';
import { GeolocationResponse } from '@react-native-community/geolocation';
import isEqual from 'react-fast-compare';
import { backgroundErrorListener, useSelector } from '../../../config/function';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { IUpdateAddress } from '../../../services/checkinService';
import { appActions } from '../../../redux-store/app-reducer/reducer';
import { shallowEqual } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  onPressClose: () => void;
  typeFilter: any;
  listData: IDataCustomers;
  setData: (item: any) => void;
  dataCustomer?: DetailCustomerType;
  getDetailCustomer?: () => Promise<void>;
  setDataAddress?: React.Dispatch<React.SetStateAction<any>>;
  screen?: any;
};

export const AddressType = {
  city: 'city',
  ward: 'ward',
  district: 'district',
};

export type AddressSelected = {
  type: string;
  value: string;
  id?: string | number;
};

const FormAddress = (props: Props) => {
  const {
    onPressClose,
    typeFilter,
    screen: screenPass,
    getDetailCustomer,
  } = props;
  const theme = useTheme();
  const { t: getLabel } = useTranslation();
  const styles = rootStyles(theme, getLabel);
  const [screen, setScreen] = useState('');
  const [addressSelectedData, setAddressSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [contactSelectedData, setContactSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [addressValue, setAddressValue] = useState<any>({
    detailAddress: '',
    is_primary_address: false,
    is_shipping_address: false,
    primary: false,
  });
  const [contactValue, setContactValue] = useState<any>({
    nameContact: '',
    phoneNumber: '',
    addressContact: '',
    primary: false,
    is_primary_contact: false,
  });

  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');
  const [enableGPS, setEnableGPS] = useState(false);

  const [keyboardVisitAble, setKeyboardVisitAble] = useState<boolean>(false);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);

  const listDataCity = useSelector(
    state => state.app.listDataCity,
    shallowEqual,
  );
  const listCheckBox = useRef([
    {
      id: '1',
      label: getLabel('setPrimaryAddress'),
    },
    {
      id: '2',
      label: getLabel('setDeliveryAddress'),
    },
    {
      id: '3',
      label: getLabel('setOrderAddress'),
    },
  ]);

  const isValidAddress = useMemo(() => {
    return addressSelectedData?.length === 3 && txtAddressDetail !== '';
  }, [addressSelectedData, txtAddressDetail]);

  const checkGPS = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean = await isLocationEnabled();
      if (checkEnabled) {
        setEnableGPS(true);
        onPressButtonGetLocation();
      } else {
        setEnableGPS(false);
      }
    } else {
      setEnableGPS(true);
      onPressButtonGetLocation();
    }
  };

  const onResetData = (type: string) => {
    if (type == 'address') {
      setAddressSelectedData([]);
      setAddressValue({});
      setTxtAddressDetail('');
      setLocation(null);
    } else {
      setContactSelectedData([]);
      setContactValue({});
      setTxtContactDetail('');
      setContactValue((prev: any) => ({ ...prev, nameContact: '', phoneNumber: '' }));
    }
  };

  const fetchData = async (lat: any, lon: any) => {
    // dispatch(appActions.setProcessingStatus(true));
    const response: KeyAbleProps = await AppService.getDetailLocation(lat, lon);
    if (response.status === ApiConstant.STT_OK || 'OK') {
      const address: any = response.results[0].address_components;
      const cityValue = address[address.length - 1]?.long_name ?? '';
      const districtValue = address[address.length - 2]?.long_name ?? '';
      const wardValue = address[address.length - 3]?.long_name ?? '';
      const addLine1 = address[address.length - 4]?.long_name ?? '';
      const selectedAddress: AddressSelected[] = [];
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
        address_line1: addLine1,
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
          citySelectedItem => citySelectedItem?.ten_tinh === citySelectedName,
        );

        addressObj = {
          ...addressObj,
          province: {
            code: citySelected?.ma_tinh ?? '',
            value: citySelected?.ten_tinh ?? '',
          },
        };
        selectedAddress.push({
          type: 'city',
          value: citySelected?.ten_tinh ?? '',
          id: citySelected?.ma_tinh,
        });
      }
      if (districtValue && addressObj?.province?.code) {
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
            (item: any) => item?.ten_huyen === districtSelectedName,
          );
          addressObj = {
            ...addressObj,
            district: {
              code: districtSelected?.ma_huyen ?? '',
              value: districtSelected?.ten_huyen ?? '',
            },
          };
          selectedAddress.push({
            type: 'district',
            value: districtSelected?.ten_huyen ?? '',
            id: districtSelected?.ma_huyen,
          });
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
            (item: any) => item?.ten_xa === wardSelectedName,
          );
          addressObj = {
            ...addressObj,
            ward: {
              code: wardSelected?.ma_xa ?? '',
              value: wardSelected?.ten_xa ?? '',
            },
          };
          selectedAddress.push({
            type: 'ward',
            value: wardSelected?.ten_xa ?? '',
            id: wardSelected?.ma_xa ?? '',
          });
        }
      }
      if (addLine1) {
        addressObj = {
          ...addressObj,
          address_line1: addLine1,
        };
      }
      setAddressSelectedData(selectedAddress);
      setTxtAddressDetail(addressObj.address_line1);
      // dispatch(appActions.setProcessingStatus(false));
    }
  };

  const onPressButtonGetLocation = React.useCallback(() => {
    CommonUtils.getCurrentLocation(
      locations => {
        fetchData(locations.coords.latitude, locations.coords.longitude);
      },
      err => backgroundErrorListener(err.code),
    );
  }, [enableGPS]);

  const autoCompleteGeo = async (address: string) => {
    if (address) {
      await CommonUtils.CheckNetworkState();
      const response: KeyAbleProps = await AppService.autocompleteGeoLocation(
        address,
      );
      if (response.status === ApiConstant.STT_OK || 'OK') {
        const geometry: any = response.results[0].geometry;
        setLocation({
          // @ts-ignore
          coords: {
            longitude: geometry.location.lng,
            latitude: geometry.location.lat,
          },
        });
      }
    }
  };

  const handleSaveMainAddress = async () => {
    dispatch(
      customerActions.setMainAddress({
        ...addressValue,
        detailAddress: txtAddressDetail,
      }),
    );
    props.setData({
      ...props.listData,
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    });
    onPressClose();
  };

  const handleSaveMainAddressDetail = async () => {
    dispatch(appActions.setProcessingStatus(true));
    const dataUpdate = {
      name: props.dataCustomer?.name || '',
      address: [
        {
          is_primary_address: addressValue?.is_primary_address ? 1 : 0,
          is_shipping_address: addressValue?.is_shipping_address ? 1 : 0,
          address_title: `${txtAddressDetail}, ${addressValue?.ward?.value}, ${addressValue?.district?.value}, ${addressValue?.city?.value}`,
          // address_location: JSON.stringify(location?.coords), // Assuming txtAddressDetail contains the address location
          longitude: location?.coords?.longitude,
          latitude: location?.coords?.latitude,
          name: txtAddressDetail + '-Billing',
          primary: addressValue?.primary ? 1 : 0,
          address_type: 'Billing',
          city: addressValue?.city?.id || '',
          county: addressValue?.district?.id || '',
          state: addressValue?.ward?.id || '',
          address_line1: txtAddressDetail,
        },
      ],
    };
    const response: any = await CustomerService.updateCustomer(dataUpdate);

    if (response?.status === ApiConstant.STT_OK && getDetailCustomer) {
      await getDetailCustomer();
      onPressClose();
    }
    dispatch(appActions.setProcessingStatus(false));
  };

  useEffect(() => {
    if (listDataCity?.city?.length === 0) {
      dispatch(appActions.onGetListCity());
    }
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisitAble(true);
    });

    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisitAble(false);
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  useEffect(() => {
    if (
      addressSelectedData.length === 3 &&
      txtAddressDetail &&
      !keyboardVisitAble
    ) {
      autoCompleteGeo(
        `${txtAddressDetail}, ${addressSelectedData[2].value}, ${addressSelectedData[1].value}, ${addressSelectedData[0].value}`,
      );
    }
  }, [addressSelectedData, txtAddressDetail, keyboardVisitAble]);

  useEffect(() => {
    if (addressSelectedData.length === 3) {
      setAddressValue((prev: any) => ({
        ...prev,
        city: addressSelectedData[0],
        district: addressSelectedData[1],
        ward: addressSelectedData[2],
      }));
    } else if (addressSelectedData.length === 2) {
      setAddressValue((prev: any) => ({
        ...prev,
        city: addressSelectedData[0],
        district: addressSelectedData[1],
      }));
    } else if (addressSelectedData.length === 1) {
      setAddressValue((prev: any) => ({
        ...prev,
        city: addressSelectedData[0],
      }));
    } else {
      setAddressValue((prev: any) => ({
        ...prev,
      }));
    }
  }, [addressSelectedData]);

  useEffect(() => {
    if (contactSelectedData.length === 3) {
      setContactValue((prev: any) => ({
        ...prev,
        city: contactSelectedData[0],
        district: contactSelectedData[1],
        ward: contactSelectedData[2],
      }));
    } else if (contactSelectedData.length === 2) {
      setContactValue((prev: any) => ({
        ...prev,
        city: contactSelectedData[0],
        district: contactSelectedData[1],
      }));
    } else if (contactSelectedData.length === 1) {
      setContactValue((prev: any) => ({
        ...prev,
        city: contactSelectedData[0],
      }));
    } else {
      setContactValue((prev: any) => ({
        ...prev,
      }));
    }
  }, [contactSelectedData]);

  const handleSaveMainContact = React.useCallback(async () => {
    dispatch(
      customerActions.setMainContactAddress({
        ...contactValue,
        addressContact: txtContactDetail,
      }),
    );
    onPressClose();
  }, [contactValue, txtContactDetail]);

  const handleSaveMainContactDetail = React.useCallback(async () => {
    dispatch(appActions.setProcessingStatus(true));
    const dataUpdate = {
      name: props.dataCustomer?.name || '',
      contacts: [
        {
          first_name: contactValue?.nameContact ?? '',
          phone: contactValue?.phoneNumber ?? '',
          is_primary_contact: contactValue?.is_primary_contact ? 1 : 0,
          address_title: `${txtContactDetail}, ${contactValue?.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
          name: txtContactDetail + '-Billing',
          address_type: 'Billing',
          city: contactValue?.city?.id || '',
          county: contactValue?.district?.id || '',
          state: contactValue?.ward?.id || '',
          address_line1: txtContactDetail,
        },
      ],
    };
    // console.log('dataUpdate', dataUpdate);
    const response: any = await CustomerService.updateCustomer(dataUpdate);

    if (response?.status === ApiConstant.STT_OK && getDetailCustomer) {
      await getDetailCustomer();
      onPressClose();
    }
    dispatch(appActions.setProcessingStatus(false));
  }, [contactValue, txtContactDetail]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {(screen === 'Adding' || screen === 'AddingContact') &&
        ((typeFilter === AppConstant.CustomerFilterType.dia_chi &&
          addressSelectedData.length !== 3) ||
          (typeFilter === AppConstant.CustomerFilterType.nguoi_lien_he &&
            contactSelectedData.length !== 3)) ? (
        <SelectedAddress
          setScreen={setScreen}
          data={
            typeFilter === AppConstant.CustomerFilterType.dia_chi
              ? addressSelectedData
              : contactSelectedData
          }
          setData={
            typeFilter === AppConstant.CustomerFilterType.dia_chi
              ? setAddressSelectedData
              : setContactSelectedData
          }
        />
      ) : typeFilter === AppConstant.CustomerFilterType.dia_chi ? (
        < >
          <Block style={styles.headerContentView('Địa chỉ chính')}>
            <AppHeader
              label={getLabel('mainAddress')}
              onBack={() => { }}
              backButtonIcon={
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name="close"
                  size={26}
                  color={theme.colors.black}
                  onPress={() => {
                    onResetData('address');
                    onPressClose();
                  }}
                />
              }
            />
          </Block>

          <Block style={[styles.buttonView, { marginBottom: 24 }]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                checkGPS();
              }}>
              <SvgIcon source="iconMap" size={20} colorTheme="action" />
              <AppText
                style={styles.marginText}
                fontSize={14}
                colorTheme="action"
                fontWeight="500">
                Lấy vị trí hiện tại
              </AppText>
            </TouchableOpacity>
          </Block>
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}>
            <AppInput
              label={`${getLabel('province')}/${getLabel('city')}`}
              contentStyle={styles.contentStyle(
                addressValue?.city?.value ?? '',
                '',
              )}
              onPress={() => {
                setScreen('Adding');
                setAddressSelectedData([]);
              }}
              value={addressValue?.city?.value ?? ''}
              editable={false}
              hiddenRightIcon={false}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('district')}
              value={addressValue?.district?.value ?? ''}
              editable={false}
              onPress={() => {
                setScreen('Adding');
                const newData = addressSelectedData.filter(
                  item => item.type === AddressType.city,
                );
                setAddressSelectedData(newData);
              }}
              contentStyle={styles.contentStyle(
                addressValue?.district?.value ?? '',
                '',
              )}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('ward')}
              value={addressValue?.ward?.value ?? ''}
              editable={false}
              contentStyle={styles.contentStyle(
                addressValue?.ward?.value ?? '',
                '',
              )}
              onPress={() => {
                setScreen('Adding');
                const newData = addressSelectedData.filter(
                  item => item.type !== AddressType.ward,
                );
                setAddressSelectedData(newData);
              }}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('address')}
              value={txtAddressDetail}
              editable={true}
              contentStyle={styles.contentStyle(
                addressValue.detailAddress ?? '',
                '',
              )}
              styles={
                addressValue.detailAddress === getLabel('addressDetail')
                  ? styles.marginInputView
                  : styles.containInput
              }
              hiddenRightIcon={true}
              onChangeValue={setTxtAddressDetail}
            />
            <Block style={styles.checkBoxRootView}>
              {listCheckBox.current.map(item => {
                return (
                  <Block key={item.id}>
                    <TouchableOpacity
                      onPress={() => {
                        item.id === '1'
                          ? setAddressValue((prev: any) => ({
                            ...prev,
                            primary: !addressValue?.primary,
                          }))
                          : item.id === '2'
                            ? setAddressValue((prev: any) => ({
                              ...prev,
                              is_shipping_address:
                                !addressValue?.is_shipping_address,
                            }))
                            : setAddressValue((prev: any) => ({
                              ...prev,
                              is_primary_address:
                                !addressValue?.is_primary_address,
                            }));
                      }}
                      style={styles.checkBoxView}>
                      <Block
                        style={
                          item.id === '1'
                            ? styles.boxIconGo(addressValue.primary)
                            : item.id === '2'
                              ? styles.boxIconOrder(
                                addressValue?.is_shipping_address,
                              )
                              : styles.boxIconOrder(
                                addressValue?.is_primary_address,
                              )
                        }>
                        {addressValue?.is_shipping_address ||
                          addressValue?.is_primary_address ||
                          addressValue?.primary ? (
                          <AppIcons
                            iconType={AppConstant.ICON_TYPE.EntypoIcon}
                            size={14}
                            color={theme.colors.white}
                            name="check"
                          />
                        ) : null}
                      </Block>
                      <AppText>
                        {'   '}
                        {item.label}
                      </AppText>
                    </TouchableOpacity>
                  </Block>
                );
              })}
            </Block>
            <Block style={styles.mapView}>
              <Mapbox.MapView
                pitchEnabled={false}
                attributionEnabled={false}
                scaleBarEnabled={false}
                scrollEnabled={true}
                styleURL={Mapbox.StyleURL.Street}
                logoEnabled={false}
                style={{ flex: 1 }}>
                <Mapbox.RasterSource
                  id="adminmap"
                  tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
                  <Mapbox.RasterLayer
                    id={'adminmap'}
                    sourceID={'admin'}
                    style={{ visibility: 'visible' }}
                  />
                </Mapbox.RasterSource>

                {location?.coords && (
                  <>
                    <Mapbox.Camera
                      // ref={mapboxCameraRef}
                      centerCoordinate={[
                        location?.coords.longitude ?? 105.7750996,
                        location?.coords.latitude ?? 21.0564114,
                      ]}
                      animationMode={'flyTo'}
                      animationDuration={300}
                      zoomLevel={13}
                    />
                    <Mapbox.MarkerView
                      coordinate={[
                        Number(location?.coords.longitude),
                        Number(location?.coords.latitude),
                      ]}>
                      <SvgIcon source={'LocationCheckIn'} size={40} />
                    </Mapbox.MarkerView>
                  </>
                )}
              </Mapbox.MapView>
            </Block>
          </ScrollView>
          <Block style={styles.containButtonBottom(typeFilter)}>
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  setScreen('');
                  onResetData('address');
                  onPressClose();
                }}>
                <AppText style={styles.restartText}>
                  {getLabel('cancel')}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonApply,
                  {
                    backgroundColor: isValidAddress
                      ? theme.colors.primary
                      : theme.colors.bg_disable,
                  },
                ]}
                disabled={!isValidAddress}
                onPress={() =>
                  screenPass && screenPass === ScreenConstant.DETAIL_CUSTOMER
                    ? handleSaveMainAddressDetail()
                    : handleSaveMainAddress()
                }>
                <AppText style={styles.applyText}>{getLabel('save')}</AppText>
              </TouchableOpacity>
            </Block>
          </Block>
        </>
      ) : (
        <>
          <Block style={styles.headerContentView(getLabel('mainContact'))}>
            <AppHeader
              label={getLabel('mainContact')}
              onBack={() => { }}
              backButtonIcon={
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name="close"
                  size={26}
                  color={theme.colors.black}
                  onPress={() => {
                    onResetData('contact');
                    onPressClose();
                  }}
                />
              }
            />
          </Block>
          <ScrollView
            keyboardDismissMode={'on-drag'}
            style={{ flex: 1, paddingHorizontal: 16 }}>
            <AppInput
              label={getLabel('contactName')}
              value={contactValue.nameContact}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue.nameContact,
                getLabel('contactName'),
              )}
              hiddenRightIcon={true}
              styles={styles.marginInputView}
              onChangeValue={text =>
                setContactValue((prev: any) => ({ ...prev, nameContact: text }))
              }
            />
            <AppInput
              label={getLabel('phoneNumber')}
              value={contactValue.phoneNumber}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue.phoneNumber,
                getLabel('phoneNumber'),
              )}
              inputProp={{ keyboardType: 'numeric', returnKeyType: 'done' }}
              styles={styles.marginInputView}
              onChangeValue={text =>
                setContactValue((prev: any) => ({ ...prev, phoneNumber: text }))
              }
              hiddenRightIcon={true}
            />
            <Block marginTop={8} marginBottom={8}>
              <AppText
                fontSize={14}
                fontWeight="500"
                colorTheme="text_secondary">
                Địa chỉ
              </AppText>
            </Block>
            <AppInput
              label={`${getLabel('province')}/${getLabel('city')}`}
              contentStyle={styles.contentStyle(
                contactValue?.city?.value ?? '',
                '',
              )}
              onPress={() => {
                setScreen('AddingContact');
                setContactSelectedData([]);
              }}
              value={contactValue?.city?.value ?? ''}
              editable={false}
              hiddenRightIcon={false}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('district')}
              value={contactValue?.district?.value ?? ''}
              editable={false}
              onPress={() => {
                setScreen('AddingContact');
                const newData = contactSelectedData.filter(
                  item => item.type === AddressType.city,
                );
                setContactSelectedData(newData);
              }}
              contentStyle={styles.contentStyle(
                contactValue?.district?.value ?? '',
                '',
              )}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('ward')}
              value={contactValue?.ward?.value ?? ''}
              editable={false}
              contentStyle={styles.contentStyle(
                contactValue?.ward?.value ?? '',
                '',
              )}
              onPress={() => {
                setScreen('AddingContact');
                const newData = contactSelectedData.filter(
                  item => item.type !== AddressType.ward,
                );
                setContactSelectedData(newData);
              }}
              styles={styles.marginInputView}
              rightIcon={
                <TextInput.Icon
                  icon={'chevron-down'}
                  style={styles.iconStyle}
                  color={theme.colors.text_secondary}
                />
              }
            />
            <AppInput
              label={getLabel('addressDetail')}
              value={txtContactDetail}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue?.addressContact ?? '',
                '',
              )}
              styles={styles.marginInputView}
              onChangeValue={setTxtContactDetail}
              hiddenRightIcon={true}
            />
            <TouchableOpacity
              style={styles.checkBoxView}
              onPress={() =>
                setContactValue((prev: any) => ({
                  ...prev,
                  is_primary_contact: !contactValue?.is_primary_contact,
                  primary: !contactValue?.is_primary_contact,
                }))
              }>
              <Block
                style={styles.boxMainContact(contactValue?.is_primary_contact)}
                marginRight={8}>
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.EntypoIcon}
                  size={14}
                  color={theme.colors.white}
                  name="check"
                />
              </Block>
              <Text>Đặt làm người liên hệ chính</Text>
            </TouchableOpacity>
          </ScrollView>
          <Block style={styles.containButtonBottom(typeFilter)}>
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  setScreen('');
                  onResetData('contact');
                  onPressClose();
                }}>
                <AppText style={styles.restartText}>
                  {getLabel('cancel')}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonApply}
                onPress={() =>
                  screenPass && screenPass === ScreenConstant.DETAIL_CUSTOMER
                    ? handleSaveMainContactDetail()
                    : handleSaveMainContact()
                }>
                <AppText style={styles.applyText}>{getLabel('save')}</AppText>
              </TouchableOpacity>
            </Block>
          </Block>
        </>
      )}
    </SafeAreaView>
  );
};

export default React.memo(FormAddress, isEqual);

const rootStyles = (theme: AppTheme, getLabel: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      marginBottom: 8,
      marginTop: 16,
    } as ViewStyle,
    buttonStyle: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 12,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
      padding: 16,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.colors.border,
    } as ViewStyle,
    marginText: {
      marginLeft: 8,
    } as TextStyle,
    marginInputView: {
      marginBottom: 20,
    } as ViewStyle,
    buttonView: {} as ViewStyle,
    headerContentView: (label: string) =>
    ({
      marginHorizontal: 16,
      marginBottom: 20,
    } as ViewStyle),
    containInput: {
      paddingBottom: 24,
      justifyContent: 'center',
      marginBottom: 20,
    } as ViewStyle,
    contentStyle: (text: string, label: string) =>
    ({
      color: theme.colors.text_primary,
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    } as TextStyle),
    iconStyle: {
      width: 24,
      height: 24,
    } as ViewStyle,
    checkBoxRootView: {
      // backgroundColor: 'red',
    } as ViewStyle,
    boxIconGo: (addressGo: boolean) =>
    ({
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: !addressGo ? 1 : 0,
      borderColor: theme.colors.text_secondary,
      marginBottom: 20,
      backgroundColor: addressGo ? theme.colors.primary : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle),
    boxIconOrder: (addressOrder: boolean) =>
    ({
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: !addressOrder ? 1 : 0,
      borderColor: theme.colors.text_secondary,
      marginBottom: 20,
      backgroundColor: addressOrder ? theme.colors.primary : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle),
    checkBoxView: {
      flexDirection: 'row',
    } as ViewStyle,
    containButtonBottom: (typeFilter: string) =>
    ({
      flex: typeFilter !== AppConstant.CustomerFilterType.dia_chi ? 0 : 0,
      padding: 16,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      // backgroundColor:'red'
    } as ViewStyle),
    containContentButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // backgroundColor:'blue'
    } as ViewStyle,
    buttonApply: {
      backgroundColor: theme.colors.primary,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      flex: 1,
      marginLeft: 6,
      // marginHorizontal: 6,
    } as ViewStyle,
    buttonRestart: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      // marginHorizontal: 6,
      // width:'100%',
      flex: 1,
    } as ViewStyle,
    restartText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: theme.colors.text_secondary,
    } as TextStyle,
    applyText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: Colors.white,
    } as TextStyle,
    mapView: {
      overflow: 'hidden',
      width: '100%',
      borderRadius: 16,
      height: 350,
    } as ViewStyle,
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 30,
      right: 0,
    } as ViewStyle,
    boxMainContact: (isPrimary: boolean) =>
    ({
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: !isPrimary ? 1 : 0,
      borderColor: theme.colors.text_secondary,
      marginBottom: 20,
      backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle),
  });
