import {
  Keyboard,
  ScrollView,
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
import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {
  AppHeader,
  AppIcons,
  AppInput,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import Modal from 'react-native-modal';
import {CommonUtils} from '../../../utils';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {
  AddressSelected,
  AddressType,
} from '../../Customer/components/FormAddress';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {
  Address,
  DetailCustomerType,
  KeyAbleProps,
  RootEkMapResponse,
} from '../../../models/types';
import {getDetailLocation} from '../../../services/appService';
import {ApiConstant, AppConstant} from '../../../const';
import {AppService} from '../../../services';
import Mapbox from '@rnmapbox/maps';
import SelectedAddress from '../../Customer/components/SelectedAddress';
type Props = {
  visible: boolean;
  onBackButtonPress: () => void;
  type: string;
  setData: React.Dispatch<React.SetStateAction<DetailCustomerType>>;
};

const ModalEditAddress = ({
  visible,
  onBackButtonPress,
  type,
  setData,
}: Props) => {
  const theme = useTheme();
  const styles = modalEditStyles(theme);
  const {t: getLabel} = useTranslation();

  const [screen, setScreen] = useState('');
  const [addressSelectedData, setAddressSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [contactSelectedData, setContactSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [addressValue, setAddressValue] = useState<any>({
  
    address_title: '',
    is_primary_address: 0,
    is_shipping_address: 0,
    address_location: '',
  });
  const [contactValue, setContactValue] = useState<any>({
    
    nameContact: '',
    phoneNumber: '',
    addressContact: '',
    isMainAddress: true,
  });

  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');

  const [keyboardVisitAble, setKeyboardVisitAble] = useState<boolean>(false);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const listCheckBox = useRef([
    {
      id: '1',
      label: getLabel('setDeliveryAddress'),
    },
    {
      id: '2',
      label: getLabel('setOrderAddress'),
    },
  ]);

  const isValidAddress = useMemo(() => {
    return addressSelectedData?.length === 3 && txtAddressDetail !== '';
  }, [addressSelectedData, txtAddressDetail]);

  const onPressButtonGetLocation = () => {
    CommonUtils.getCurrentLocation(locations => {
      fetchData(locations.coords.latitude, locations.coords.longitude);
    });
  };

  const fetchData = useCallback(
    async (lat: any, lon: any) => {
      const data: RootEkMapResponse = await getDetailLocation(lat, lon);
      if (data.status === 'OK' && data.results.length > 0) {
        setAddressValue((prev: any) => ({
          ...prev,
          detailAddress: data.results[0].formatted_address,
          name:data.results[0].formatted_address
        }));
        const addressSplit = data.results[0].formatted_address.split(',', 4);
        const newData: AddressSelected[] = [
          {
            type: AddressType.city,
            value: addressSplit[3] ?? '',
          },
          {
            type: AddressType.ward,
            value: addressSplit[2] ?? '',
          },
          {
            type: AddressType.district,
            value: addressSplit[1] ?? '',
          },
        ];

        startTransition(() => {
          setAddressSelectedData(newData);
          setTxtAddressDetail(addressSplit[0] ?? '');
        });
      }
    },
    [location?.coords.longitude, location?.coords.latitude, txtAddressDetail],
  );

  const handleSaveMainContact = useCallback(() => {
    startTransition(() =>{
    setData(prev => ({
      ...prev,
      contacts: [
        ...(prev.contacts || []),
        {
          last_name: contactValue.nameContact,
          first_name: contactValue.nameContact,
          mobile_no: contactValue.phoneNumber,
          address: ` ${txtContactDetail}, ${contactValue.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
          is_billing_contact: contactValue.isMainAddress ? 1 : 0,
          is_primary_contact: 0,
          name:contactValue.nameContact
        },
      ],
    }));
  })
  setContactValue({})
    onBackButtonPress();
  }, [contactValue,txtContactDetail]);


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

  const handleSaveMainAddress = useCallback(() => {
    startTransition(() => {
      setData(prev => ({
        ...prev,
        customer_primary_address: txtAddressDetail,
        address: [
          ...(prev.address || []), // Copy previous address array
          {
            is_primary_address: addressValue.addressGet ? 1 : 0,
            is_shipping_address: addressValue.addressOrder ? 1 : 0,
            address_title: txtAddressDetail,
            address_location: JSON.stringify(location?.coords), // Assuming txtAddressDetail contains the address location
            name:txtAddressDetail
          },
        ],
      }));
    });
    setAddressValue({});
    setAddressSelectedData([]);
    onBackButtonPress();
  }, [addressValue.addressGet, addressValue.addressOrder]);

  // setData(prev => ({
  //   ...prev,
  //   latitude: location?.coords.latitude,
  //   longitude: location?.coords.longitude,
  // }));

  //

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
      // txtAddressDetail &&
      !keyboardVisitAble
    ) {
      autoCompleteGeo(
        ` ${addressSelectedData[2].value}, ${addressSelectedData[1].value}, ${addressSelectedData[0].value}`,
      );
    }
  }, [addressSelectedData, keyboardVisitAble]);

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

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      animationIn={'slideInUp'}
      backdropOpacity={0.5}
      style={styles.modalStyle}
      animationOut={'slideOutDown'}>
      <Block colorTheme="bg_default" block paddingHorizontal={16}>
        {(screen === 'Adding' || screen === 'AddingContact') &&
        ((type === 'address' && addressSelectedData.length !== 3) ||
          (type === 'contact' && contactSelectedData.length !== 3)) ? (
          <SelectedAddress
            setScreen={setScreen}
            data={
              type === 'address' ? addressSelectedData : contactSelectedData
            }
            setData={
              type === 'address'
                ? setAddressSelectedData
                : setContactSelectedData
            }
          />
        ) : type === 'address' ? (
          <>
            <AppHeader
              label="Địa chỉ chính"
              onBack={onBackButtonPress}
              backButtonIcon={
                <SvgIcon source="Close" colorTheme="black" size={22} />
              }
            />
            <Block marginBottom={24} marginTop={10}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => onPressButtonGetLocation()}>
                <SvgIcon
                  source="iconMap"
                  size={20}
                  color={theme.colors.action}
                />
                <Text
                  style={styles.marginText}
                  fontSize={14}
                  colorTheme="action"
                  fontWeight="500">
                  Lấy vị trí hiện tại
                </Text>
              </TouchableOpacity>
            </Block>
            <ScrollView
              style={styles.rootBlock}
              showsVerticalScrollIndicator={false}>
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
                  setScreen('Adding');
                  startTransition(() => {
                    const newData = addressSelectedData.filter(
                      item => item.type === AddressType.city,
                    );
                    setAddressSelectedData(newData);
                  });
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
                  setScreen('Adding');
                  startTransition(() => {
                    const newData = addressSelectedData.filter(
                      item => item.type !== AddressType.district,
                    );
                    setAddressSelectedData(newData);
                  });
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
                  addressValue.detailAddress === getLabel('addressDetail')
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
                                addressGet: !addressValue.addressGet,
                              }))
                            : setAddressValue((prev: any) => ({
                                ...prev,
                                addressOrder: !addressValue.addressOrder,
                              }));
                        }}
                        style={styles.checkBoxBlock}>
                        <Block
                          style={
                            item.id === '1'
                              ? styles.boxIconGo(addressValue.addressGet)
                              : styles.boxIconOrder(addressValue.addressOrder)
                          }>
                          {addressValue.addressGet ||
                          addressValue.addressOrder ? (
                            <AppIcons
                              iconType={AppConstant.ICON_TYPE.EntypoIcon}
                              size={14}
                              color={theme.colors.white}
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
              <Block style={styles.mapBlock}>
                <Mapbox.MapView
                  pitchEnabled={false}
                  attributionEnabled={false}
                  scaleBarEnabled={false}
                  scrollEnabled={true}
                  styleURL={Mapbox.StyleURL.Street}
                  logoEnabled={false}
                  style={{flex: 1}}>
                  <Mapbox.RasterSource
                    id="adminmap"
                    tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
                    <Mapbox.RasterLayer
                      id={'adminmap'}
                      sourceID={'admin'}
                      style={{visibility: 'visible'}}
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
            <Block
              // block
              padding={16}
              direction="column"
              justifyContent="flex-end"
              paddingHorizontal={16}>
              <Block style={styles.containContentButton}>
                <TouchableOpacity
                  style={styles.buttonRestart}
                  onPress={() => {
                    setAddressSelectedData([]);
                    setScreen('');
                    onBackButtonPress();
                  }}>
                  <Text style={styles.restartText}>Hủy</Text>
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
                  onPress={handleSaveMainAddress}>
                  <Text
                    fontSize={14}
                    colorTheme="white"
                    fontWeight="700"
                    lineHeight={24}>
                    {getLabel('save')}
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </>
        ) : (
          <Block block height={'100%'}>
            <AppHeader
              label={getLabel('mainContact')}
              onBack={() => {}}
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
                  value={contactValue.nameContact}
                  editable={true}
                  contentStyle={styles.contentStyle}
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
                  value={contactValue.phoneNumber}
                  editable={true}
                  contentStyle={styles.contentStyle}
                  styles={styles.marginInputBlock}
                  onChangeValue={text =>
                    setContactValue((prev: any) => ({
                      ...prev,
                      phoneNumber: text,
                    }))
                  }
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
                    setScreen('AddingContact');
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
                    setScreen('AddingContact');
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
                    setContactSelectedData([]);
                    setScreen('');
                    onBackButtonPress();
                  }}>
                  <Text style={styles.restartText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonApply}
                  onPress={() => {
                    handleSaveMainContact();
                    setContactValue({});
                    
                  }}>
                  <Text style={styles.applyText}>{getLabel('save')}</Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </Block>
        )}
      </Block>
    </Modal>
  );
};

export default React.memo(ModalEditAddress, isEqual);

const modalEditStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalStyle: {
      // paddingHorizontal:16,
      marginHorizontal: 0,
      marginVertical: 0,
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
  });
