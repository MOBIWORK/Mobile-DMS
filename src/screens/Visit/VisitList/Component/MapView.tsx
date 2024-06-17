import {Image, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {VisitListItemType} from '../../../../models/types';
import {useTranslation} from 'react-i18next';
import {Block, AppText as Text} from '../../../../components/common';
import Mapbox from '@rnmapbox/maps';
import {ImageAssets} from '../../../../assets';
import MarkerItem from '../../../../components/common/MarkerItem';
import {AppConstant} from '../../../../const';
import VisitItem, {LocationProps} from '../VisitItem';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  customerDataSort?: VisitListItemType[];
  location: any;
  mapboxCameraRef: any;
  setVisitItemSelected: React.Dispatch<React.SetStateAction<any>>;
  handleRegainLocation: () => void;
  visitItemSelected: VisitListItemType | null;
  onPressToDetail: (item: VisitListItemType) => void;
  handleCompareDistance: (item: VisitListItemType, isDetail: boolean) => void;
};

const MapViewComponent = ({
  location,
  mapboxCameraRef,
  customerDataSort,
  setVisitItemSelected,
  handleRegainLocation,
  visitItemSelected,
  onPressToDetail,
  handleCompareDistance,
}: Props) => {
  console.log('visitItemSelected', visitItemSelected);
  const {t: getLabel} = useTranslation();
  const theme = useTheme();
  const styles = rootStyles(theme);
  const {bottom} = useSafeAreaInsets();
  return (
    <Block style={styles.map as ViewStyle}>
      <Mapbox.MapView
        pitchEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={false}
        style={{flex: 1}}>
        <Mapbox.RasterSource
          id="adminmap"
          tileUrlTemplates={[AppConstant.MAP_TITLE_URL.adminMap]}>
          <Mapbox.RasterLayer
            id={'adminmap'}
            sourceID={'admin'}
            style={{visibility: 'visible'}}
          />
        </Mapbox.RasterSource>
        {location?.coords && (
          <Mapbox.Camera
            ref={mapboxCameraRef}
            centerCoordinate={[
              location?.coords.longitude,
              location?.coords.latitude,
            ]}
            animationMode={'flyTo'}
            animationDuration={500}
            zoomLevel={12}
          />
        )}
        {customerDataSort &&
          customerDataSort.map((item, index) => {
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
                  <MarkerItem
                    item={item}
                    index={index}
                    onPress={() => setVisitItemSelected(item)}
                  />
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
        onPress={handleRegainLocation}
        style={styles.regainPosition}>
        <Image
          source={ImageAssets.MapIcon}
          style={{width: 16, height: 16}}
          resizeMode={'cover'}
          tintColor={theme.colors.bg_default}
        />
        <Text colorTheme="bg_default" style={{marginLeft: 4}}>
          {getLabel('currentPosition')}
        </Text>
      </TouchableOpacity>
      {visitItemSelected && (
        <Block position="absolute" bottom={bottom + 70} left={24} right={24}>
          <VisitItem
            item={visitItemSelected}
            handlePressDetail={onPressToDetail}
            handlePressing={handleCompareDistance}
            handleClose={() => setVisitItemSelected(null)}
          />
        </Block>
      )}
    </Block>
  );
};

export const MapView = React.memo(MapViewComponent, isEqual);

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
    map: {
      overflow: 'hidden',
      width: '100%',
      height: AppConstant.HEIGHT * 0.8,
    },
  });
