import {StyleSheet, ViewStyle, Image, ImageStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {IDataCustomer} from '../../../models/types';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {AppText, Block, SvgIcon} from '../../../components/common';
import {MainLayout} from '../../../layouts';
import Mapbox, {Location} from '@rnmapbox/maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {useTranslation} from 'react-i18next';
import {AppConstant} from '../../../const';

type Props = {
  data: IDataCustomer;
};

const InforBlock = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const ref = useRef<Mapbox.Camera>(null);
  const {t: translate} = useTranslation();
  console.log(props);

  const [location, setLocation] = useState<Location | any>({
    coords: {
      latitude: 0,
      longitude: 0,
    },
    timestamp: 0,
  });

  useEffect(() => {
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
              props.data.image != undefined
                ? props.data.image
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
            {translate('customerName')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.customer_name != '' ? props.data.customer_name : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('customerCode')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.customer_code != null
              ? props.data.customer_code
              : '---'}
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
            {props.data.customer_group != ''
              ? props.data.customer_group
              : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('groupCustomer')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.customer_type != ''
              ? translate(props.data.customer_type)
              : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>

        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('area')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.territory != null ? props.data.territory : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('customerBirthDay')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.customer_birthday != null
              ? props.data.customer_birthday
              : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('gland')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.router_name != null ? props.data.router_name : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('frequency')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.frequency && props.data.frequency?.length > 0
              ? props.data.frequency.join(',')
              : '---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('debtLimit')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.credit_limid && props.data.credit_limid.length > 0
              ? props.data.credit_limid.join(',')
              : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('describe')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data?.description && props.data?.description != ''
              ? props.data.description
              : ' ---'}
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
            {props.data?.website && props.data?.website != ''
              ? props.data.website
              : ' ---'}
          </AppText>
          <Block style={styles.divider} />
        </Block>
        <Block marginTop={16}>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_secondary"
            lineHeight={24}>
            {translate('location')}
          </AppText>
          <Mapbox.MapView
            pitchEnabled={false}
            styleURL={Mapbox.StyleURL.Street}
            attributionEnabled={false}
            scaleBarEnabled={false}
            logoEnabled={false}
            style={styles.mapBlock}>
            <Mapbox.RasterSource
              id="adminmap"
              tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
              <Mapbox.RasterLayer
                id={'adminmap'}
                sourceID={'admin'}
                style={{visibility: 'visible'}}
              />
            </Mapbox.RasterSource>
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

export default React.memo(InforBlock);

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
    mapBlock: {
      width: '100%',
      height: 381,
      marginTop: 8,
    } as ViewStyle,
  });
