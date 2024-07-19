import React, {FC, useMemo, useTransition} from 'react';
import {VisitListItemType} from '../../../models/types';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../assets';
import {AppButton, Block, AppText as Text} from '../../../components/common';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {backgroundErrorListener, useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';

import isEquals from 'react-fast-compare';
import {DMSConfigMobile} from '../../../services/appService';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import {CommonUtils} from '../../../utils';
import {dispatch} from '../../../utils/redux';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {navigate} from '../../../navigation/navigation-service';
import {ScreenConstant} from '../../../const';

export interface LocationProps {
  long: number;
  lat: number;
}

const VisitItem: FC<VisitItemProps> = ({
  item,
  handleOpenMap,
  handleClose,
  handlePressDetail,
  handlePressing,
}) => {
  const {colors} = useTheme();
  const styles = createStyleSheet(useTheme());
  const theme = useTheme();
  const {t: getLabel} = useTranslation();
  // const batteryLevel = useBatteryLevel();
  const [_, startTransition] = useTransition();

  const isEnable = React.useRef<boolean>(false);

  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );

  // console.log(item.customer_location_primary,"????")

  // const distanceCal = useMemo(() => {
  //   let location: LocationProps = JSON.parse(
  //     item.customer_location_primary != null && item.customer_location_primary,
  //   );
  //   let distance: any;
  //   if (Object.keys(currentLocation).length > 0 && location) {
  //     distance = calculateDistance(
  //       currentLocation?.coords?.latitude,
  //       currentLocation?.coords?.longitude,
  //       location?.lat,
  //       location?.long,
  //     );
  //   } else {
  //     distance = NaN;
  //   }
  //   return {location, distance};
  // }, [item.customer_location_primary, currentLocation, isEnable.current]);

  const statusItem = React.useCallback(
    (status: boolean) => {
      return (
        <Block
          padding={8}
          borderRadius={8}
          color={
            status ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 171, 0, 0.08)'
          }>
          <Text style={{color: status ? colors.success : colors.warning}}>
            {status ? getLabel('visited') : getLabel('notVisited')}
          </Text>
        </Block>
      );
    },
    [item],
  );
  React.useEffect(() => {
    const check = async () => {
      if (!isEnable.current) {
        if (Platform.OS === 'android') {
          const checkEnabled: boolean = await isLocationEnabled();
          isEnable.current = checkEnabled;
          if (checkEnabled === true) {
            isEnable.current = checkEnabled;
            // setModalErrorGPS(false);
          } else {
            isEnable.current = checkEnabled;

            // setModalErrorGPS(true);
          }
        }
      } else {
        CommonUtils.getCurrentLocation(
          locations => {
            dispatch(appActions.onSetCurrentLocation(locations));
          },
          err => backgroundErrorListener(err.code),
        );
      }
    };
    check();
  }, [isEnable.current]);
  return (
    <TouchableOpacity
      onPress={
        () =>
          navigate(ScreenConstant.VISIT_DETAIL, {
            data: item,
          })
        // startTransition(() => {
        //   handlePressDetail(item);
        // })
      }>
      <Block style={styles.viewContainer}>
        <Block style={styles.user}>
          <Block style={styles.userLeft}>
            <Image
              source={ImageAssets.UserGroupIcon}
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={item.is_checkin ? colors.success : colors.warning}
            />
            <Text style={styles.userTextLeft}>{item.customer_name}</Text>
          </Block>
          {statusItem(item.is_checkin)}
        </Block>
        <Block style={styles.content}>
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
            {item?.customer_primary_address?.address_title ?? '---'}
          </Text>
        </Block>
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
        <Block
          marginTop={8}
          justifyContent="space-between"
          style={[styles.content]}>
          {!item.is_route && systemConfig.vt_ngoaituyen === 0 ? (
            <Block />
          ) : (
            <AppButton
              onPress={() =>
                startTransition(() => {
                  handlePressing(item, false);
                })
              }
              style={createStyleSheet(theme).button(
                !item.is_route && systemConfig.vt_ngoaituyen === 0,
              )}
              label={'Checkin'}
              styleLabel={{
                color: colors.action,
                fontWeight: '400',
              }}
            />
          )}

          <TouchableOpacity
            onPress={() =>
              typeof handleOpenMap === 'function' && handleOpenMap(item)
            }
            style={styles.content}>
            <Image
              source={ImageAssets.SendIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
              tintColor={item?.distance ? colors.action : colors.text_secondary}
            />
            <Text
              color={item?.distance ? colors.action : colors.text_secondary}
              style={{
                textDecorationLine: item?.distance ? 'underline' : 'none',
              }}>
              {item?.distance
                ? `${parseFloat(String(item.distance / 1000)).toFixed(2)}km`
                : getLabel('unknown')}
            </Text>
          </TouchableOpacity>
        </Block>
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
      </Block>
    </TouchableOpacity>
  );
};
interface VisitItemProps {
  item: VisitListItemType;
  handleOpenMap?: (item: VisitListItemType) => void;
  handleClose?: () => void;
  onPress?: () => void;
  handlePressDetail: (item: VisitListItemType) => void;
  handlePressing: (item: VisitListItemType, isDetail: boolean) => void;
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
      // justifyContent: 'flex-start',
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
