import {
  StyleSheet,
  View,
  Platform,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {Address} from '../../../models/types';
import {AppText, Block, SvgIcon} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import isEqual from 'react-fast-compare';
import {ApiConstant, ScreenConstant} from '../../../const';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {AppService} from '../../../services';
import {ListDistrict, ListWard} from '../../../redux-store/app-reducer/type';

type SingleAddress = {
  type: 'single';
  data: string;
  onPressCard: (data: any, type: string, screen: any) => void;
};
type ListAddress = {
  data: Address;
  type: 'list';
  primary_address: string;
  onPressCard: (data: any, type: string, screen: any) => void;
};
type Props = SingleAddress | ListAddress;

const CardAddressView = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const listDataCity = useSelector(
    state => state.app.listDataCity,
    shallowEqual,
  );
  const [valueCity, setValue] = React.useState({
    city: {
      id: '',
      value: '',
    },
    ward: {
      id: '',
      value: '',
    },
    district: {
      id: '',
      value: '',
    },
  });
  // console.log(props.data,'rpops data')

  const autoCompleteData = React.useCallback(async () => {
    if (props.type === 'list')
      if (listDataCity.city.length > 0) {
        let add: Address = props.data;
        // console.log(add, 'editValue');
        if (add.city != null) {
          let value = listDataCity.city.find(item => item.ma_tinh === add.city);
          // console.log(value, 'value');
          setValue((prev: any) => ({
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
            setValue((prev: any) => ({
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
              setValue((prev: any) => ({
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
  }, [props.type]);

  React.useEffect(() => {
    autoCompleteData();
  }, [props.type]);

  return props.type === 'list' ? (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        props.onPressCard(
          props.data,
          'editAddress',
          ScreenConstant.DETAIL_CUSTOMER,
        )
      }>
      <Block>
        <Block style={styles.rootLayout}>
          <Block
            style={styles.labelView}
            justifyContent="center"
            alignItems="center">
            <SvgIcon
              source="MapPin"
              size={18}
              color={theme.colors.text_primary}
            />
            <AppText
              numberOfLines={1}
              style={{maxWidth: '90%', marginLeft: 8}}
              fontSize={14}
              fontWeight="500"
              colorTheme="text_primary">
              {props.data?.address_title ? props.data?.address_title : '---'}
            </AppText>
          </Block>
          <Block style={styles.labelView} marginLeft={28}>
            <AppText
              numberOfLines={1}
              fontSize={14}
              fontWeight="500"
              colorTheme="text_primary">
              {valueCity.city.value +
                ', ' +
                valueCity.ward.value +
                ', ' +
                valueCity.district.value}
            </AppText>
          </Block>
        </Block>
        {props.data.primary != null && props.data.primary === 1 && (
          <Block style={styles.containAddress}>
            <View style={styles.mainContact}>
              <AppText fontSize={14} fontWeight="400" colorTheme="primary">
                {getLabel('mainAddress')}
              </AppText>
            </View>
          </Block>
        )}
        {props.data.is_primary_address != null &&
          props.data.is_primary_address === 1 && (
            <Block style={styles.containAddress}>
              <View style={styles.mainContact}>
                <AppText fontSize={14} fontWeight="400" colorTheme="primary">
                  {getLabel('addressOrder')}
                </AppText>
              </View>
            </Block>
          )}
      </Block>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        props.onPressCard(
          props.data,
          'editAddress',
          ScreenConstant.DETAIL_CUSTOMER,
        )
      }>
      <Block marginTop={10}>
        <Block style={styles.rootLayout}>
          <Block style={styles.labelView}>
            <SvgIcon
              source="MapPin"
              size={18}
              colorTheme="text_primary"
              color={theme.colors.text_primary}
            />
            <AppText numberOfLines={1} style={{maxWidth: '90%'}}>
              {props.data ? props.data.split(',', 4)[0] : '---'}
            </AppText>
          </Block>
          <Block style={styles.labelView} paddingLeft={8}>
            <AppText numberOfLines={2}>
              {props?.data ? props.data : '---'}
            </AppText>
          </Block>
        </Block>
        <Block direction="row" alignItems="center" marginBottom={8}>
          <Block style={styles.containAddress}>
            <Block style={styles.mainContact}>
              <AppText fontSize={14} fontWeight="400" colorTheme="primary">
                {getLabel('addressGet')}
              </AppText>
            </Block>
          </Block>

          <Block style={styles.containAddress}>
            <Block style={styles.mainContact}>
              <AppText fontSize={14} fontWeight="400" colorTheme="primary">
                {getLabel('addressOrder')}
              </AppText>
            </Block>
          </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

export default React.memo(CardAddressView, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg_default,
      shadowColor: theme.colors.text_disable,
      borderRadius: 16,
      // borderWidth: 0.1,
      paddingVertical: 12,
      marginVertical: 8,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.23,
          elevation: 2,
        },
        android: {
          elevation: 4,
          shadowRadius: 6.4,
        },
      }),
    } as ViewStyle,
    labelText: {
      paddingLeft: 8,
    } as TextStyle,
    labelView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 8,
      marginHorizontal: 10,
    } as ViewStyle,
    mainContact: {
      marginRight: 8,
      backgroundColor: theme.colors.bg_default,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      paddingVertical: 3,
    } as ViewStyle,
    rootLayout: {
      marginHorizontal: 8,
    } as ViewStyle,
    containAddress: {
      flexDirection: 'row',
      marginLeft: 16,
      alignContent: 'center',
      marginTop: 10,
    } as ViewStyle,
  });
