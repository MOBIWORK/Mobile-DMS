import {
  AppState,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  Block,
  AppText as Text,
  AppSwitch as Switch,
  SvgIcon,
  showSnack,
} from '../../../components/common/';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthorizeParamsList, RouterProp} from '../../../navigation/screen-type';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal} from 'react-native-paper';
import ItemCheckIn from './ItemCheckIn';
import AppImage from '../../../components/common/AppImage';
import {CheckinData, DMSConfigMobile} from '../../../services/appService';
import {
  backgroundErrorListener,
  calculateDistance,
  decimalMinutesToTime,
  useDeepCompareEffect,
  useDisableBackHandler,
  useSelector,
} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {dispatch, getState} from '../../../utils/redux/index';
import {appActions} from '../../../redux-store/app-reducer/reducer';
import {checkinActions} from '../../../redux-store/checkin-reducer/reducer';
import isEqual from 'react-fast-compare';
import {goBack, navigate} from '../../../navigation/navigation-service';
import {AppService, CustomerService} from '../../../services';
import {ApiConstant, AppConstant, ScreenConstant} from '../../../const';
import {useBatteryLevel} from 'expo-battery';
// @ts-ignore
import StringFormat from 'string-format';
import {IItemCheckIn} from '../../../redux-store/checkin-reducer/type';
import {AppDialog} from '../../../components/common';
import {LocationProps} from '../VisitList/VisitItem';
import {CommonUtils} from '../../../utils';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {AppStateStatus} from 'react-native';
import moment from 'moment';
import {storage} from '../../../utils/commom.utils';
import {isLocationEnabled} from 'react-native-android-location-enabler';
// import {customerActions} from '../../../redux-store/customer-reducer/reducer';
// import {ListCustomerRoute} from '../../../models/types';
// import {useMMKVString} from 'react-native-mmkv';

const useTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isFocus = useIsFocused();
  // const storedStartTime = storage.getString('time');
  const storedElapsedTime = storage.getString('elapse');
  const storedCurTime = storage.getString('currentTime');
  const [appState, setAppState] = useState(AppState.currentState);
  const loadStoredTime = () => {
    if (storedElapsedTime && storedCurTime) {
      const currentTimeStamp = moment(new Date()).valueOf();
      //  console.log('run',totalElapsedTime,storedCurTime,currentTimeStamp,'ewq')
      const timeDiff = Number(currentTimeStamp) - Number(storedCurTime);
      if (timeDiff > 1000) {
       
        const total = timeDiff + Number(storedElapsedTime) * 1000;
        console.log(total, 'total');
        setElapsedTime(Math.ceil(Number(total / 1000)));
      } else {
        // console.log(Number(storedElapsedTime) + elapsedTime, 'stored');
        setElapsedTime(Number(storedElapsedTime) + elapsedTime);
      }
      // console.log(totalElapsedTime, 'total elap');
    }
    // else{
    //   const currentTimeStamp = moment(new Date()).valueOf();
    //   const totalElapsedTime = currentTimeStamp - Number(storedCurTime)
    //   setElapsedTime(totalElapsedTime + Number(storedElapsedTime));

    // }
  };
  // console.log(storedCurTime,storedElapsedTime,storedStartTime,'storage')

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && isFocus) {
      setAppState(nextAppState);

      loadStoredTime();
    } else if (nextAppState != 'active' && !isFocus) {
      console.log('run not focus');
      setAppState(nextAppState);

      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    } else if (!isFocus) {
      setAppState(nextAppState);
      console.log('case 1 ');
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    } else if (nextAppState === 'background') {
      setAppState(nextAppState);
      // console.log('case background ');
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    } else if (nextAppState === 'unknown') {
      console.log('case unknow ');
      setAppState(nextAppState);

      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    } else if (nextAppState === 'extension') {
      console.log('case extension ');
      setAppState(nextAppState);

      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    } else {
      setAppState(nextAppState);
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFocus) {
      console.log('run is focus effect');
      loadStoredTime();
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    } else {
      // storage.set('elapse', String(elapsedTime));
      console.log('run not focus effect');
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isFocus, appState]);

  return elapsedTime;
};

