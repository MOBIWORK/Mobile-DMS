import React, {FC, useMemo} from 'react';
import {VisitListItemType} from '../../../models/types';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {AppButton} from '../../../components/common';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {navigate} from '../../../navigation';
import {ScreenConstant} from '../../../const';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorFallback from '../../../layouts/ErrorBoundary';
import {
  backgroundErrorListener,
  calculateDistance,
  generateRandomObjectId,
  useSelector,
} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {dispatch} from '../../../utils/redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {CheckinData, DMSConfigMobile} from '../../../services/appService';
import moment from 'moment';
import BackgroundGeolocation from 'react-native-background-geolocation';
import isEquals from 'react-fast-compare';

export interface LocationProps {
  long: number;
  lat: number;
}

const VisitItem: FC<VisitItemProps> = ({
  item,
  handleOpenMap,
  handleClose,
  onPress,
}) => {
  const {colors} = useTheme();
  const styles = createStyleSheet(useTheme());
  const theme = useTheme();
  const {t: getLabel} = useTranslation();
  const currentCustomerCheckin = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );
  const currentLocation = useSelector(
    state => state.app.currentLocation,
    shallowEqual,
  );
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
  );

  const distanceCal = useMemo(() => {
    let location: LocationProps = JSON.parse(item.customer_location_primary!);
    let distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      location?.lat,
      location?.long,
    );
    return {location, distance};
  }, [item, currentLocation]);

  const onPressCheckIn = (item: VisitListItemType) => {
    handleBackground(item);
  };

  const handleBackground = async (item: VisitListItemType) => {
    await BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 30})
      .then(location => {
        let data: CheckinData = {
          checkin_id:
            currentCustomerCheckin &&
            currentCustomerCheckin.kh_ma === item.customer_code
              ? currentCustomerCheckin.checkin_id
              : generateRandomObjectId(),
          kh_ma: item.customer_code,
          kh_ten: item.customer_name,
          kh_diachi: item.customer_primary_address,
          kh_long: distanceCal?.location?.long ?? '',
          kh_lat: distanceCal?.location?.lat ?? '',
          checkin_giovao: moment(new Date()).format('HH:mm'),
          checkin_pinvao:
            location.battery.level > 0
              ? location.battery.level * 100
              : -location.battery.level * 100,
          checkin_khoangcach: distanceCal.distance,
          createdDate: moment(new Date()).valueOf(),
          checkin_timegps: location.timestamp,
          checkin_dochinhxac: location.coords.accuracy,
          checkinvalidate_khoangcachcheckin:
            systemConfig.saiso_chophep_kb_vitringoaisaiso,
          checkinvalidate_khoangcachcheckout:
            systemConfig.saiso_chophep_checkout_ngoaisaiso,
          checkin_trangthaicuahang: true,
          checkin_donhang: '',
          checkin_giora: '',
          checkin_hinhanh: [],
          checkin_lat: location.coords.latitude,
          checkin_long: location.coords.longitude,
          checkin_pinra: 0,
          checkout_khoangcach: 0,
          createByName: '',
          createdByEmail: '',
          item: item,
        };
        navigate(ScreenConstant.CHECKIN, {item: data});
        dispatch(appActions.setDataCheckIn(data));
      })
      .catch(err => {
        console.log(err, 'err');
        backgroundErrorListener(err);
      });
  };

  const statusItem = (status: boolean) => {
    return (
      <View
        style={{
          padding: 8,
          borderRadius: 10,
          backgroundColor: status
            ? 'rgba(34, 197, 94, 0.08)'
            : 'rgba(255, 171, 0, 0.08)',
        }}>
        <Text style={{color: status ? colors.success : colors.warning}}>
          {status ? getLabel('visited') : getLabel('notVisited')}
        </Text>
      </View>
    );
  };

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <Pressable
        onPress={() => {
          navigate(ScreenConstant.VISIT_DETAIL, {data: item}), onPress!();
        }}>
        <View style={styles.viewContainer}>
          <View style={styles.user}>
            <View style={styles.userLeft}>
              <Image
                source={ImageAssets.UserGroupIcon}
                style={{width: 24, height: 24}}
                resizeMode={'cover'}
                tintColor={item.is_checkin ? colors.success : colors.warning}
              />
              <Text style={styles.userTextLeft}>{item.customer_name}</Text>
            </View>
            {statusItem(item.is_checkin)}
          </View>
          <View style={styles.content}>
            <Image
              source={ImageAssets.MapPinIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
              tintColor={colors.text_primary}
            />
            <Text
              style={{color: colors.text_primary, marginHorizontal: 8}}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {item.customer_primary_address}
            </Text>
          </View>
          <View style={styles.content}>
            <Image
              source={ImageAssets.PhoneIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
              tintColor={colors.text_primary}
            />
            <Text style={{color: colors.text_primary, marginHorizontal: 8}}>
              {item.mobile_no ?? '---'}
            </Text>
          </View>
          <View
            style={[
              styles.content,
              {marginTop: 8, justifyContent: 'space-between'},
            ]}>
            <AppButton
              onPress={() => onPressCheckIn(item)}
              disabled={item.is_checkin}
              style={createStyleSheet(theme).button(item.is_checkin)}
              label={'Checkin'}
              styleLabel={{
                color: !item.is_checkin ? colors.action : colors.text_disable,
                fontWeight: '400',
              }}
            />
            <TouchableOpacity
              onPress={() => handleOpenMap && handleOpenMap(item)}
              style={styles.content}>
              <Image
                source={ImageAssets.SendIcon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
                tintColor={colors.action}
              />
              <Text
                style={{color: colors.action, textDecorationLine: 'underline'}}>
                {Math.floor(distanceCal.distance)}km
              </Text>
            </TouchableOpacity>
          </View>
          {handleClose && (
            <TouchableOpacity
              onPress={handleClose}
              style={{position: 'absolute', top: -12, right: -12}}>
              <Image
                source={ImageAssets.CloseFameIcon}
                style={{width: 32, height: 32}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </ErrorBoundary>
  );
};
interface VisitItemProps {
  item: VisitListItemType;
  handleOpenMap?: (item: VisitListItemType) => void;
  handleClose?: () => void;
  onPress?: () => void;
}

export default React.memo(VisitItem, isEquals);

const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    viewContainer: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      rowGap: 8,
    } as ViewStyle,
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
      paddingBottom: 16,
    } as ViewStyle,
    userLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    userTextLeft: {
      color: theme.colors.text_primary,
      fontWeight: '500',
      fontSize: 16,
      marginLeft: 8,
    } as ViewStyle,
    content: {
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    } as ViewStyle,
    button: (itemStatus: boolean) =>
      ({
        backgroundColor: itemStatus
          ? theme.colors.bg_neutral
          : theme.colors.bg_default,
        borderColor: !itemStatus ? theme.colors.action : undefined,
        borderWidth: !itemStatus ? 1 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      } as ViewStyle),
  });
