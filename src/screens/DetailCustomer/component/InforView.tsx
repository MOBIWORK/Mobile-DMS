import { StyleSheet, ViewStyle, Image, ImageStyle } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { DetailCustomerType, IDataCustomers } from '../../../models/types';
import { AppTheme, useTheme } from '../../../layouts/theme';
import {
  AppText,
  Block,
  SvgIcon,
  AppText as Text,
} from '../../../components/common';
import { MainLayout } from '../../../layouts';
import Mapbox from '@rnmapbox/maps';
import { useTranslation } from 'react-i18next';
import { AppConstant } from '../../../const';
import { CommonUtils } from '../../../utils';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { formatMoney } from '../../../config/function';
import { GeolocationCustomer } from '../../../services/customerService';

type Props = {
  data: DetailCustomerType;
};

const InforBlock = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const ref = useRef<Mapbox.Camera>(null);
  const { t: translate } = useTranslation();
  const [isError, setIsError] = useState(false);

  // const [location, setLocation] = useState<GeolocationResponse | null>(null);

  // useEffect(() => {
  //   CommonUtils.getCurrentLocation(locations => setLocation(locations));
  // }, []);

  const [locationCustomer, setLocationCustomer] = useState<GeolocationCustomer | null>(null);

  useEffect(() => {
    if (props.data?.customer_location_primary) {
      const parsedLocation = JSON.parse(props.data.customer_location_primary);
      setLocationCustomer({
        longitude: parsedLocation.long,
        latitude: parsedLocation.lat,
      });
    }
  }, [props.data]);
  return (
    <Block style={styles.root}>
      <Block style={styles.containImage}>
        {props?.data?.image && !isError ? (
          <Image
            source={{
              uri: props.data.image !== undefined && props.data.image,
            }}
            style={styles.imageStyle}
            resizeMode="center"
            onError={err => {
              if (err.nativeEvent.error === 'unknown image format') {
                setIsError(true);
              } else {
                false;
              }
            }}
            alt="customerImage"
          />
        ) : (
          <Block
            width={90}
            height={90}
            colorTheme="bg_neutral"
            borderRadius={10}
            justifyContent="center"
            alignItems="center">
            <Text numberOfLines={1} fontSize={30} colorTheme='text_secondary' >
              {props.data.name && props.data.name.slice(0, 2)}
            </Text>
          </Block>
        )}
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
            {props.data?.customer_name && props.data.customer_name != null
              ? props.data.customer_name
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
            {translate('customerCode')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data?.customer_code != null
              ? props.data?.customer_code
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
            {translate('customerType')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.customer_type != null
              ? translate(props.data.customer_type.toLowerCase())
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
            {props.data.customer_group != null
              ? translate(props.data.customer_group.toLowerCase())
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
            {props.data.custom_birthday != null
              ? props.data.custom_birthday
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
            {translate('debtLimit')}
          </AppText>
          <AppText
            fontSize={16}
            fontWeight="400"
            colorTheme="text_primary"
            lineHeight={24}>
            {props.data.credit_limits && props.data.credit_limits.length > 0
              ? formatMoney(props.data.credit_limits[0])
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
            {props.data.customer_details != null
              ? props.data.customer_details
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
                style={{ visibility: 'visible' }}
              />
            </Mapbox.RasterSource>
            <Mapbox.Camera
              ref={ref}
              centerCoordinate={[
                locationCustomer?.longitude ?? 0,
                locationCustomer?.latitude ?? 0,
              ]}
              animationMode={'flyTo'}
              animationDuration={500}
              zoomLevel={12}
            />

            <Mapbox.MarkerView
              coordinate={[
                locationCustomer?.longitude ?? 0,
                locationCustomer?.latitude ?? 0,
              ]}>
              <SvgIcon source="Location" size={32} colorTheme="action"  color={theme.colors.text_primary}  />
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
    } as ViewStyle,
    imageStyle: {
      width: 90,
      height: 90,
      borderRadius: 12,
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
      borderRadius: 12,
      overflow: 'hidden',
    } as ViewStyle,
  });
