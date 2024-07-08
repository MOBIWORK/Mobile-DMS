import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useState, useRef, useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-paper';
import {
  AppHeader,
  AppIcons,
  AppInput,
  AppText,
  Block,
  SvgIcon,
} from '../../../components/common';
import {ApiConstant, AppConstant} from '../../../const';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {getDetailLocation} from '../../../services/appService';
import Colors from '../../../assets/Colors';
import {
  DetailCustomerType,
  IDataCustomer,
  KeyAbleProps,
  RootEkMapResponse,
} from '../../../models/types';
import {dispatch} from '../../../utils/redux';
import SelectedAddress from './SelectedAddress';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import {MainAddress, MainContactAddress} from './CardAddress';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../utils';
import Mapbox from '@rnmapbox/maps';
import {AppService} from '../../../services';
import {GeolocationResponse} from '@react-native-community/geolocation';
import isEqual from 'react-fast-compare';
import {backgroundErrorListener} from '../../../config/function';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import {IUpdateAddress} from '../../../services/checkinService';
import {dataCustomer} from '../../Report/Statistical/components/data';

type Props = {
  onPressClose: () => void;
  typeFilter: any;
  listData: IDataCustomer;
  setData: (item: IDataCustomer) => void;
  dataCustomer?: DetailCustomerType;
  getDetailCustomer?: () => Promise<void>;
  setDataAddress?: React.Dispatch<React.SetStateAction<any>>;
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
  const {onPressClose, typeFilter, listData, setData, setDataAddress} = props;
  const theme = useTheme();
  const {t: getLabel} = useTranslation();
  const styles = rootStyles(theme, getLabel);
  const [screen, setScreen] = useState('');
  const [addressSelectedData, setAddressSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [contactSelectedData, setContactSelectedData] = useState<
    AddressSelected[]
  >([]);

  const [addressValue, setAddressValue] = useState<MainAddress>({
    detailAddress: '',
    addressOrder: false,
    addressGet: false,
    primary: false,
  });
  const [contactValue, setContactValue] = useState<MainContactAddress>({
    nameContact: '',
    phoneNumber: '',
    addressContact: '',
    isMainAddress: true,
  });

  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');
  const [enableGPS, setEnableGPS] = useState(false);

  const [keyboardVisitAble, setKeyboardVisitAble] = useState<boolean>(false);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);

  const listCheckBox = useRef([
    {
      id: '1',
      label: getLabel('setMainAddress'),
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

  const fetchData = async (lat: any, lon: any) => {
    const data: RootEkMapResponse = await getDetailLocation(lat, lon);
    if (data.status === 'OK' && data.results.length > 0) {
      setAddressValue(prev => ({
        ...prev,
        detailAddress: data.results[0].formatted_address,
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
      setAddressSelectedData(newData);
      setTxtAddressDetail(addressSplit[0] ?? '');
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
    console.log('runnnn');
    {
      const locationIDRes: any = await AppService.getIDLocation({
        province_name: addressValue.city?.value ?? '',
        district_name: addressValue.district?.value ?? '',
        ward_name: addressValue.ward?.value ?? '',
      });
      if (locationIDRes?.status === ApiConstant.STT_OK) {
        const newAddressValue: MainAddress = {
          ...addressValue,
          city: {
            ...addressValue.city,
            id: locationIDRes.data.result.province_id,
          } as any,
          district: {
            ...addressValue.district,
            id: locationIDRes.data.result.district_id,
          } as any,
          ward: {
            ...addressValue.ward,
            id: locationIDRes.data.result.ward_id,
          } as any,
        };

        const data: IUpdateAddress = {
          customer: props.dataCustomer?.name! || '',
          long: location?.coords.longitude || NaN,
          lat: location?.coords.latitude || NaN,
          address_line1: txtAddressDetail,
          state: {
            code: locationIDRes.data.result.ward_id,
            name: addressValue.ward?.value ?? '',
          },
          county: {
            code: locationIDRes.data.result.district_id,
            name: addressValue.district?.value ?? '',
          },
          city: {
            code: locationIDRes.data.result.province_id,
            name: addressValue.city?.value ?? '',
          },
        };
        // console.log(object)
        // console.log(locationIDRes.data.result,'locaiton ID res')
        const dataUpdate = {
          name: props.dataCustomer?.name || '',
          address: [
            ...(props.dataCustomer?.address || []),
            {
              is_primary_address: addressValue.addressGet ? 1 : 0,
              is_shipping_address: addressValue.addressOrder ? 1 : 0,
              address_title: txtAddressDetail,
              address_location: JSON.stringify(location?.coords), // Assuming txtAddressDetail contains the address location
              name: txtAddressDetail + '-Billing',
              // address_line1: txtAddressDetail,
              address_type: 'Billing',
              city: locationIDRes.data.result.province_id || '',
              county: locationIDRes.data.result.district_id || '',
              state: locationIDRes.data.result.ward_id || '',
              address_line1: txtAddressDetail,
            },
          ],
        };
        // setData(prev => )
        // console.log(dataUpdate,'dataUpdateCus');
        dispatch(
          customerActions.updateCustomerAction(
            dataUpdate,
            props.dataCustomer?.name || '',
          ),
        );
        // setDataAddress!(prev =>({...prev,}))
        // setData(prev =>({...prev,.}))
        dispatch(
          customerActions.setMainAddress({
            ...newAddressValue,
            data,
            detailAddress: txtAddressDetail,
          }),
        );
      }
      onPressClose();
      setData({
        ...listData,
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });
    }
  };
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
      setAddressValue(prev => ({
        ...prev,
        city: addressSelectedData[0],
        district: addressSelectedData[1],
        ward: addressSelectedData[2],
      }));
    } else if (addressSelectedData.length === 2) {
      setAddressValue(prev => ({
        ...prev,
        city: addressSelectedData[0],
        district: addressSelectedData[1],
      }));
    } else if (addressSelectedData.length === 1) {
      setAddressValue(prev => ({
        ...prev,
        city: addressSelectedData[0],
      }));
    } else {
      setAddressValue(prev => ({
        ...prev,
      }));
    }
  }, [addressSelectedData]);

  useEffect(() => {
    if (contactSelectedData.length === 3) {
      setContactValue(prev => ({
        ...prev,
        city: contactSelectedData[0],
        district: contactSelectedData[1],
        ward: contactSelectedData[2],
      }));
    } else if (contactSelectedData.length === 2) {
      setContactValue(prev => ({
        ...prev,
        city: contactSelectedData[0],
        district: contactSelectedData[1],
      }));
    } else if (contactSelectedData.length === 1) {
      setContactValue(prev => ({
        ...prev,
        city: contactSelectedData[0],
      }));
    } else {
      setContactValue(prev => ({
        ...prev,
      }));
    }
  }, [contactSelectedData]);

  // console.log(dataCustomer,'dataCus')

  const handleSaveMainContact = React.useCallback(async () => {
    const locationIDRes: any = await AppService.getIDLocation({
      province_name: addressValue.city?.value ?? '',
      district_name: addressValue.district?.value ?? '',
      ward_name: addressValue.ward?.value ?? '',
    });
    if (locationIDRes?.status === ApiConstant.STT_OK) {
      const data = {
        first_name: contactValue.nameContact,
        phone: contactValue.phoneNumber,
        last_name: contactValue.nameContact,
        address: txtAddressDetail,
        is_primary_contact: 0,
        state: {
          code: locationIDRes.data.result.ward_id,
          name: addressValue.ward?.value ?? '',
        },
        county: {
          code: locationIDRes.data.result.district_id,
          name: addressValue.district?.value ?? '',
        },
        city: {
          code: locationIDRes.data.result.province_id,
          name: addressValue.city?.value ?? '',
        },
      };
      dispatch(
        customerActions.updateCustomerAction(
          data,
          props.dataCustomer?.name || '',
        ),
      );
      dispatch(
        customerActions.setMainContactAddress({
          ...data,
          addressContact: txtContactDetail,
        }),
      );
    }

    onPressClose();
  }, [contactValue, txtContactDetail]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'top']}>
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
        <Block block>
          <Block style={styles.headerContentView('Địa chỉ chính')}>
            <AppHeader
              label="Địa chỉ chính"
              onBack={() => {}}
              backButtonIcon={
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name="close"
                  size={26}
                  color={theme.colors.black}
                  onPress={onPressClose}
                />
              }
            />
          </Block>

          <Block style={[styles.buttonView, {marginBottom: 24}]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                checkGPS();

                onPressButtonGetLocation();
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
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
                  item => item.type !== AddressType.district,
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
                              primary: !addressValue.primary,
                            }))
                          : item.id === '2'
                          ? setAddressValue((prev: any) => ({
                              ...prev,
                              addressGet: !addressValue.addressGet,
                            }))
                          : setAddressValue((prev: any) => ({
                              ...prev,
                              addressOrder: !addressValue.addressOrder,
                            }));
                      }}
                      style={styles.checkBoxView}>
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
          <Block style={styles.containButtonBottom(typeFilter)}>
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  setAddressSelectedData([]);
                  setScreen('');
                  onPressClose();
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
                onPress={handleSaveMainAddress}>
                <AppText style={styles.applyText}>{getLabel('save')}</AppText>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      ) : (
        <>
          <Block style={styles.headerContentView(getLabel('mainContact'))}>
            <AppHeader
              label={getLabel('mainContact')}
              onBack={() => {}}
              backButtonIcon={
                <AppIcons
                  iconType={AppConstant.ICON_TYPE.IonIcon}
                  name="close"
                  size={26}
                  color={theme.colors.black}
                  onPress={onPressClose}
                />
              }
            />
          </Block>
          <Block block>
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
                setContactValue(prev => ({...prev, nameContact: text}))
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
              styles={styles.marginInputView}
              onChangeValue={text =>
                setContactValue(prev => ({...prev, phoneNumber: text}))
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
          </Block>
          <Block style={styles.containButtonBottom(typeFilter)}>
            <Block style={styles.containContentButton}>
              <TouchableOpacity
                style={styles.buttonRestart}
                onPress={() => {
                  setContactSelectedData([]);
                  setScreen('');
                  onPressClose();
                }}>
                <AppText style={styles.restartText}>Hủy</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonApply}
                onPress={handleSaveMainContact}>
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
        marginTop: 16,
        // top: label === getLabel('mainAddress') ? 0 : 0,
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
  });
