import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ImageAssets} from '../../../../assets';
import {Button} from 'react-native-paper';
import {ScreenConstant} from '../../../../const';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../../navigation/screen-type';

const UINoData = () => {
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();
  return (
    <View style={[styles.containerNodata]}>
      <View style={{marginTop: 70}}>
        <View style={{alignItems: 'center', rowGap: 8}}>
          <Image
            style={styles.iconImage}
            source={ImageAssets.IconBill}
            resizeMode="cover"
          />
          <Text style={[styles.textDescNoDt, {color: colors.text_disable}]}>
            {getLabel('selectProduct')}
          </Text>
        </View>
        <View style={[styles.flexSpace as any, {marginTop: 24}]}>
          <Button
            style={{
              width: '48%',
              marginRight: 16,
              borderColor: colors.action,
            }}
            textColor={colors.action}
            labelStyle={[styles.textBtt as any, {fontWeight: '500'}]}
            icon="plus"
            mode="outlined"
            onPress={() =>
              navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)
            }>
            {getLabel('selectProduct')}
          </Button>
          <Button
            style={{width: '48%', borderColor: colors.action}}
            textColor={colors.action}
            labelStyle={[styles.textBtt as any, {fontWeight: '500'}]}
            icon="barcode-scan"
            mode="outlined"
            onPress={() => console.log('Pressed')}>
            {getLabel('scanCode')}
          </Button>
        </View>
      </View>
    </View>
  );
};
export default UINoData;
const styles = StyleSheet.create({
  flexSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  textBtt: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  containerNodata: {
    height: 316,
  } as ViewStyle,
  iconImage: {
    width: 67,
    height: 75,
  } as ImageStyle,
  textDescNoDt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
});
