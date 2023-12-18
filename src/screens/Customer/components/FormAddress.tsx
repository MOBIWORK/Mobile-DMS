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
import {TextInput} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import {
  AppHeader,
  AppIcons,
  AppInput,
  AppText,
  SvgIcon,
  
} from '../../../components/common';
import {AppConstant} from '../../../const';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {MainLayout} from '../../../layouts';
import {apiDecodeMap} from '../../../api/apiMap';
import {RootObjectGeoDecoding} from '../../../models/types';
import debounce from 'debounce';

type Props = {
  onPressClose: () => void;
};

const FormAddress = (props: Props) => {
  const {onPressClose} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);

  const [addressValue, setAddressValue] = useState({
    city: 'Tỉnh/Thành Phố',
    district: 'Quận/ Huyện',
    ward: 'Phường/xã',
    detailAddress: 'Địa chỉ chi tiết',
    addressOrder: false,
    addressGet: false,
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

  const fetchingData = async (lat: any, lon: any) => {
    const geoData: RootObjectGeoDecoding = await apiDecodeMap(lat, lon);

    if (geoData.status === 'OK') {
      console.log('res: ', geoData.plus_code.compound_code);
      setAddressValue(prev => ({
        ...prev,
        detailAddress: geoData.plus_code.compound_code,
      }));
    }
  };

  const onGetCurrentLocation =  () => {
    Geolocation.getCurrentPosition(infor => {
     fetchingData(infor.coords.latitude, infor.coords.longitude);
    });
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
  

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'top']}>
      <View style={styles.headerContentView}>
        <AppHeader
          label="Địa chỉ chính"
          onBack={() => {}}
          backButtonIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.IonIcon}
              name="close"
              size={26}
              color={theme.colors.black}
              onPress={() => onPressClose()}
            />
          }
        />
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={onGetCurrentLocation}>
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
            contentStyle={styles.contentStyle}
            onPress={() => {}}
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
            onPress={() => {}}
            contentStyle={styles.contentStyle}
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
            contentStyle={styles.contentStyle}
            onPress={() => {}}
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
            contentStyle={styles.contentStyle}
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
                      {addressValue.addressGet || addressValue.addressOrder ? (
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
    </SafeAreaView>
  );
};

export default FormAddress;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      // backgroundColor:'blue'
      // marginHorizontal:16
    },
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
    headerContentView: {
      marginHorizontal: 16,
      //  backgroundColor: 'red',
      marginBottom: 20,
    } as ViewStyle,
    containInput: {
      paddingBottom: 16,
      justifyContent: 'center',
    } as ViewStyle,
    contentStyle: {
      color: theme.colors.text_disable,
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    } as TextStyle,
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
  });
