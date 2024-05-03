import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  Block,
  AppText as Text,
  AppSwitch as Switch,
  SvgIcon,
  showSnack,
} from '../../../components/common/';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RouterProp} from '../../../navigation/screen-type';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal} from 'react-native-paper';
import ItemCheckIn from './ItemCheckIn';
import AppImage from '../../../components/common/AppImage';
import {CheckinData, DMSConfigMobile} from '../../../services/appService';
import {
  calculateDistance,
  decimalMinutesToTime,
  useDisableBackHandler,
  useSelector,
} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {dispatch} from '../../../utils/redux/index';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import isEqual from 'react-fast-compare';
import {goBack} from '../../../navigation/navigation-service';
import {AppService} from '../../../services';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import {useBatteryLevel} from 'expo-battery';
// @ts-ignore
import StringFormat from 'string-format';
import {IItemCheckIn} from '../../../redux-store/checkin-reducer/type';
import {AppDialog} from '../../../components/common';
import {LocationProps} from '../VisitList/VisitItem';
import {CommonUtils} from '../../../utils';
import {GeolocationResponse} from '@react-native-community/geolocation';

const useTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef<any>(0);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalIdRef.current);
  }, []);

  return elapsedTime;
};

const CheckIn = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState<string>(getLabel('openDoor'));
  const navigation = useNavigation<any>();
  const batteryLevel = useBatteryLevel();

  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
    shallowEqual,
  );
  const params: CheckinData = useRoute<RouterProp<'CHECKIN'>>().params.item;
  const [status, setStatus] = useState(
    dataCheckIn?.checkin_trangthaicuahang
      ? dataCheckIn.checkin_trangthaicuahang
      : params.checkin_trangthaicuahang,
  );

  const elapsedTime = useTimer();

  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  const timeCheckin = useRef(
    decimalMinutesToTime(systemConfig.thoigian_toithieu - 2),
  );
  useDisableBackHandler(true);

  const [msgCheckOutErr, setMsgCheckOutErr] = useState<{
    type: string;
    msg: string;
    title?: string;
  }>({
    type: '',
    msg: '',
  });
  const [openDialogErr, setOpenDialogErr] = useState<boolean>(false);

  // Format seconds into HH:mm:ss
  const formatTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number) => (num < 10 ? '0' + num : num);

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const handleSwitch = useCallback(() => {
    if (title === getLabel('openDoor')) {
      setTitle(getLabel('closeDoor'));
      setStatus(false);
      dispatch(appActions.setCheckInStoreStatus(false));
    } else {
      setTitle(getLabel('openDoor'));
      setStatus(true);
      dispatch(appActions.setCheckInStoreStatus(true));
    }
  }, [status]);
  const isCurrentTimeGreaterOrEqual = (minTime: any) => {
    const currentTime = elapsedTime;
    return currentTime >= timeToSeconds(minTime);
  };

  const timeToSeconds = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60;
    return totalSeconds;
  };

  const onSubmitErrDialog = () => {
    switch (msgCheckOutErr.type) {
      case 'inventory':
        return navigation.navigate(ScreenConstant.CHECKIN_INVENTORY, {
          type: '',
          data: params,
        });
      case 'camera':
        return navigation.navigate(ScreenConstant.TAKE_PICTURE_VISIT, {
          type: '',
          data: params,
        });
      case 'note':
        return navigation.navigate(ScreenConstant.CHECKIN_NOTE_VISIT, {
          type: '',
          data: params,
        });
      case 'distance':
        return setOpenDialogErr(false);
    }
  };

  const isValidCheckOut = (currentLocation: GeolocationResponse) => {
    function isCamera(categoriesItem: IItemCheckIn) {
      return categoriesItem.key === 'camera';
    }
    function isInventory(categoriesItem: IItemCheckIn) {
      return categoriesItem.key === 'inventory';
    }
    function isNote(categoriesItem: IItemCheckIn) {
      return categoriesItem.key === 'note';
    }

    if (
      systemConfig.batbuoc_kiemton &&
      !categoriesCheckin.find(isInventory).isDone
    ) {
      setMsgCheckOutErr({
        type: 'inventory',
        msg: getLabel('inventoryNotComplete'),
      });
      setOpenDialogErr(true);
      return false;
    } else if (
      systemConfig.batbuoc_chupanh &&
      !categoriesCheckin.find(isCamera).isDone
    ) {
      setMsgCheckOutErr({
        type: 'camera',
        msg: getLabel('cameraNotComplete'),
      });
      setOpenDialogErr(true);
      return false;
    } else if (
      systemConfig.batbuoc_ghichu &&
      !categoriesCheckin.find(isNote).isDone
    ) {
      setMsgCheckOutErr({
        type: 'note',
        msg: getLabel('noteNotComplete'),
      });
      setOpenDialogErr(true);
      return false;
    } else if (!systemConfig.checkout_ngoaisaiso) {
      let location: LocationProps = JSON.parse(
        params.item.customer_location_primary,
      );
      let distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        location?.lat,
        location?.long,
      );
      if (distance * 1000 > AppConstant.additional_distance) {
        setMsgCheckOutErr({
          type: 'distance',
          title: getLabel('errDistance'),
          msg: getLabel('mgsDistanceErr'),
        });
        setOpenDialogErr(true);
        return false;
      } else {
        return true;
      }
    } else if (
      systemConfig.checkout_ngoaisaiso &&
      systemConfig.saiso_chophep_checkout_ngoaisaiso > 0
    ) {
      console.log('2222');
      let location: LocationProps = JSON.parse(
        params.item.customer_location_primary,
      );
      let distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        location?.lat,
        location?.long,
      );
      if (
        distance * 1000 >
        systemConfig.saiso_chophep_checkout_ngoaisaiso +
          AppConstant.additional_distance
      ) {
        setMsgCheckOutErr({
          type: 'distance',
          title: getLabel('errDistance'),
          msg: getLabel('mgsDistanceErr'),
        });
        setOpenDialogErr(true);
        return false;
      } else {
        return true;
      }
    } else {
      setMsgCheckOutErr({
        type: '',
        msg: '',
      });
      setOpenDialogErr(false);
    }
    return true;
  };

  const onCheckout = useCallback(async () => {
    CommonUtils.getCurrentLocation(locations => {
      if (!isValidCheckOut(locations)) {
        return;
      } else {
        try {
          dispatch(
            appActions.onCheckIn({
              ...dataCheckIn,
              checkin_trangthaicuahang: status,
              checkin_pinra:
                batteryLevel > 0
                  ? Math.round(batteryLevel * 10000) / 100
                  : -Math.round(batteryLevel * 10000) / 100,
              checkin_giora: new Date().getTime() / 1000,
            }),
          );
        } catch (e) {
          console.log('err', e);
        } finally {
          dispatch(checkinActions.resetData());
          dispatch(appActions.setDataCheckIn({}));
        }
      }
    });
    setShow(false);
  }, [dataCheckIn, categoriesCheckin]);

  const onConfirmCheckout = useCallback(async () => {
    setShow(false);
    const res: any = await AppService.checkOut(dataCheckIn.checkin_id);
    if (res?.status === ApiConstant.STT_OK) {
      dispatch(checkinActions.resetData());
      dispatch(appActions.setDataCheckIn({}));
      goBack();
    }
  }, [dataCheckIn]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Block block colorTheme="bg_neutral">
        <Block
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          colorTheme="white"
          paddingRight={16}>
          <Block
            direction="row"
            alignItems="center"
            marginLeft={16}
            marginRight={16}>
            <Block>
              <TouchableOpacity
                style={{padding: 8}}
                onPress={() => setShow(true)}>
                <SvgIcon source="arrowLeft" size={24} />
              </TouchableOpacity>
            </Block>
            <Text fontSize={14} colorTheme="text" fontWeight="400">
              {' '}
              Viếng thăm {formatTime(elapsedTime)}
            </Text>
          </Block>
          <Switch
            type="text"
            status={status!}
            onSwitch={handleSwitch}
            title={title}
          />
        </Block>
        <Block colorTheme="white" paddingHorizontal={32}>
          <Block direction="row" paddingTop={20} marginBottom={8}>
            <SvgIcon source="UserGroup" size={20} colorTheme="main" />
            <Text fontSize={16} fontWeight="500" colorTheme="text">
              {' '}
              {params.kh_ten}
            </Text>
          </Block>
          <Block colorTheme="border" height={1} />
          <Block paddingTop={8}>
            <Block direction="row" alignItems="center" marginRight={32}>
              <SvgIcon source="MapPin" size={16} />
              <Text numberOfLines={1}> {params.kh_diachi} </Text>
            </Block>
            <Block
              direction="row"
              alignItems="center"
              marginTop={8}
              marginRight={32}
              paddingBottom={20}>
              <SvgIcon source="Phone" size={16} />
              <Text numberOfLines={1}>
                {' '}
                {params?.item?.mobile_no === null
                  ? '---'
                  : params?.item?.mobile_no}{' '}
              </Text>
            </Block>
          </Block>
        </Block>
        <Block
          marginTop={34}
          paddingHorizontal={16}
          marginLeft={16}
          marginRight={16}
          colorTheme="white"
          borderRadius={16}>
          {categoriesCheckin &&
            categoriesCheckin.map((item, index) => {
              return <ItemCheckIn key={index} item={item} navData={params} />;
            })}
        </Block>
      </Block>
      <TouchableOpacity
        style={styles.containContainerButton}
        onPress={() =>
          isCurrentTimeGreaterOrEqual(timeCheckin.current)
            ? onCheckout()
            : showSnack({
                msg: StringFormat(getLabel('checkOutTimeErr'), {
                  time: systemConfig.thoigian_toithieu,
                }),
                type: 'warn',
                interval: 2000,
              })
        }>
        <Block
          marginLeft={16}
          borderColor={
            isCurrentTimeGreaterOrEqual(timeCheckin.current)
              ? theme.colors.primary
              : theme.colors.bg_disable
          }
          marginRight={16}
          colorTheme="bg_default"
          alignItems="center"
          height={40}
          justifyContent="center"
          borderWidth={1}
          borderRadius={20}>
          <Text
            colorTheme={
              isCurrentTimeGreaterOrEqual(timeCheckin.current)
                ? 'primary'
                : 'text_disable'
            }
            fontSize={16}
            lineHeight={21}
            fontWeight="500">
            Check out
          </Text>
        </Block>
      </TouchableOpacity>
      <Modal
        visible={show}
        onDismiss={() => setShow(false)}
        contentContainerStyle={styles.containerStyle}>
        <Block
          colorTheme="white"
          justifyContent="center"
          alignItems="center"
          borderRadius={16}>
          <AppImage source="ErrorApiIcon" size={40} />
          <Block marginTop={8} justifyContent="center" alignItems="center">
            <Text fontSize={16} fontWeight="500" colorTheme="text">
              {getLabel('outVisitMsg')}
            </Text>
          </Block>
          <Block
            marginTop={8}
            direction="row"
            alignItems="center"
            paddingHorizontal={16}
            paddingVertical={16}>
            <TouchableOpacity
              onPress={() => setShow(false)}
              style={styles.containButton('cancel')}>
              <Text fontSize={14} colorTheme="text_secondary" fontWeight="500">
                {getLabel('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirmCheckout}
              style={styles.containButton('exit')}>
              <Text fontSize={14} colorTheme="white" fontWeight="700">
                Thoát
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Modal>
      <AppDialog
        open={openDialogErr}
        errorType
        modalType={{width: '90%'}}
        title={msgCheckOutErr?.title}
        message={msgCheckOutErr.msg}
        showButton
        viewOnly={msgCheckOutErr.type === 'distance'}
        closeLabel={msgCheckOutErr.type !== 'distance' ? 'Hủy' : undefined}
        onClose={() => setOpenDialogErr(false)}
        submitLabel={'Thực hiện'}
        onSubmit={() => {
          setOpenDialogErr(false);
          onSubmitErrDialog();
        }}
      />
    </SafeAreaView>
  );
};

export default React.memo(CheckIn, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    containerStyle: {
      backgroundColor: theme.colors.white,
      marginHorizontal: 30,
      borderRadius: 16,
    } as ViewStyle,
    containButton: (title: string) =>
      ({
        backgroundColor:
          title === 'exit' ? theme.colors.primary : theme.colors.bg_neutral,
        flex: 1,
        marginHorizontal: 6,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
      } as ViewStyle),
    containContainerButton: {
      marginBottom: 20,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
  });
