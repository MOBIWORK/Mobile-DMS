import {Image, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import {Block, AppText as Text} from '../../../components/common';
import {useTranslation} from 'react-i18next';
import {useTheme, AppTheme} from '../../../layouts/theme';
import {VisitListItemType} from '../../../models/types';
import {GeolocationResponse} from '@react-native-community/geolocation';
import Mapbox from '@rnmapbox/maps';
import { ImageAssets } from '../../../assets';
import MarkerItem from '../../../components/common/MarkerItem';
import { AppConstant } from '../../../const';
import { LocationProps } from '../../Visit/VisitList/VisitItem';
import isEqual from 'react-fast-compare';


type Props = {
  listCustomerVisit: VisitListItemType[];
  location: any;
  handleRegainPosition:() => Promise<void>;
  mapboxCameraRef:React.RefObject<Mapbox.Camera>
};

const MapView = ({listCustomerVisit, location,handleRegainPosition,mapboxCameraRef}: Props) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const styles = rootStyles(theme);
  const {t: getLabel} = useTranslation();
  return (
    <Block>
    <Block style={[styles.flexSpace]}>
      <Text style={[styles.tilteSection]}>{getLabel('visitMap')}</Text>
    </Block>

    <View style={styles.map}>
      <Mapbox.MapView
        pitchEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
        zoomEnabled
        scrollEnabled
        logoEnabled={false}
        styleURL={Mapbox.StyleURL.Street}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 10,
          position: 'absolute',
        }}>
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
          ref={mapboxCameraRef}
          centerCoordinate={[
            location.current !== null
              ? location.current.coords.longitude
              : 0,
            location.current !== null
              ? location.current.coords.latitude
              : 0,
          ]}
          animationMode={'flyTo'}
          animationDuration={500}
          zoomLevel={11}
        />
        {listCustomerVisit.length > 0 &&
          listCustomerVisit.map((item, index) => {
            if (item.customer_location_primary) {
              const newLocation: LocationProps = JSON.parse(
                item.customer_location_primary!,
              );
              return (
                <Mapbox.MarkerView
                  key={index}
                  coordinate={[
                    Number(newLocation.long),
                    Number(newLocation.lat),
                  ]}>
                  <MarkerItem item={item} index={index} />
                </Mapbox.MarkerView>
              );
            } else {
              return null;
            }
          })}
        <Mapbox.UserLocation
          visible={true}
          animated
          androidRenderMode="gps"
          showsUserHeadingIndicator={true}
        />
      </Mapbox.MapView>
      <TouchableOpacity
        onPress={handleRegainPosition}
        style={styles.regainPosition}>
        <Image
          source={ImageAssets.MapIcon}
          style={{width: 16, height: 16}}
          resizeMode={'cover'}
          tintColor={colors.bg_default}
        />
        <Text style={{color: colors.bg_default, marginLeft: 4}}>
          {getLabel('currentPosition')}
        </Text>
      </TouchableOpacity>
    </View>
  </Block>
  );
};

export default React.memo(MapView,isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    regainPosition: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.action,
      alignSelf: 'flex-end',
      marginRight: 24,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'absolute',
      top: 16,
      right: 0,
      zIndex: 99999999,
    } as ViewStyle,
    mapView: {
      width: '100%',
      height: '100%',
      zIndex: 10,
      position: 'absolute',
    } as ViewStyle,
    map: {
        width: '100%',
        height: 360,
        borderRadius: 16,
        overflow: 'hidden',
        position:'relative'
      } as ViewStyle,
      flexSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      } as ViewStyle,
      tilteSection: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: theme.colors.text_disable,
        marginBottom: 8,
      } as TextStyle,
  });
