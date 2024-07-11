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
  ContactCard,
  DetailCustomerType,
  KeyAbleProps,
  RootEkMapResponse,
} from '../../../models/types';
import {getDetailLocation} from '../../../services/appService';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import {AppService} from '../../../services';
import Mapbox from '@rnmapbox/maps';
import SelectedAddress from '../../Customer/components/SelectedAddress';
import {backgroundErrorListener, useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {dispatch} from '../../../utils/redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import {ListDistrict, ListWard} from '../../../redux-store/app-reducer/type';
import { useIsFocused } from '@react-navigation/native';
type Props = {
  visible: boolean;
  onBackButtonPress: () => void;
  type: string;
  setData: React.Dispatch<React.SetStateAction<DetailCustomerType>>;
  dataCustomer: DetailCustomerType;
  defaultEditData?: any;
  setDefaultEditData: React.Dispatch<React.SetStateAction<any>>;
  screenPass?: any;
};

const ModalEditAddress = ({
  visible,
  onBackButtonPress,
  type,
  setData,
  dataCustomer,
  defaultEditData,
  screenPass,
  setDefaultEditData,
}: Props) => {
  const theme = useTheme();
  const styles = modalEditStyles(theme);
  const {t: getLabel} = useTranslation();

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

  // console.log(defaultEditData, 'dat');
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

  const [addressValue, setAddressValue] = useState<any>({
    address_title: '',
    is_primary_address: 0,
    is_shipping_address: 0,
    primary:defaultEditData?.primary ? defaultEditData?.primary === 1 ? true : false : false,
    address_location: '',
    address_line1: '',
    city: '',
    county: '',
    state: '',
  });
  const [contactValue, setContactValue] = useState<any>({
    nameContact: '',
    phoneNumber: '',
    addressContact: '',
    isMainAddress: true,
    isPrimaryAddress: true,
  });
  const isFocus = useIsFocused()
  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');

  const [keyboardVisitAble, setKeyboardVisitAble] = useState<boolean>(false);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [isPending, startTransition] = useTransition();
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

  useEffect(() => {
    if (listDataCity?.city?.length === 0) {
      dispatch(appActions.onGetListCity());
    }
  }, []);

  // console.log(addressValue,'addressValue')
  const onPressButtonGetLocation = () => {
    CommonUtils.getCurrentLocation(
      locations => {
        fetchData(locations.coords.latitude, locations.coords.longitude);
      },
      err => backgroundErrorListener(err.code),
    );
  };
  // console.log(defaultEditData,'def')

  const onBack = useCallback(() => {
    onBackButtonPress();
    setDefaultEditData({});
    setAddressValue({});
    setContactValue({});
  }, [defaultEditData, visible]);

  const fetchData = useCallback(
    async (lat: any, lon: any) => {
      const data: RootEkMapResponse = await getDetailLocation(lat, lon);
      if (data.status === 'OK' && data.results.length > 0) {
        setAddressValue((prev: any) => ({
          ...prev,
          detailAddress: data.results[0].formatted_address,
          name: data.results[0].formatted_address,
        }));
        // console.log(data.results, 'data res');
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
        // console.log(newData,'run ????')

        startTransition(() => {
          setAddressSelectedData(newData);
          setTxtAddressDetail(addressSplit[0] ?? '');
        });
      }
    },
    [location?.coords.longitude, location?.coords.latitude, txtAddressDetail],
  );

  const handleSaveMainContact = useCallback(async () => {
    let newArr: ContactCard[] | undefined = dataCustomer.contacts;
    const contact: any = {
      // last_name: contactValue.nameContact,
      first_name: contactValue.nameContact || defaultEditData?.first_name,
      phone: contactValue.phoneNumber || defaultEditData?.phone,
      address: ` ${txtContactDetail}, ${contactValue.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
      is_billing_contact: 0,
      is_primary_contact: contactValue.isMainAddress ? 1 : 0,
      primary: contactValue.isMainAddress ? 1 : 0,
      // name: contactValue.nameContact,
      city: contactSelectedData[0]?.id || '',
      county: contactSelectedData[1]?.id || '',
      state: contactSelectedData[2]?.id || '',
      address_title: ` ${txtContactDetail}, ${contactValue.ward?.value}, ${contactValue?.district?.value}, ${contactValue?.city?.value}`,
      address_line1: txtContactDetail,
      name: defaultEditData?.name!,
    };
    if (type === 'contact' || type === 'AddingContact') {
      // console.log('run case nor');
      startTransition(() => {
        setData(prev => ({
          ...prev,
          contacts: [...(prev.contacts || []), contact],
        }));
      });
    } else {
      // console.log('run case spec');
      if (
        dataCustomer &&
        dataCustomer.contacts &&
        dataCustomer.contacts.length > 0
      ) {
        // console.log('run if');
        if (defaultEditData && Object.keys(defaultEditData).length > 0) {
          // console.log('run replace');
          let indexData = dataCustomer.contacts.findIndex(item =>
            item.first_name
              ? item.first_name === defaultEditData?.first_name
              : item.name === defaultEditData?.name,
          );
          // console.log(indexData, newArr, 'check flag');
          if (indexData !== -1 && newArr && newArr.length > 0) {
            // console.log('run done');
            newArr[indexData] = contact;
            setData(prev => ({...prev, contacts: newArr}));

            if (screenPass === ScreenConstant.DETAIL_CUSTOMER) {
              const dataUpdate = {
                contact: newArr,
                name: dataCustomer.name,
              };
              dispatch(
                customerActions.updateCustomerAction(
                  dataUpdate,
                  dataCustomer.name || '',
                ),
              );
            }
          }
        } else {
          // console.log('run case new');
          startTransition(() => {
            setData(prev => ({
              ...prev,
              contacts: [...(prev.contacts || []), contact],
            }));
          });
        }
      }
    }

    setContactValue({});
    setContactSelectedData([]);
    setTxtContactDetail('');
    // setDefaultEditData({});
    setScreen('');
    onBackButtonPress();
  }, [contactValue, txtContactDetail, addressObj, contactSelectedData, screen]);

  // console.log(type);

  // console.log(contactValue,'contacst')
  const autoCompleteData = useCallback(async () => {
    if (listDataCity.city.length > 0) {
      if (type === 'editAddress') {
        let add: Address = defaultEditData;
        // console.log(add, 'editValue');
        if (add.city != null) {
          let value = listDataCity.city.find(item => item.ma_tinh === add.city);
          // console.log(value, 'value');
          setAddressValue((prev: any) => ({
            ...prev,
            city: {
              value: value?.ten_tinh,
              id: value?.ma_tinh,
            },
          }));
          const districtRes: any = await AppService.getListDistrict(
            value?.ma_tinh,
          );
          if (districtRes?.status === ApiConstant.STT_OK) {
            let districtVal: ListDistrict = districtRes.data.result?.find(
              (item: ListDistrict) => item.ma_huyen === add.county,
            );
            setAddressValue((prev: any) => ({
              ...prev,
              district: {
                value: districtVal?.ten_huyen,
                id: districtVal?.ma_huyen,
              },
            }));
            const wardRes: any = await AppService.getListWard(
              districtVal.ma_huyen,
            );
            if (wardRes?.status === ApiConstant.STT_OK) {
              let wardValue: ListWard = wardRes?.data?.result.find(
                (item: ListWard) => item.ma_xa === add.state,
              );
              setAddressValue((prev: any) => ({
                ...prev,
                ward: {
                  value: wardValue?.ten_xa,
                  id: wardValue?.ma_xa,
                },
              }));
            }
          }
        }
      } else {
        let add: ContactCard = defaultEditData;
        // console.log(add, 'editContact');
        if (add.city != null) {
          let value = listDataCity.city.find(item => item.ma_tinh === add.city);
          console.log(value, 'value');

          setContactValue((prev: any) => ({
            ...prev,
            city: {
              value: value?.ten_tinh,
              id: value?.ma_tinh,
            },
          }));
          const districtRes: any = await AppService.getListDistrict(
            value?.ma_tinh,
          );
          if (districtRes?.status === ApiConstant.STT_OK) {
            let districtVal: ListDistrict = districtRes.data.result?.find(
              (item: ListDistrict) => item.ma_huyen === add.county,
            );
            setContactValue((prev: any) => ({
              ...prev,
              district: {
                value: districtVal?.ten_huyen,
                id: districtVal?.ma_huyen,
              },
            }));
            const wardRes: any = await AppService.getListWard(
              districtVal.ma_huyen,
            );
            if (wardRes?.status === ApiConstant.STT_OK) {
              let wardValue: ListWard = wardRes?.data?.result.find(
                (item: ListWard) => item.ma_xa === add.state,
              );
              setContactValue((prev: any) => ({
                ...prev,
                ward: {
                  value: wardValue?.ten_xa,
                  id: wardValue?.ma_xa,
                },
              }));
            }
          }
        }
      }
    }
  }, [defaultEditData,type,isFocus,addressValue,contactValue]);

  const autoCompleteGeo = async (address: string) => {
    if (address) {
      await CommonUtils.CheckNetworkState();
      const res: KeyAbleProps = await AppService.autocompleteGeoLocation(
        address,
      );
      if (res.status === ApiConstant.STT_OK || 'OK') {
        const geometry: any = res.results[0].geometry;
        setLocation({
          // @ts-ignore
          coords: {
            longitude: geometry.location.lng,
            latitude: geometry.location.lat,
          },
        });
        const response: KeyAbleProps = await AppService.getDetailLocation(
          geometry.location.lat,
          geometry.location.lng,
        );
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
              citySelectedItem =>
                citySelectedItem.ten_tinh === citySelectedName,
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
      }
    }
  };

  // console.log(addressObj,'addObj')

  // console.log(screen,'type')

  const handleSaveMainAddress = useCallback(() => {
    let newArr: Address[] | undefined = dataCustomer.address;

    const newAdd = {
      is_primary_address: addressValue.addressGet ? 1 : 0,
      is_shipping_address: addressValue.addressOrder ? 1 : 0,
      primary: addressValue.primary ? 1 : 0,
      address_title: txtAddressDetail,
      address_location: JSON.stringify(location?.coords), // Assuming txtAddressDetail contains the address location
      name: txtAddressDetail + '-Billing',
      // address_line1: txtAddressDetail,
      address_type: 'Billing',
      city: addressObj.province.code || '',
      county: addressObj.district.code || '',
      state: addressObj.ward.code || '',
      address_line1: addressObj.detail,
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
          let indexData = dataCustomer.address?.findIndex(
            item => item.address_line1 === defaultEditData?.address_line1,
          );
          if (indexData != -1 && newArr && newArr.length > 0) {
            newArr[indexData] = newAdd;
            setData(prev => ({
              ...prev,
              address: newArr,
              customer_primary_address: txtAddressDetail,
            }));

            if (screenPass === ScreenConstant.DETAIL_CUSTOMER) {
              const dataUpdate = {
                address: newArr,
                name: dataCustomer.name,
                customer_primary_address: txtAddressDetail,
              };
              dispatch(
                customerActions.updateCustomerAction(
                  dataUpdate,
                  dataCustomer.name || '',
                ),
              );
            }
          }
        } else {
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
        }
      }
    }
    setAddressValue({});
    // setDefaultEditData({});
    setTxtAddressDetail('');
    setAddressSelectedData([]);
    setScreen('');
    // setData(prev => ({...prev, address: []}));
    onBackButtonPress();
  }, [
    addressValue.addressGet,
    addressValue.addressOrder,
    addressObj,
    screen,
    addressSelectedData,
    addressValue.primary,
  ]);

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
    if (addressSelectedData.length > 0) {
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
  useEffect(() => {
    let data = defaultEditData?.address_title || '';

    startTransition(() => {
      setTxtAddressDetail(data);
    });
  }, [defaultEditData]);
  // console.log(contactSelectedData, 'datâ');

  useEffect(() => {
    startTransition(() => {
      autoCompleteData();
    });
  }, [type, defaultEditData, visible,isFocus]);

  // console.log(contactValue.isMainAddress, 'rể');
  // console.log(defaultEditData,'??')
  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onBack}
      onBackdropPress={onBack}
      animationIn={'slideInUp'}
      backdropOpacity={0.5}
      style={styles.modalStyle}
      animationOut={'slideOutDown'}>
      <Block colorTheme="bg_default" block paddingHorizontal={16}>
        {(screen === 'Adding' || screen === 'AddingContact') &&
        ((type === 'editAddress' && addressSelectedData.length !== 4) ||
          (type === 'address' && addressSelectedData.length !== 4) ||
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
              label={
                type === 'editAddress' ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'
              }
              onBack={onBack}
              backButtonIcon={
                <SvgIcon source="Close" colorTheme="black" size={22} />
              }
            />
            <Block marginBottom={24} marginTop={10} paddingHorizontal={16}>
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
                  startTransition(() => {
                    const newData = addressSelectedData.filter(
                      item => item.type === AddressType.city,
                    );
                    setAddressSelectedData(newData);
                    setScreen('Adding');
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
                  startTransition(() => {
                    const newData = addressSelectedData.filter(
                      item => item.type !== AddressType.district,
                    );
                    setAddressSelectedData(newData);
                    setScreen('Adding');
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
                        style={styles.checkBoxBlock}>
                        <Block
                          style={
                            item.id === '1'
                              ? styles.boxIconGo(addressValue.primary)
                              : item.id === '2'
                              ? styles.boxIconOrder(addressValue.addressGet)
                              : styles.boxIconOrder(addressValue.addressOrder)
                          }>
                          {addressValue.addressGet ||
                          addressValue.addressOrder ||
                          addressValue.primary ? (
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
                  style={[styles.buttonApply]}
                  // disabled={!isValidAddress}
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
          <Block block height={'100%'} paddingHorizontal={16}>
            <AppHeader
              label={type === 'contact' ? 'Thêm liên hệ mới' : 'Sửa liên hệ'}
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
                  value={contactValue.nameContact || defaultEditData?.first_name}
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
                  value={contactValue.phoneNumber || defaultEditData?.phone}
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
                    const newData = contactSelectedData.filter(
                      item => item.type !== AddressType.city,
                    );
                    setContactSelectedData(newData);
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
                    const newData = contactSelectedData.filter(
                      item => item.type !== AddressType.district,
                    );
                    setContactSelectedData(newData);
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
                  value={txtContactDetail || defaultEditData?.address}
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
                    isMainAddress: !contactValue.isMainAddress,
                  }))
                }>
                <Block
                  style={styles.boxMainContact(contactValue.isMainAddress)}
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
                    handleSaveMainContact();
                    setDefaultEditData({});

                    // setContactValue({});
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
