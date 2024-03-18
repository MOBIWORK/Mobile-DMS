import React, { FC, memo, useEffect, useState } from 'react';
import { IProduct } from '../../../models/types';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppConstant, ScreenConstant } from '../../../const';
import { CommonUtils } from '../../../utils';
import { NavigationProp } from '../../../navigation/screen-type';
import RenderHtml from 'react-native-render-html';

const Overview: FC<OverviewProps> = ({ overviewData }) => {
  const { t: getLabel } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [price,setPrice] = useState<number>(0);

  const _renderImg = () => {
    if(overviewData.custom_images_item.length >0){

    return (
      <View style={{ marginTop: 16  , marginBottom : 20 ,paddingHorizontal :16}}>
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
                data: overviewData.custom_images_item,
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
            columnGap:4
          }}>
            {overviewData.custom_images_item.map((item,i)=>(
              <View key={i} style={[styles.imgContainer as any, { backgroundColor: colors.bg_default }]}>
                  <Image source={{  uri : item.link_image }} style={styles.img} resizeMode="cover" />
              </View>
            ))}

        </View>
      </View>
    );
    }
    return <></>
    

  };

  const _renderInfo = () => {
    return (
      <View style={{ marginTop: 16 }}>
        <Text
          style={{
            fontWeight: '500',
            color: colors.text_secondary,
            marginHorizontal: 16,
          }}>
          {getLabel('details')}
        </Text>
        <View
          style={[styles.infoContainer, { backgroundColor: colors.bg_default }]}>
          <Image
            source={{
              uri : overviewData.image
            }}
            style={{ width: 90, height: 90, alignSelf: 'center' }}
            resizeMode="cover"
          />
          <View
            style={[
              styles.element,
              { borderColor: colors.border, borderTopWidth: 0 },
            ]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('productName')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.item_name}
            </Text>
          </View>
          <View style={[styles.element, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('productCode')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.item_code}
            </Text>
          </View>
          <View style={[styles.element, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('unitDefault')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.stock_uom}
            </Text>
          </View>
          <View style={[styles.element, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('standPrice')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {CommonUtils.formatCash(price?.toString() || "")}
            </Text>
          </View>
          <View style={[styles.element, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('groupProduct')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.item_group ?? "---"}
            </Text>
          </View>
          <View
            style={[
              styles.element,
              { borderColor: colors.border, borderBottomWidth: 0 },
            ]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('brand')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.brand ?? '---'}
            </Text>
          </View>
          <View
            style={[
              styles.element,
              { borderColor: colors.border, borderBottomWidth: 0 },
            ]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('industry')}
            </Text>
            <Text style={[styles.text, { color: colors.text_primary }]}>
              {overviewData.custom_industry ?? '---'}
            </Text>
          </View>
          <View
            style={[
              styles.element,
              { borderColor: colors.border, borderBottomWidth: 0 },
            ]}>
            <Text style={{ color: colors.text_disable, fontSize: 16 }}>
              {getLabel('describe')}
            </Text>
            <View>
              <RenderHtml
                contentWidth={AppConstant.WIDTH - 64}
                source={{html : overviewData.description}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getPriceProduct = ()=>{
    for (let i = 0; i < overviewData.details.length; i++) {
      const element = overviewData.details[i];
      if (element.uom === overviewData.stock_uom) {
        setPrice(element.price_list_rate)
      }
    }
  }

  useEffect(()=>{
    getPriceProduct()
  },[overviewData])
  
  return (
    <>
      {_renderInfo()}
      {_renderImg()}
    </>
  );
};

interface OverviewProps {
  overviewData: IProduct;
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
