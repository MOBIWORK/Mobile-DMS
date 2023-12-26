import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
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
import {Divider} from 'react-native-paper';
import {item} from './ultil';
import ItemCheckIn from './ItemCheckIn';
type Props = {};

const CheckIn = (props: Props) => {
  const {goBack} = useNavigation<NavigationProp>();
  const theme = useTheme();
  const styles = rootStyles(theme);
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
              <SvgIcon source="arrowLeft" size={24} onPress={() => goBack()} />
            </Block>
            <Text fontSize={14} colorTheme="text" fontWeight="400">
              {' '}
              Viếng thăm {moment(new Date()).format('HH:mm')}
            </Text>
          </Block>
          <Switch onSwitch={() => {}} title="Mở cửa" />
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
          <Divider horizontalInset />
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
      <TouchableOpacity>
        <Block
          // borderColor="primary"
          marginLeft={16}
          borderColor={theme.colors.primary}
          marginRight={16}
          // style={{borderColor:theme.colors.primary} as ViewStyle}
          alignItems="center"
          height={40}
          justifyContent="center"
          borderWidth={1}
          borderRadius={20}>
          <Text colorTheme="primary"  fontSize={16} lineHeight={21}  fontWeight='500'  >Check out</Text>
        </Block>
      </TouchableOpacity>
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
  });
