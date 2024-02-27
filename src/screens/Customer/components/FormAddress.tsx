import {
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-paper';
import {
  AppHeader,
  AppIcons,
  AppInput,
  AppText,
  Block,
  SvgIcon,
  showSnack,
} from '../../../components/common';
import {AppConstant} from '../../../const';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {MainLayout} from '../../../layouts';

import BackgroundGeolocation from 'react-native-background-geolocation';
import {getDetailLocation} from '../../../services/appService';
import Colors from '../../../assets/Colors';
import {RootEkMapResponse} from '../../../models/types';
import {dispatch} from '../../../utils/redux';
import SelectedAddress from './SelectedAddress';
import {customerActions} from '../../../redux-store/customer-reducer/reducer';
import {MainAddress, MainContactAddress} from './CardAddress';
import {useTranslation} from 'react-i18next';

type Props = {
  onPressClose: () => void;
  typeFilter: any;
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
  const {onPressClose, typeFilter} = props;
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
  });
  const [contactValue, setContactValue] = useState<MainContactAddress>({
    nameContact: '',
    phoneNumber: '',
    addressContact: '',
    isMainAddress: true,
  });

  const [txtAddressDetail, setTxtAddressDetail] = useState<string>('');
  const [txtContactDetail, setTxtContactDetail] = useState<string>('');

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
    } else {
      showSnack({
        msg: getLabel('error:haveError'),
        type: 'error',
        interval: 1000,
      });
    }
  };

  const onPressButtonGetLocation = () => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(res => {
        fetchData(res?.coords?.latitude, res?.coords?.longitude);

        showSnack({
          msg: getLabel('success'),
          type: 'success',
          interval: 1000,
        });
      })
      .catch(err => console.log(err));
  };

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
        <>
          <View style={styles.headerContentView('Địa chỉ chính')}>
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
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={onPressButtonGetLocation}>
              <SvgIcon source="iconMap" size={20} colorTheme="action" />
              <AppText
                style={styles.marginText}
                fontSize={14}
                colorTheme="action"
                fontWeight="500">
                Lấy vị trí hiện tại
              </AppText>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <MainLayout>
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
              <View style={styles.checkBoxRootView}>
                {listCheckBox.current.map(item => {
                  return (
                    <View key={item.id}>
                      <TouchableOpacity
                        onPress={() => {
                          item.id === '1'
                            ? setAddressValue(prev => ({
                                ...prev,
                                addressGet: !addressValue.addressGet,
                              }))
                            : setAddressValue(prev => ({
                                ...prev,
                                addressOrder: !addressValue.addressOrder,
                              }));
                        }}
                        style={styles.checkBoxView}>
                        <View
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
                        </View>
                        <AppText>
                          {'   '}
                          {item.label}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </MainLayout>
          </ScrollView>
          <View style={styles.containButtonBottom}>
            <View style={styles.containContentButton}>
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
                style={styles.buttonApply}
                onPress={() => {
                  dispatch(
                    customerActions.setMainAddress({
                      ...addressValue,
                      detailAddress: txtAddressDetail,
                    }),
                  );
                  onPressClose();
                }}>
                <AppText style={styles.applyText}>{getLabel('save')}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.headerContentView(getLabel('mainContact'))}>
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
          </View>
          <MainLayout style={{paddingTop: 0}}>
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
            <View style={styles.containButtonBottom}>
              <View style={styles.containContentButton}>
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
                  onPress={() => {
                    dispatch(
                      customerActions.setMainContactAddress({
                        ...contactValue,
                        addressContact: txtContactDetail,
                      }),
                    );
                    onPressClose();
                  }}>
                  <AppText style={styles.applyText}>Lưu</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </MainLayout>
        </>
      )}
    </SafeAreaView>
  );
};

export default React.memo(FormAddress);

const rootStyles = (theme: AppTheme, getLabel: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
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
        marginTop: label === getLabel('mainAddress') ? 20 : 0,
        top: label === getLabel('mainAddress') ? 0 : -10,
      } as ViewStyle),
    containInput: {
      paddingBottom: 24,
      justifyContent: 'center',
      marginBottom: 20,
    } as ViewStyle,
    contentStyle: (text: string, label: string) =>
      ({
        color:
          text != label ? theme.colors.text_primary : theme.colors.text_disable,
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
    containButtonBottom: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginHorizontal: 16,
    } as ViewStyle,
    containContentButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
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
  });
