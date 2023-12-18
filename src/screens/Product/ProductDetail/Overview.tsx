import React, {FC, memo} from 'react';
import {IProductOverview} from '../../../models/types';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppConstant, ScreenConstant} from '../../../const';
import {ImageAssets} from '../../../assets';
import {CommonUtils} from '../../../utils';
import {NavigationProp} from '../../../navigation';

const Overview: FC<OverviewProps> = ({overviewData}) => {
  const {t: getLabel} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const _renderImg = () => {
    return (
      <View style={{marginTop: 16}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontWeight: '500',
              color: colors.text_secondary,
              marginHorizontal: 16,
            }}>
            {getLabel('image')}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              color: colors.action,
              marginHorizontal: 16,
            }}
            onPress={() =>
              navigation.navigate(ScreenConstant.IMAGE_VIEW, {
                data: overviewData.image,
              })
            }>
            {getLabel('seeMore')}
          </Text>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View
            style={[styles.imgContainer, {backgroundColor: colors.bg_default}]}>
            <Image
              source={ImageAssets.ImgAppWatch}
              style={styles.img}
              resizeMode="cover"
            />
          </View>
          <View
            style={[styles.imgContainer, {backgroundColor: colors.bg_default}]}>
            <Image
              source={ImageAssets.ImgAppWatch}
              style={styles.img}
              resizeMode="cover"
            />
          </View>
          <View
            style={[styles.imgContainer, {backgroundColor: colors.bg_default}]}>
            <Image
              source={ImageAssets.ImgAppWatch}
              style={styles.img}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    );
  };

  const _renderInfo = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text
          style={{
            fontWeight: '500',
            color: colors.text_secondary,
            marginHorizontal: 16,
          }}>
          {getLabel('details')}
        </Text>
        <View
          style={[styles.infoContainer, {backgroundColor: colors.bg_default}]}>
          <Image
            source={ImageAssets.ImgAppWatch}
            style={{width: 90, height: 90, alignSelf: 'center'}}
            resizeMode="cover"
          />
          <View
            style={[
              styles.element,
              {borderColor: colors.border, borderTopWidth: 0},
            ]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('productName')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.name}
            </Text>
          </View>
          <View style={[styles.element, {borderColor: colors.border}]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('productCode')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.code}
            </Text>
          </View>
          <View style={[styles.element, {borderColor: colors.border}]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('unitDefault')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.unit}
            </Text>
          </View>
          <View style={[styles.element, {borderColor: colors.border}]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('standPrice')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.price
                ? CommonUtils.convertNumber(overviewData.price)
                : '---'}
            </Text>
          </View>
          <View style={[styles.element, {borderColor: colors.border}]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('trademark')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.trademark}
            </Text>
          </View>
          <View
            style={[
              styles.element,
              {borderColor: colors.border, borderBottomWidth: 0},
            ]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('industry')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.commodity_industry ?? '---'}
            </Text>
          </View>
          <View
            style={[
              styles.element,
              {borderColor: colors.border, borderBottomWidth: 0},
            ]}>
            <Text style={{color: colors.text_disable, fontSize: 16}}>
              {getLabel('describe')}
            </Text>
            <Text style={[styles.text, {color: colors.text_primary}]}>
              {overviewData.note ?? '---'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _renderFile = () => {
    return (
      <View style={{marginTop: 16}}>
        {overviewData.file?.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => console.log(item.url)}
              style={{
                backgroundColor: colors.bg_default,
                padding: 16,
                marginVertical: 4,
                marginHorizontal: 16,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Image
                source={ImageAssets.ImgFile}
                style={{width: 28, height: 28}}
                resizeMode={'cover'}
              />
              <View style={{rowGap: 5, marginLeft: 16}}>
                <Text style={{color: colors.text_primary}}>
                  {item.file_name}
                </Text>
                <Text style={{color: colors.text_secondary}}>
                  {item.size} MB
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      {_renderInfo()}
      {_renderImg()}
      {_renderFile()}
    </>
  );
};

interface OverviewProps {
  overviewData: IProductOverview;
}
export default memo(Overview);

const styles = StyleSheet.create({
  imgContainer: {
    width: AppConstant.WIDTH * 0.28,
    height: AppConstant.WIDTH * 0.28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: AppConstant.WIDTH * 0.2,
    height: AppConstant.WIDTH * 0.2,
  },
  infoContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
  },
  element: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    rowGap: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