const CheckIn = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState<string>(getLabel('openDoor'));
  const navigation =
    useNavigation<NavigationProp<AuthorizeParamsList, 'CHECKIN'>>();
  const batteryLevel = useBatteryLevel();
  const isFocus = useIsFocused();
  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );

  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
    shallowEqual,
  );
  const params: CheckinData = useRoute<RouterProp<'CHECKIN'>>().params.item;
  const route = useRoute<RouterProp<'CHECKIN'>>().params.isLocation;
  const [enableGPS, setEnableGPS] = useState(false);
  const screen = useRoute<RouterProp<'CHECKIN'>>().params.screen;
  const [status, setStatus] = useState(
    dataCheckIn?.checkin_trangthaicuahang
      ? dataCheckIn.checkin_trangthaicuahang
      : params.checkin_trangthaicuahang,
  );
  const [appState, setAppState] = useState(AppState.currentState);
  const elapsedTime = useTimer();

  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  const timeCheckin = useRef(
    decimalMinutesToTime(
      systemConfig?.tgcheckin_toithieu ? systemConfig.thoigian_toithieu : 0,
    ),
  );
  const {imageToMark} = getState('checkin');
  // console.log(imageToMark,'ssss')
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

  const onSubmitErrDialog = useCallback(() => {
    switch (msgCheckOutErr.type) {
      case 'inventory':
        return navigation.navigate(ScreenConstant.CHECKIN_INVENTORY, {
          type: '',
          data: params,
        } as any);
      case 'camera':
        return navigation.navigate(ScreenConstant.TAKE_PICTURE_VISIT, {
          type: '',
          data: params,
        } as any);
      case 'note':
        return navigation.navigate(ScreenConstant.CHECKIN_NOTE_VISIT, {
          type: '',
          data: params,
        } as any);
      case 'distance':
        return setOpenDialogErr(false);
    }
  }, [msgCheckOutErr, openDialogErr]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('run active');
      setAppState(nextAppState);
    } else if (!isFocus) {
      let currentCate = {...categoriesCheckin};
      
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
      storage.set('cate', JSON.stringify(currentCate));
      setAppState(nextAppState);
      // dispatch(checkinActions.setDataCategoriesCheckin(currentCate));
    } else if (nextAppState === 'inactive') {
      console.log('run inactive');
      let currentCate = categoriesCheckin;
      // console.log('run backstate');
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
      storage.set('cate', JSON.stringify(currentCate));
      setAppState(nextAppState);
    } else if (nextAppState === 'background') {
      // console.log('run background');
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
      let currentCate = categoriesCheckin;
      console.log(elapsedTime, 'elapse');
      // console.log('run backstate');

      setAppState(nextAppState);
      storage.set('cate', JSON.stringify(currentCate));
    } else {
      console.log('run appteste', nextAppState);
      let currentCate = categoriesCheckin;
      // console.log('run backstate');
      storage.set('elapse', String(elapsedTime));
      storage.set('currentTime', String(moment(new Date()).valueOf()));
      setAppState(nextAppState);
      storage.set('cate', JSON.stringify(currentCate));
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    // Start the interval
    return () => {
      subscription.remove();
    };
  }, [appState,isFocus]);

  const checkGPS = useCallback(async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean = await isLocationEnabled();
      if (checkEnabled) {
        if (checkEnabled === true) {
          setEnableGPS(true);
          onCheckout();
        } else {
          console.log('run');
          setEnableGPS(false);
        }
        // isEnable.current = checkEnabled;
      } else {
        backgroundErrorListener(1);
      }
    } else {
      setEnableGPS(true);
      onCheckout();
    }
  }, [enableGPS, isFocus]);

  const checkGPSConfirmCheckout = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean = await isLocationEnabled();
      if (checkEnabled) {
        console.log(checkEnabled, 'response');
        if (checkEnabled === true) {
          setEnableGPS(true);
          // try {
          dispatch(appActions.setProcessingStatus(true));
          const res: any = await AppService.checkOut(
            dataCheckIn.checkin_id,
            dataCheckIn.item.name,
          );
          if (res?.status === ApiConstant.STT_OK) {
            dispatch(checkinActions.resetData());
            // dispatch
            dispatch(appActions.setDataCheckIn({}));
            console.log('run reset storage line 379');
            storage.set('time', '');
            storage.set('elapse', '');
            storage.set('currentTime', '');
            dispatch(appActions.setProcessingStatus(false));
            console.log('run back', res);
            goBack();
          }
          // } catch (e) {

          // } finally {
          // }
        } else {
          console.log('run');
          setEnableGPS(false);
        }
        // isEnable.current = checkEnabled;
      } else {
        backgroundErrorListener(1);
      }
    } else {
      setEnableGPS(true);
      // try {
      dispatch(appActions.setProcessingStatus(true));
      const res: any = await AppService.checkOut(
        dataCheckIn.checkin_id,
        dataCheckIn.item.name,
      );
      if (res?.status === ApiConstant.STT_OK) {
        dispatch(checkinActions.resetData());
        // dispatch
        dispatch(appActions.setDataCheckIn({}));
        console.log('run reset storage line 411');
        storage.set('time', '');
        storage.set('elapse', '');
        storage.set('currentTime', '');
        dispatch(appActions.setProcessingStatus(false));

        goBack();
      }
      // } catch (e) {
      // } finally {
      // dispatch(appActions.setProcessingStatus(false));
      // }
    }
  };

  // console.log(categoriesCheckin.map(item => item.isDone),'cate')

  const isValidCheckOut = useCallback(
    (currentLocation: GeolocationResponse) => {
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
    },
    [openDialogErr, msgCheckOutErr],
  );

  const onCheckout = useCallback(async () => {
    // dispatch(appActions.setProcessingStatus(true));
    CommonUtils.getCurrentLocation(
      async locations => {
        if (!isValidCheckOut(locations)) {
          dispatch(appActions.setProcessingStatus(false));

          return;
        } else {
          console.log('run here');
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
          console.log('run reset data line 552');
          storage.set('time', '');
          storage.set('elapse', '');
          storage.set('currentTime', '');
          dispatch(checkinActions.resetData());
        }
      },
      err => backgroundErrorListener(err.code),
    );
    setShow(false);
  }, [dataCheckIn, categoriesCheckin, enableGPS]);

  useDeepCompareEffect(() => {
    if (route === false) {
      navigate(ScreenConstant.CHECKIN_LOCATION, {
        type: '',
        data: params,
        screen: screen,
      });
      navigation.setParams({isLocation: true});
    } else {
      return;
    }
  }, [route]);

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
                onPress={() => {
                  setShow(true);
                  // checkGPS();
                }}>
                <SvgIcon source="arrowLeft" size={24} />
              </TouchableOpacity>
            </Block>
            <Text fontSize={14} colorTheme="text" fontWeight="400">
              {' '}
              {getLabel('visit')} {formatTime(elapsedTime)}
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
              <Text numberOfLines={1}>
                {' '}
                {params?.item?.customer_primary_address?.address_title ??
                  ''}{' '}
              </Text>
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
            categoriesCheckin.length > 0 &&
            categoriesCheckin.map((item, index) => {
              return <ItemCheckIn key={index} item={item} navData={params} />;
            })}
        </Block>
      </Block>
      <TouchableOpacity
        style={styles.containContainerButton}
        onPress={() =>
          isCurrentTimeGreaterOrEqual(timeCheckin.current)
            ? checkGPS()
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
              onPress={checkGPSConfirmCheckout}
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
