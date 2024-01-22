import {
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Searchbar, TextInput} from 'react-native-paper';
import debounce from 'debounce';
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
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {ImageAssets} from '../../../assets';
import {useSelector} from '../../../config/function';

type Props = {
  onPressClose: () => void;
  typeFilter: any;
};

const FormAddress = (props: Props) => {
  const {onPressClose, typeFilter} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [screen, setScreen] = useState('');
  const listAddress = useSelector(state => state.app.listDataCity);
  const [listCity, setListAddress] = useState({
    city: listAddress.city,
    ward: '',
    district: '',
  });

  const [addressValue, setAddressValue] = useState({
    city: 'Tỉnh/Thành phố',
    district: 'Quận/Huyện',
    ward: 'Phường/xã',
    detailAddress: 'Địa chỉ chi tiết',
    addressOrder: false,
    addressGet: false,
  });
  const [contactValue, setContactValue] = useState({
    nameContact: 'Người liên hệ',
    phoneNumber: 'Số điện thoại',
    addressContact: 'Địa chỉ',
    city: 'Tỉnh/Thành phố',
    district: 'Quận/Huyện',
    ward: 'Phường/xã',
    isMainAddress: addressValue.addressGet ? true : false,
  });
  const listCheckBox = useRef([
    {
      id: '1',
      label: 'Đặt làm địa chỉ giao hàng',
    },
    {
      id: '2',
      label: 'Đặt làm địa chỉ đặt hàng',
    },
  ]);

  const fetchData = async (lat: any, lon: any) => {
    const data: RootEkMapResponse = await getDetailLocation(lat, lon);
    console.log(data, 'data');
    if (data.status === 'OK') {
      setAddressValue(prev => ({
        ...prev,
        detailAddress: data.results[0].formatted_address,
      }));
    } else {
      showSnack({
        msg: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
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
          msg: 'Thành công',
          type: 'success',
          interval: 1000,
        });
      })
      .catch(err => console.log(err));
  };

  const onChange = React.useCallback(
    (text: string) => {
      console.log('text');
      setAddressValue(prev => ({
        ...prev,
        detailAddress: text,
      }));
    },
    [addressValue],
  );

  const handleItem = (item: any) => {
    const newData =
      listCity && listCity.city.filter((res: any) => res.label !== item.label);
    setListAddress(prev => ({
      ...prev,
      city: newData,
    }));
  };

  const SearchNearly = () => {
    return (
      <Block marginTop={20}>
        <AppText colorTheme="text_primary" fontWeight="500">
          Tìm kiếm gần đây
        </AppText>
        <Block marginTop={16}>
          {listCity &&
            listCity?.city.map((item: any, index: number) => {
              return (
                <Block
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  marginVertical={6}>
                  <AppText colorTheme="text_primary" style={{width: '80%'}}>
                    {item.label}
                  </AppText>
                  <SvgIcon
                    source="Close"
                    color={theme.colors.text_secondary}
                    size={24}
                    onPress={() => handleItem(item)}
                  />
                </Block>
              );
            })}
        </Block>
      </Block>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {screen === 'Adding' || screen === 'AddingContact' ? (
        <MainLayout>
          <Block
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            width={'100%'}>
            <TouchableOpacity onPress={() => console.log('run bitch')}>
              <SvgIcon size={24} source="arrowLeft" colorTheme="text_primary" />
            </TouchableOpacity>
            <Searchbar
              placeholder={'Tìm kiếm'}
              value={''}
              onChangeText={text => console.log(text)}
              onSubmitEditing={e => console.log(e.nativeEvent.text)}
              icon={ImageAssets.SearchIcon}
              placeholderTextColor={theme.colors.text_disable}
              inputStyle={{color: theme.colors.text_primary}}
              style={styles.searchBar}
            />
            <SearchNearly />
          </Block>
        </MainLayout>
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
                label={'Tỉnh/Thành phố'}
                contentStyle={styles.contentStyle(
                  addressValue.city,
                  'Tỉnh/Thành phố',
                )}
                onPress={() => {
                  setScreen('Adding');
                }}
                value={addressValue.city}
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
                label={'Quận/Huyện'}
                value={addressValue.district}
                editable={false}
                onPress={() => {
                  setScreen('Adding');
                }}
                contentStyle={styles.contentStyle(
                  addressValue.district,
                  'Quận/Huyện',
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
                label={'Phường/xã'}
                value={addressValue.ward}
                editable={false}
                contentStyle={styles.contentStyle(
                  addressValue.ward,
                  'Phường/xã',
                )}
                onPress={() => {
                  setScreen('Adding');
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
                label={'Địa chỉ'}
                value={addressValue.detailAddress}
                editable={true}
                contentStyle={styles.contentStyle(
                  addressValue.detailAddress,
                  'Địa chỉ chi tiết',
                )}
                styles={
                  addressValue.detailAddress === 'Địa chỉ chi tiết'
                    ? styles.marginInputView
                    : styles.containInput
                }
                hiddenRightIcon={true}
                onChangeValue={text => {
                  console.log(text), debounce(() => onChange(text), 100);
                }}
              />
              <View style={styles.checkBoxRootView}>
                {listCheckBox.current.map((item, index) => {
                  return (
                    <View key={item.id}>
                      <TouchableOpacity
                        onPress={() => {
                          item.id == '1'
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
                onPress={onPressClose}>
                <AppText style={styles.restartText}>Hủy</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonApply}
                onPress={() => {
                  dispatch(appActions.setMainAddress(addressValue));
                  onPressClose();
                }}>
                <AppText style={styles.applyText}>Lưu</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.headerContentView('Địa chỉ chính')}>
            <AppHeader
              label="Người liên hệ chính"
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
              label={'Người liên hệ'}
              value={contactValue.nameContact}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue.nameContact,
                'Người liên hệ',
              )}
              hiddenRightIcon={true}
              styles={styles.marginInputView}
              onChangeValue={text =>
                setContactValue(prev => ({...prev, nameContact: text}))
              }
            />
            <AppInput
              label={'Số điện thoại'}
              value={contactValue.phoneNumber}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue.phoneNumber,
                'Số điện thoại',
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
              label={'Tỉnh/Thành phố'}
              contentStyle={styles.contentStyle(
                addressValue.city,
                'Tỉnh/Thành phố',
              )}
              onPress={() => {
                setScreen('AddingContact');
              }}
              value={addressValue.city}
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
              label={'Quận/Huyện'}
              value={addressValue.district}
              editable={false}
              onPress={() => {
                setScreen('AddingContact');
              }}
              contentStyle={styles.contentStyle(
                addressValue.district,
                'Quận/Huyện',
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
              label={'Phường/xã'}
              value={addressValue.ward}
              editable={false}
              contentStyle={styles.contentStyle(addressValue.ward, 'Phường/xã')}
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
              label={'Địa chỉ chi tiết'}
              value={contactValue.addressContact}
              editable={true}
              contentStyle={styles.contentStyle(
                contactValue.addressContact,
                'Địa chỉ',
              )}
              styles={styles.marginInputView}
              onChangeValue={text =>
                setContactValue(prev => ({...prev, addressContact: text}))
              }
              hiddenRightIcon={true}
            />
            <View style={styles.containButtonBottom}>
              <View style={styles.containContentButton}>
                <TouchableOpacity
                  style={styles.buttonRestart}
                  onPress={onPressClose}>
                  <AppText style={styles.restartText}>Hủy</AppText>
                </TouchableOpacity>
                {contactValue.addressContact === 'Địa chỉ' ||
                contactValue.nameContact === 'Người liên hệ' ||
                contactValue.phoneNumber === 'Số điện thoại' ? null : (
                  <TouchableOpacity
                    style={styles.buttonApply}
                    disabled={
                      contactValue.addressContact === 'Địa chỉ' ||
                      contactValue.nameContact === 'Người liên hệ' ||
                      contactValue.phoneNumber === 'Số điện thoại'
                        ? true
                        : false
                    }
                    onPress={() => {
                      dispatch(appActions.setMainContactAddress(contactValue));
                      onPressClose();
                    }}>
                    <AppText style={styles.applyText}>Lưu</AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </MainLayout>
        </>
      )}
    </SafeAreaView>
  );
};

export default React.memo(FormAddress);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      // marginTop: 20,
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

      // backgroundColor: 'red'
    } as ViewStyle,
    buttonView: {
      // marginBottom: 20,
    } as ViewStyle,
    headerContentView: (label: string) =>
      ({
        marginHorizontal: 16,
        //  backgroundColor: 'red',
        marginBottom: 20,
        marginTop: label === 'Địa chỉ chính' ? 20 : 0,
        // paddingBottom: 10,
        top: label === 'Địa chỉ chính' ? 0 : -10,
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
        backgroundColor:
          addressGo === true ? theme.colors.primary : 'transparent',
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
        backgroundColor:
          addressOrder === true ? theme.colors.primary : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle),
    checkBoxView: {
      flexDirection: 'row',
      // backgroundColor:'red'
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
    searchBar: {
      backgroundColor: theme.colors.bg_neutral,
      borderRadius: 10,
      width: '90%',
      marginLeft: 12,
    } as ViewStyle,
  });
