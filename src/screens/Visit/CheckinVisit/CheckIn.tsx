import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useCallback, useState,useEffect} from 'react';
import {
  Block,
  AppText as Text,
  AppSwitch as Switch,
  SvgIcon,
} from '../../../components/common/';
import moment from 'moment';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProp, RouterProp} from '../../../navigation';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal} from 'react-native-paper';
import {item} from './ultil';
import ItemCheckIn from './ItemCheckIn';
import AppImage from '../../../components/common/AppImage';
import {CheckinData} from '../../../services/appService';
import {useSelector} from '../../../config/function';
import {shallowEqual} from 'react-redux';
import { dispatch } from '../../../utils/redux';
import { appActions } from '../../../redux-store/app-reducer/reducer';
type Props = {};

const CheckIn = (props: Props) => {
  const {goBack} = useNavigation<NavigationProp>();
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('Mở cửa');
  const dataCheckIn: CheckinData = useSelector(
    state => state.app.dataCheckIn,
    shallowEqual,
  );

  const params: CheckinData = useRoute<RouterProp<'CHECKIN'>>().params.item;
  const [status, setStatus] = useState(
    dataCheckIn?.checkin_trangthaicuahang
      ? dataCheckIn?.checkin_trangthaicuahang
      : params.checkin_trangthaicuahang,
  );
  console.log(params,'a')

  const handleSwitch = useCallback(() => {
    if (title === 'Mở cửa') {
      setTitle('Đóng cửa');
      setStatus(false);
    } else {
      setTitle('Mở cửa');
      setStatus(true);
    }
  }, []);

  useEffect(() =>{
      if(dataCheckIn && Object.keys(dataCheckIn)?.length > 0){
        // dispatch(appActions.setDataCheckIn((prev:CheckinData) =>({...prev,checkin_trangthaicuahang:status})))
      }
  },[dataCheckIn,status])


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
              Viếng thăm {moment(new Date()).format('HH:mm')}
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
          {item.map((item, index) => {
            return <ItemCheckIn key={index} item={item} navData={params.item} />;
          })}
        </Block>
      </Block>
      <TouchableOpacity style={styles.containContainerButton}>
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
              onPress={() => {
                setShow(false);
                goBack();
              }}
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
