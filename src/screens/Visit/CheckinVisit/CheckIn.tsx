import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {
  Block,
  AppText as Text,
  AppSwitch as Switch,
  SvgIcon,
} from '../../../components/common/';
import {useRoute} from '@react-navigation/native';
import {RouterProp} from '../../../navigation';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal} from 'react-native-paper';
import ItemCheckIn from './ItemCheckIn';
import AppImage from '../../../components/common/AppImage';
import {CheckinData, DMSConfigMobile} from '../../../services/appService';
import {decimalMinutesToTime, useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import {dispatch} from '../../../utils/redux/index';
import {appActions} from '../../../redux-store/app-reducer/reducer';

const CheckIn = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('Mở cửa');
  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const params: CheckinData = useRoute<RouterProp<'CHECKIN'>>().params.item;
  const [status, setStatus] = useState(
    dataCheckIn?.checkin_trangthaicuahang
      ? dataCheckIn?.checkin_trangthaicuahang
      : params.checkin_trangthaicuahang,
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalId = useRef<any>();
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
    shallowEqual,
  );
  const timeCheckin = useRef(
    decimalMinutesToTime(systemConfig.thoigian_toithieu),
  );

  useEffect(() => {
    // Start the interval when the component mounts
    const startInterval = () => {
      intervalId.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000); // Update every second (1000 milliseconds)
    };

    startInterval();

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId.current);
  }, []); // The empty dependency array ensures that the effect runs only once

  // Format seconds into HH:mm:ss
  const formatTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number) => (num < 10 ? '0' + num : num);

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const handleSwitch = useCallback(() => {
    if (title === 'Mở cửa') {
      setTitle('Đóng cửa');
      setStatus(false);
      dispatch(appActions.setCheckInStoreStatus(false));
    } else {
      setTitle('Mở cửa');
      dispatch(appActions.setCheckInStoreStatus(true));
      setStatus(true);
    }
  }, []);
  const isCurrentTimeGreaterOrEqual = (minTime: any) => {
    const currentTime = elapsedTime;
    return currentTime >= timeToSeconds(minTime);
  };

  const timeToSeconds = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60;
    return totalSeconds;
  };

  const onCheckout = useCallback(() => {
    dispatch(appActions.onCheckIn(dataCheckIn));
    setShow(false);
  }, [dataCheckIn]);

  const isCompleteCheckin = useMemo(() => {
    const result = categoriesCheckin.find(
      item => item.isRequire == true && item.isDone == false,
    );
    return result ? false : true;
  }, [categoriesCheckin]);

  const onConfirmCheckout = useCallback(() =>{
    dispatch(appActions.onCheckIn(dataCheckIn));
    setShow(false);
  },[dataCheckIn])

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
              <SvgIcon
                source="arrowLeft"
                size={24}
                onPress={() => setShow(true)}
              />
            </Block>
            <Text fontSize={14} colorTheme="text" fontWeight="400">
              {' '}
              Viếng thăm {formatTime(elapsedTime)}
            </Text>
          </Block>
          <Switch type="text" status onSwitch={handleSwitch} title={title} />
        </Block>
        <Block colorTheme="white" paddingHorizontal={32}>
          <Block
            direction="row"
            paddingTop={20}
            // paddingLeft={32}
            marginBottom={8}>
            <SvgIcon source="UserGroup" size={20} colorTheme="main" />
            <Text fontSize={16} fontWeight="500" colorTheme="text">
              {' '}
              {params.kh_ten}
            </Text>
          </Block>
          <Block colorTheme="border" height={1} />
          <Block paddingTop={8}>
            <Block
              direction="row"
              alignItems="center"
              // marginLeft={32}
              marginRight={32}>
              <SvgIcon source="MapPin" size={16} />
              <Text numberOfLines={1}> {params.kh_diachi} </Text>
            </Block>
            <Block
              direction="row"
              alignItems="center"
              marginTop={8}
              // marginLeft={32}
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
      {isCurrentTimeGreaterOrEqual(timeCheckin.current) ? (
        <TouchableOpacity
          style={styles.containContainerButton}
          onPress={onCheckout}>
          <Block
            // borderColor="primary"
            marginLeft={16}
            borderColor={theme.colors.primary}
            marginRight={16}
            colorTheme="bg_default"
            // style={{borderColor:theme.colors.primary} as ViewStyle}
            alignItems="center"
            height={40}
            justifyContent="center"
            borderWidth={1}
            borderRadius={20}>
            <Text
              colorTheme="primary"
              fontSize={16}
              lineHeight={21}
              fontWeight="500">
              Check out
            </Text>
          </Block>
        </TouchableOpacity>
      ) : null}

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
              Bạn muốn thoát viếng thăm ?
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
                Hủy
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
    </SafeAreaView>
  );
};

export default CheckIn;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
      // marginHorizontal:16
    } as ViewStyle,
    containerStyle: {
      backgroundColor: theme.colors.white,
      // paddingTop: 20,
      marginHorizontal: 30,
      borderRadius: 16,
      // marginVertical:16
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
