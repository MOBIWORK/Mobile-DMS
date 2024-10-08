import {
  Image,
  Keyboard,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { AppTheme, useTheme } from '../../../layouts/theme';
import {
  AppHeader,
  AppIcons,
  AppInput,
  Block,
  SvgIcon,
  AppText as Text,
  AppText,
} from '../../../components/common';
import { CommonUtils } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import {
  AddressSelected,
  AddressType,
} from '../../Customer/components/FormAddress';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { Address, DetailCustomerType, KeyAbleProps } from '../../../models/types';
import { ApiConstant, AppConstant } from '../../../const';
import { AppService, CustomerService } from '../../../services';
import Mapbox from '@rnmapbox/maps';
import SelectedAddress from '../../Customer/components/SelectedAddress';
import { backgroundErrorListener, useSelector } from '../../../config/function';
import { shallowEqual } from 'react-redux';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';
import { ListDistrict, ListWard } from '../../../redux-store/app-reducer/type';
import { ImageAssets } from '../../../assets';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import { ScrollView } from 'react-native-gesture-handler';
type Props = {
  onBackButtonPress: () => void;
  type: string;
  setData: React.Dispatch<React.SetStateAction<DetailCustomerType>>;
  dataCustomer: DetailCustomerType;
  defaultEditData?: any;
  setDefaultEditData: React.Dispatch<React.SetStateAction<any>>;
  screenPass?: any;
};

const ModalEditAddress = ({
  onBackButtonPress,
  type,
  setData,
  dataCustomer,
  defaultEditData,
  setDefaultEditData,
}: Props) => {
  const theme = useTheme();
  const styles = modalEditStyles(theme);
  const { t: getLabel } = useTranslation();

  const [screen, setScreen] = useState('');
  const listDataCity = useSelector(
    state => state.app.listDataCity,
    shallowEqual,
  );

  const [addressSelectedData, setAddressSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [contactSelectedData, setContactSelectedData] = useState<
    AddressSelected[]
  >([]);

  const dataAddressRef = useRef<AddressSelected[]>([]);
  const dataContactRef = useRef<AddressSelected[]>([]);

  const [addressValue, setAddressValue] = useState<any>(null);
  const [contactValue, setContactValue] = useState<any>(null);
  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');

  const [keyboardVisitAble, setKeyboardVisitAble] = useState<boolean>(false);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [_, startTransition] = useTransition();

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

  const zoomLevelRef = useRef<number>(15);
  const mapboxCameraRef = useRef<CameraRef>(null);

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

  useEffect(() => {
    if (listDataCity?.city?.length === 0) {
      dispatch(appActions.onGetListCity());
    }
  }, []);

  useEffect(() => {
    if (defaultEditData && Object.keys(defaultEditData).length > 0) {
      if (type === 'editAddress') {
        setTxtAddressDetail(defaultEditData?.address_line1);
        setAddressValue({
          is_primary_address: defaultEditData?.is_primary_address ?? false,
          is_shipping_address: defaultEditData?.is_shipping_address ?? false,
          primary: defaultEditData?.primary === 1 ?? false,
          ...defaultEditData,
        });
      } else if (type === 'editContact') {
        setTxtContactDetail(defaultEditData?.address_line1);
        setContactValue({
          primary: defaultEditData?.primary === 1 ?? false,
          ...defaultEditData,
        });
      }
    }
  }, [defaultEditData]);

  const handleGetAddress = async () => {
    if (location && Object.keys(location?.coords).length > 0) {
      await fetchData(location.coords.latitude, location.coords.longitude);
    }
  };

  const handleRegainLocation = () => {
    CommonUtils.getCurrentLocation(
      newLocation => {
        setLocation(newLocation);
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [newLocation.coords.longitude, newLocation.coords.latitude],
            1000,
          );
      },
      err => {
        backgroundErrorListener(err.code);
      },
    );
  };

  const onBack = useCallback(() => {
    setAddressSelectedData([]);
    setScreen('');
    setDefaultEditData({});
    onBackButtonPress();
  }, [defaultEditData]);

  const fetchData = useCallback(
    async (lat: any, lon: any) => {
      dispatch(appActions.setProcessingStatus(true));
      const response: KeyAbleProps = await AppService.getDetailLocation(
        lat,
        lon,
      );
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
            citySelectedItem => citySelectedItem.ten_tinh === citySelectedName,
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
              (item: any) => item.ten_xa === wardSelectedName,
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
        dispatch(appActions.setProcessingStatus(false));
      }
    },
    [location, txtAddressDetail],
  );

  const handleSaveMainContact = useCallback(async () => {
    dispatch(appActions.setProcessingStatus(true));
    const contact: any = {
      ...defaultEditData,
      first_name: contactValue.nameContact || defaultEditData?.first_name,
      phone: contactValue.phoneNumber || defaultEditData?.phone,
      mobile_no: contactValue.phoneNumber || defaultEditData?.phone,
      address: `${txtContactDetail}, ${contactValue.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
      is_billing_contact: 0,
      is_primary_contact: contactValue?.isMainAddress ? 1 : 0,
      primary: contactValue?.primary ? 1 : 0,
      city: contactValue?.city?.id || '',
      county: contactValue?.district?.id || '',
      state: contactValue?.ward?.id || '',
      address_title: `${txtContactDetail}, ${contactValue.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
      address_line1: txtContactDetail,
    };
    if (type === 'contact' || type === 'AddingContact') {
      startTransition(() => {
        setData(prev => ({
          ...prev,
          contacts: [...(prev.contacts || []), contact],
        }));
      });
    } else {
      if (
        dataCustomer &&
        dataCustomer.contacts &&
        dataCustomer.contacts.length > 0
      ) {
        if (defaultEditData) {
          const addressSelected = dataCustomer.contacts.find(
            item => item.name === defaultEditData.name,
          );
          const dataUpdate = {
            contacts: [{ ...addressSelected, ...contact }],
            name: dataCustomer.name,
            customer_primary_contact: txtContactDetail,
          };
          // console.log('dataa', dataUpdate);
          const response: any = await CustomerService.updateCustomer(
            dataUpdate,
          );
          if (response?.status === ApiConstant.STT_OK) {
            const newDataContact = dataCustomer.contacts.map(item => {
              if (item.name === dataUpdate.contacts[0].name) {
                return { ...item, ...dataUpdate.contacts[0] };
              } else {
                return item;
              }
            });
            setData(prev => ({
              ...prev,
              contacts: newDataContact,
              customer_primary_contact: txtAddressDetail,
            }));
            setContactSelectedData([]);
            setScreen('');
            onBackButtonPress();
          }
        }
      }
    }
    dispatch(appActions.setProcessingStatus(false));
  }, [contactValue, txtContactDetail, contactSelectedData]);

  const autoCompleteData = useCallback(async () => {
    dispatch(appActions.setProcessingStatus(true));
    const geo =
      defaultEditData?.address_location &&
      JSON.parse(defaultEditData.address_location);
    if (geo) {
      // @ts-ignore
      setLocation({ coords: { latitude: geo?.lat, longitude: geo?.long } });
    }
    if (listDataCity.city.length > 0) {
      let add: Address = defaultEditData;
      const selectedAddress: AddressSelected[] = [];
      if (add.city != null) {
        let value = listDataCity.city.find(item => item.ma_tinh === add.city);
        if (value) {
          selectedAddress.push({
            type: 'city',
            value: value?.ten_tinh ?? '',
            id: value?.ma_tinh,
          });
        }
        const districtRes: any = await AppService.getListDistrict(
          value?.ma_tinh,
        );
        if (districtRes?.status === ApiConstant.STT_OK) {
          let districtVal: ListDistrict = districtRes.data.result?.find(
            (item: ListDistrict) => item?.ma_huyen === add?.county,
          );
          if (districtVal) {
            selectedAddress.push({
              type: 'district',
              value: districtVal?.ten_huyen,
              id: districtVal?.ma_huyen,
            });
          }
          const wardRes: any = await AppService.getListWard(
            districtVal?.ma_huyen,
          );
          if (wardRes?.status === ApiConstant.STT_OK) {
            let wardValue: ListWard = wardRes?.data?.result.find(
              (item: ListWard) => item?.ma_xa === add?.state,
            );
            if (wardValue) {
              selectedAddress.push({
                type: 'ward',
                value: wardValue?.ten_xa,
                id: wardValue?.ma_xa,
              });
            }
          }
        }
      }
      if (type === 'editAddress') {
        setAddressSelectedData(selectedAddress);
      } else if (type === 'editContact') {
        setContactSelectedData(selectedAddress);
      }
    }
    dispatch(appActions.setProcessingStatus(false));
  }, [defaultEditData, type, addressValue, contactValue]);

  // const autoCompleteGeo = async (address: string) => {
  //   if (address) {
  //     console.log('adresss', address);
  //     await CommonUtils.CheckNetworkState();
  //     const res: KeyAbleProps = await AppService.autocompleteGeoLocation(
  //       address,
  //     );
  //     if (res.status === ApiConstant.STT_OK || 'OK') {
  //       const geometry: any = res.results[0].geometry;
  //       console.log('1233', geometry);
  //       setLocation({
  //         // @ts-ignore
  //         coords: {
  //           longitude: geometry.location.lng,
  //           latitude: geometry.location.lat,
  //         },
  //       });
  //     }
  //   }
  // };

  const handleSaveMainAddress = useCallback(async () => {
    dispatch(appActions.setProcessingStatus(true));
    const newAdd = {
      ...defaultEditData,
      name: defaultEditData?.name,
      is_primary_address: addressValue.is_primary_address ? 1 : 0,
      is_shipping_address: addressValue.is_shipping_address ? 1 : 0,
      primary: addressValue.primary ? 1 : 0,
      address_title: `${txtAddressDetail}, ${addressValue?.ward?.value}, ${addressValue?.district?.value}, ${addressValue?.city?.value}`,
      longitude: location?.coords?.longitude,
      latitude: location?.coords?.latitude,
      address_line1: txtAddressDetail,
      city: addressValue?.city?.id || '',
      county: addressValue?.district?.id || '',
      state: addressValue?.ward?.id || '',
    };

    if (type === 'address' || type === 'Adding') {
      startTransition(() => {
        setData(prev => ({
          ...prev,
          customer_primary_address: txtAddressDetail,
          address: [
            ...(prev.address || []), // Copy previous address array
            newAdd,
          ],
        }));
      });
    } else {
      if (
        dataCustomer &&
        dataCustomer.address &&
        dataCustomer.address.length > 0
      ) {
        if (defaultEditData) {
          const addressSelected = dataCustomer.address.find(
            item => item.name === defaultEditData.name,
          );
          const dataUpdate = {
            address: [{ ...addressSelected, ...newAdd }],
            name: dataCustomer.name,
            customer_primary_address: txtAddressDetail,
          };
          const response: any = await CustomerService.updateCustomer(
            dataUpdate,
          );
          if (response?.status === ApiConstant.STT_OK) {
            const newDataAddress = dataCustomer.address.map(item => {
              if (item.name === dataUpdate.address[0].name) {
                return { ...item, ...dataUpdate.address[0] };
              } else {
                return item;
              }
            });
            setData(prev => ({
              ...prev,
              address: newDataAddress,
              customer_primary_address: txtAddressDetail,
            }));
            setAddressSelectedData([]);
            setScreen('');
            onBackButtonPress();
          }
        }
      }
    }
    dispatch(appActions.setProcessingStatus(false));
  }, [addressValue, type, dataCustomer, defaultEditData, txtAddressDetail]);

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

  // useEffect(() => {
  //   if (
  //     addressSelectedData.length === 3 &&
  //     txtAddressDetail &&
  //     !keyboardVisitAble
  //   ) {
  //     autoCompleteGeo(
  //       `${addressSelectedData[2].value}, ${addressSelectedData[1].value}, ${addressSelectedData[0].value}`,
  //     );
  //   }
  // }, [addressSelectedData, txtAddressDetail]);

  useEffect(() => {
    if (addressSelectedData.length > 0) {
      dataAddressRef.current = addressSelectedData;
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
    } else {
      return;
    }
  }, [addressSelectedData]);

  useEffect(() => {
    if (contactSelectedData.length > 0) {
      dataContactRef.current = contactSelectedData;
    }
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

  useEffect(() => {
    if (listDataCity?.city?.length === 0) {
      dispatch(appActions.onGetListCity());
    }
  }, []);
  // useEffect(() => {
  //   let data = defaultEditData?.address_title || '';
  //
  //   startTransition(() => {
  //     setTxtAddressDetail(data);
  //   });
  // }, [defaultEditData]);

  useEffect(() => {
    if (defaultEditData) {
      console.log('deaa', defaultEditData);
      startTransition(() => {
        // setLocation({coords: {longitude: defaultEditData?}})
        autoCompleteData();
      });
    }
  }, [defaultEditData]);

  return (
    <Block
      height={'100%'}
      colorTheme="bg_default"
      block
      flex={1}
      paddingHorizontal={16}
      paddingTop={16}>
      {(screen === 'Adding' || screen === 'AddingContact') &&
        ((type === 'editAddress' && addressSelectedData.length !== 3) ||
          (type === 'address' && addressSelectedData.length !== 3) ||
          (type === 'editContact' && contactSelectedData.length !== 3) ||
          (type === 'contact' && contactSelectedData.length !== 3)) ? (
        <SelectedAddress
          setScreen={setScreen}
          data={
            type === 'contact' || type === 'editContact'
              ? contactSelectedData
              : addressSelectedData
          }
          setData={
            type === 'contact' || type === 'editContact'
              ? setContactSelectedData
              : setAddressSelectedData
          }
        />
      ) : type === 'address' || type === 'editAddress' ? (
        <>
          <AppHeader
            label={type === 'editAddress' ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
            onBack={onBack}
            backButtonIcon={
              <SvgIcon source="Close" colorTheme="black" size={22} />
            }
          />
          <ScrollView
            style={styles.rootBlock}
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
          >

            <Block style={styles.mapBlock}>
              <Mapbox.MapView
                // onCameraChanged={state =>
                //   (zoomLevelRef.current =
                //     state.properties.zoom > 0 ? state.properties.zoom : 15)
                // }
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                pitchEnabled={false}
                attributionEnabled={false}
                scaleBarEnabled={false}
                scrollEnabled={true}
                styleURL={Mapbox.StyleURL.Street}
                logoEnabled={false}
                style={{ flex: 1 }}
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
                    style={{ visibility: 'visible' }}
                  />
                </Mapbox.RasterSource>
                {location?.coords?.longitude && (
                  <>
                    <Mapbox.Camera
                      ref={mapboxCameraRef}
                      centerCoordinate={[
                        location?.coords?.longitude ?? 105.7750996,
                        location?.coords?.latitude ?? 21.0564114,
                      ]}
                      animationMode={'flyTo'}
                      animationDuration={300}
                      zoomLevel={15}
                    />
                    <Mapbox.MarkerView
                      coordinate={[
                        Number(location?.coords?.longitude),
                        Number(location?.coords?.latitude),
                      ]}>
                      <SvgIcon source={'LocationCheckIn'} size={40} />
                    </Mapbox.MarkerView>
                  </>
                )}
              </Mapbox.MapView>
              <TouchableOpacity
                onPress={handleRegainLocation}
                style={styles.regainPosition}>
                <Image
                  source={ImageAssets.MapIcon}
                  style={{ width: 16, height: 16 }}
                  resizeMode={'cover'}
                  tintColor={theme.colors.bg_default}
                />
                <Text style={{ color: theme.colors.bg_default, marginLeft: 4 }}>
                  {getLabel('currentPosition')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGetAddress}
                style={styles.getLocation}>
                <Image
                  source={ImageAssets.MapPinIcon}
                  style={{ width: 16, height: 16 }}
                  resizeMode={'cover'}
                  tintColor={theme.colors.text_secondary}
                />
                <Text style={{ color: theme.colors.text_primary, marginLeft: 4 }}>
                  {getLabel('getAddress')}
                </Text>
              </TouchableOpacity>
            </Block>
            <AppInput
              label={`${getLabel('province')}/${getLabel('city')}`}
              contentStyle={styles.contentStyle}
              onPress={() => {
                setScreen('Adding');
                setAddressSelectedData([]);
              }}
              value={addressValue?.city?.value ?? ''}
              editable={false}
              hiddenRightIcon={false}
              styles={styles.marginInputBlock}
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
                const newData =
                  dataAddressRef.current &&
                  dataAddressRef.current.filter(
                    item => item.type === AddressType.city,
                  );
                if (newData) {
                  setAddressSelectedData(newData);
                  setScreen('Adding');
                }
              }}
              contentStyle={styles.contentStyle}
              styles={styles.marginInputBlock}
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
              contentStyle={styles.contentStyle}
              onPress={() => {
                // console.log('dataAddressRef', dataAddressRef.current);
                const newData =
                  dataAddressRef.current &&
                  dataAddressRef.current.filter(
                    item => item.type !== AddressType.ward,
                  );
                if (newData) {
                  setAddressSelectedData(newData);
                  setScreen('Adding');
                }
              }}
              styles={styles.marginInputBlock}
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
              contentStyle={styles.contentStyle}
              styles={
                addressValue?.detailAddress === getLabel('addressDetail')
                  ? styles.marginInputBlock
                  : styles.containInput
              }
              hiddenRightIcon={true}
              onChangeValue={text =>
                startTransition(() => {
                  setTxtAddressDetail(text);
                })
              }
            />
            <Block>
              {listCheckBox.current.map(item => {
                return (
                  <Block key={item.id}>
                    <TouchableOpacity
                      onPress={() => {
                        item.id === '1'
                          ? setAddressValue((prev: any) => ({
                            ...prev,
                            primary: !addressValue.primary,
                          }))
                          : item.id === '2'
                            ? setAddressValue((prev: any) => ({
                              ...prev,
                              is_shipping_address:
                                !addressValue.is_shipping_address,
                            }))
                            : setAddressValue((prev: any) => ({
                              ...prev,
                              is_primary_address:
                                !addressValue.is_primary_address,
                            }));
                      }}
                      style={styles.checkBoxBlock}>
                      <Block
                        style={
                          item.id === '1'
                            ? styles.boxIconGo(addressValue?.primary)
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
                            color={theme.colors.bg_default}
                            name="check"
                          />
                        ) : null}
                      </Block>
                      <Text>
                        {'   '}
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  </Block>
                );
              })}
            </Block>
          </ScrollView>
          <Block
            style={{
              padding: 16,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  Keyboard.dismiss();
                  setAddressSelectedData([]);
                  setScreen('');
                  onBackButtonPress();
                  setDefaultEditData({});
                }}>
                <AppText style={styles.restartText}>Hủy</AppText>
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
                onPress={() => {
                  Keyboard.dismiss();
                  handleSaveMainAddress();
                }}>
                <AppText style={styles.applyText}>{getLabel('save')}</AppText>
              </TouchableOpacity>
            </Block>
          </Block>
        </>
      ) : (
        <Block block height={'100%'} paddingHorizontal={16}>
          <AppHeader
            label={type === 'contact' ? 'Thêm liên hệ mới' : 'Sửa liên hệ'}
            onBack={() => { }}
            backButtonIcon={
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name="close"
                size={26}
                color={theme.colors.black}
                onPress={onBackButtonPress}
              />
            }
          />
          <ScrollView
            style={styles.rootBlock}
            showsVerticalScrollIndicator={false}>
            <Block block>
              <AppInput
                label={getLabel('contactName')}
                value={contactValue?.nameContact || defaultEditData?.first_name}
                editable={true}
                contentStyle={styles.contentStyle}
                // onPress={() => setDefaultEditData((prev:any) =>({...prev,first_name:''}))}
                hiddenRightIcon={true}
                styles={styles.marginInputBlock}
                onChangeValue={text =>
                  setContactValue((prev: any) => ({
                    ...prev,
                    nameContact: text,
                  }))
                }
              />
              <AppInput
                label={getLabel('phoneNumber')}
                value={contactValue?.phoneNumber || defaultEditData?.phone}
                editable={true}
                contentStyle={styles.contentStyle}
                styles={styles.marginInputBlock}
                onChangeValue={text =>
                  setContactValue((prev: any) => ({
                    ...prev,
                    phoneNumber: text,
                  }))
                }
                inputProp={{ keyboardType: 'numeric', returnKeyType: 'done' }}
                hiddenRightIcon={true}
              />
              <Block marginTop={8} marginBottom={8}>
                <Text
                  fontSize={14}
                  fontWeight="500"
                  colorTheme="text_secondary">
                  Địa chỉ
                </Text>
              </Block>
              <AppInput
                label={`${getLabel('province')}/${getLabel('city')}`}
                contentStyle={styles.contentStyle}
                onPress={() => {
                  setContactSelectedData([]);
                  setScreen('AddingContact');
                }}
                value={contactValue?.city?.value ?? ''}
                editable={false}
                hiddenRightIcon={false}
                styles={styles.marginInputBlock}
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
                  const newData =
                    dataContactRef.current &&
                    dataContactRef.current.filter(
                      item => item.type === AddressType.city,
                    );
                  if (newData) {
                    setContactSelectedData(newData);
                    setScreen('AddingContact');
                  }
                }}
                contentStyle={styles.contentStyle}
                styles={styles.marginInputBlock}
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
                contentStyle={styles.contentStyle}
                onPress={() => {
                  const newData =
                    dataContactRef.current &&
                    dataContactRef.current.filter(
                      item => item.type !== AddressType.district,
                    );
                  if (newData) {
                    setContactSelectedData(newData);
                    setScreen('AddingContact');
                  }
                }}
                styles={styles.marginInputBlock}
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
                contentStyle={styles.contentStyle}
                styles={styles.marginInputBlock}
                onChangeValue={setTxtContactDetail}
                hiddenRightIcon={true}
              />
            </Block>
            <TouchableOpacity
              style={styles.checkBoxBlock}
              onPress={() =>
                setContactValue((prev: any) => ({
                  ...prev,
                  primary: !contactValue?.primary,
                }))
              }>
              <Block
                style={styles.boxMainContact(contactValue?.primary)}
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
          <Block
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            marginBottom={20}
          // color='red'
          >
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  Keyboard.dismiss();
                  setContactSelectedData([]);
                  setScreen('');
                  onBackButtonPress();
                  setDefaultEditData({});
                }}>
                <Text style={styles.restartText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonApply}
                onPress={() => {
                  Keyboard.dismiss();
                  handleSaveMainContact();
                  // setContactValue({});
                }}>
                <Text style={styles.applyText}>{getLabel('save')}</Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default ModalEditAddress;

const modalEditStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalStyle: {
      // paddingHorizontal:16,
      marginHorizontal: 0,
      marginTop: 0,
    } as ViewStyle,
    buttonApply: {
      backgroundColor: theme.colors.primary,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      flex: 1,
      marginHorizontal: 6,
    } as ViewStyle,
    restartText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: theme.colors.text_secondary,
    } as TextStyle,
    checkBoxBlock: {
      flexDirection: 'row',
    } as ViewStyle,
    rootBlock: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
      marginTop: 20,
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
    applyText: {
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 24,
      color: theme.colors.white,
    } as TextStyle,
    marginText: {
      marginLeft: 8,
    } as TextStyle,
    contentStyle: {
      color: theme.colors.text_primary,
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    } as TextStyle,
    marginInputBlock: {
      marginBottom: 20,
    } as ViewStyle,
    iconStyle: {
      width: 24,
      height: 24,
    } as ViewStyle,
    containInput: {
      paddingBottom: 24,
      justifyContent: 'center',
      marginBottom: 20,
    } as ViewStyle,
    mapBlock: {
      overflow: 'hidden',
      width: '100%',
      borderRadius: 16,
      height: 350,
      marginBottom: 16,
    } as ViewStyle,
    containContentButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      // backgroundColor:'red'
    } as ViewStyle,
    buttonRestart: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginHorizontal: 6,
      // width:'100%',
      flex: 1,
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
      top: 300,
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
      top: 300,
      left: 20,
    } as ViewStyle,
  });
