import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useState} from 'react';
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
import {VisitListItemType} from '../../../models/types';
import { Modal} from 'react-native-paper';
import {item} from './ultil';
import ItemCheckIn from './ItemCheckIn';
import AppImage from '../../../components/common/AppImage';

type Props = {};

const CheckIn = (props: Props) => {
  const {goBack} = useNavigation<NavigationProp>();
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('Đóng cửa');
  const params: VisitListItemType =
    useRoute<RouterProp<'CHECKIN'>>().params.item;

 


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
          <Switch
          type='text'
            onSwitch={() => {
              title === 'Mở cửa' ? setTitle('Đóng cửa') : setTitle('Mở cửa');
            }}
            title={title}
          />
        </Block>
        <Block colorTheme="white">
          <Block
            direction="row"
            paddingTop={20}
            paddingLeft={32}
            marginBottom={8}>
            <SvgIcon source="UserGroup" size={20} colorTheme="main" />
            <Text fontSize={16} fontWeight="500" colorTheme="text">
              {' '}
              {params.useName}
            </Text>
          </Block>
         <Block  colorTheme='border'   height={1}  />
          <Block paddingTop={8}>
            <Block
              direction="row"
              alignItems="center"
              marginLeft={32}
              marginRight={32}>
              <SvgIcon source="MapPin" size={16} />
              <Text numberOfLines={1}> {params.address} </Text>
            </Block>
            <Block
              direction="row"
              alignItems="center"
              marginTop={8}
              marginLeft={32}
              marginRight={32}
              paddingBottom={20}>
              <SvgIcon source="Phone" size={16} />
              <Text numberOfLines={1}> {params.phone_number} </Text>
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
            return <ItemCheckIn key={index} item={item} />;
          })}
        </Block>
      </Block>
      <TouchableOpacity style={styles.containContainerButton}>
        <Block
          // borderColor="primary"
          marginLeft={16}
          borderColor={theme.colors.primary}
          marginRight={16}
          colorTheme='bg_default'
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
          <Block marginTop={8} direction="row" alignItems="center">
            <TouchableOpacity
            onPress={() => setShow(false)}
              style={styles.containButton('cancel')}>
              <Text fontSize={14} colorTheme='text_secondary' fontWeight='500'  >Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() =>{
              setShow(false)
              goBack()
            }}
              style={styles.containButton('exit')}>
              <Text fontSize={14} colorTheme='white'  fontWeight='700'   >Thoát</Text>
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
    } as ViewStyle,
    containButton: (title: string) => ({
      backgroundColor: title === 'exit'  ? theme.colors.primary : theme.colors.bg_neutral,
      flex: 1,
      marginHorizontal: 6,
      marginVertical:8,
      justifyContent:'center',
      alignItems:'center',
      padding:8,
      borderRadius:20
      
    }) as ViewStyle,
    containContainerButton:{
      marginBottom:20,
      backgroundColor:theme.colors.bg_neutral
    } as ViewStyle
  });
