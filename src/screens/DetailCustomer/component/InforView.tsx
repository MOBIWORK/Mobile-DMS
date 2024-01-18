import {StyleSheet, ViewStyle, Image, ImageStyle} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {IDataCustomer} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {AppText, Block, SvgIcon} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import Mapbox, {Location} from '@rnmapbox/maps';
import BackgroundGeolocation from 'react-native-background-geolocation';

type Props = {
  data: IDataCustomer;
};

const InforView = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const ref = useRef<Mapbox.Camera>(null);

  const [location, setLocation] = useState<Location | any>({
    coords: {
      latitude: 0,
      longitude: 0,
    },
    timestamp: 0,
  });

  useLayoutEffect(() => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(res => {
        setLocation(res);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Block style={styles.root}>
      <Block style={styles.containImage}>
        <Image
          source={{
            uri:
              props.data.imageSource != undefined
                ? props.data.imageSource
                : 'https://yt3.googleusercontent.com/ytc/APkrFKa93uRfPROMhBKD5UCngwnLlJqVyhbfJEptGLtK=s900-c-k-c0x00ffffff-no-rj',
          }}
          style={styles.imageStyle}
          resizeMode="center"
        />
      </Block>
      <MainLayout style={styles.containContent}>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Tên khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.nameCompany != '' ? props.data.nameCompany : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Mã khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            KH-12345
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Loại khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.type != '' ? props.data.type : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Nhóm khách hàng
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.group != '' ? props.data.group : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Khu vực
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.area != '' ? props.data.area : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Ngày sinh nhật
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.dob != '' ? props.data.dob : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Tuyến
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.gland != '' ? props.data.gland : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Hạn mức công nợ
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.debtLimit != '' ? props.data.debtLimit : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Mô tả
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.description != '' ? props.data.description : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Website
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.websiteURL != '' ? props.data.websiteURL : ` ---`}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block marginTop={16}>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            Vị trí
          </AppText>
          <Mapbox.MapView
            pitchEnabled={false}
            styleURL={Mapbox.StyleURL.Street}
            attributionEnabled={false}
            scaleBarEnabled={false}
            logoEnabled={false}
            style={styles.mapView}>
            <Mapbox.Camera
              // ref={mapboxCameraRef}
              ref={ref}
              centerCoordinate={[
                location?.coords.longitude ?? 0,
                location?.coords.latitude ?? 0,
              ]}
              animationMode={'flyTo'}
              animationDuration={500}
              zoomLevel={12}
            />

            <Mapbox.MarkerView
              coordinate={[
                location?.coords.longitude ?? 0,
                location?.coords.latitude ?? 0,
              ]}>
              <SvgIcon source="Location" size={32} colorTheme="action" />
            </Mapbox.MarkerView>
          </Mapbox.MapView>
        </Block>
      </MainLayout>
    </Block>
  );
};

export default React.memo(InforView);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 12,
      marginVertical: 10,
    } as ViewStyle,
    containImage: {
      justifyContent: 'center',
      alignSelf: 'center',
      paddingVertical: 16,
      //   backgroundColor:'red'
    } as ViewStyle,
    imageStyle: {
      width: 90,
      height: 90,
      borderRadius: 12,
      //   backgroundColor:'red'
    } as ImageStyle,
    containContent: {
      paddingTop: 0,
    } as ViewStyle,
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: 12,
    } as ViewStyle,
    mapView: {
      width: '100%',
      height: 381,
    } as ViewStyle,
  });
