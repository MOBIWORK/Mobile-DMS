import React, {useLayoutEffect, useRef, useState} from 'react';
import {MainLayout} from '../../../layouts';
import {AppHeader} from '../../../components/common';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NavigationProp} from '../../../navigation';
import Mapbox from '@rnmapbox/maps';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {AppConstant} from '../../../const';
import {Image, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import VisitItem from '../../Visit/VisitList/VisitItem';
import {VisitListData} from '../../Visit/VisitList/ListVisit';
import {ImageAssets} from '../../../assets';
import {AppService} from '../../../services';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';

//config Mapbox
Mapbox.setAccessToken(AppConstant.MAPBOX_TOKEN);

const CheckInLocation = () => {
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();

  const [location, setLocation] = useState<Location | null>(null);
  const mapboxCameraRef = useRef<CameraRef>(null);

  const handleRegainLocation = () => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(location => {
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [location.coords.longitude, location.coords.latitude],
            1000,
          );
        setLocation(location);
      })
      .catch(e => console.log('err', e));
  };

  useLayoutEffect(() => {
    BackgroundGeolocation.getCurrentPosition({samples: 1, timeout: 3})
      .then(location => {
        setLocation(location);
      })
      .catch(e => console.log('err', e));
  }, []);

  return (
    <MainLayout
      style={{backgroundColor: colors.bg_neutral, paddingHorizontal: 0}}>
      <AppHeader
        style={{paddingHorizontal: 16, flex: 0.5}}
        onBack={() => navigation.goBack()}
        label={'Vị trí'}
      />
      <View
        style={{
          overflow: 'hidden',
          width: '100%',
          flex: 9,
        }}>
        <Mapbox.MapView
          pitchEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          styleURL={Mapbox.StyleURL.Street}
          logoEnabled={false}
          style={{flex: 1}}>
          <Mapbox.Camera
            ref={mapboxCameraRef}
            centerCoordinate={[
              location?.coords.longitude ?? 0,
              location?.coords.latitude ?? 0,
            ]}
            animationMode={'flyTo'}
            animationDuration={500}
            zoomLevel={12}
          />
          <Mapbox.UserLocation
            visible={true}
            animated
            androidRenderMode="gps"
            showsUserHeadingIndicator={true}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 12,
              marginHorizontal: 16,
              flexDirection: 'row',
              backgroundColor: colors.bg_default,
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 16,
              top: 20,
            }}>
            <Image
              source={ImageAssets.MapPinFillIcon}
              style={{width: 24, height: 24}}
              resizeMode={'cover'}
              tintColor={colors.text_secondary}
            />
            <Text style={{color: colors.text_primary, marginLeft: 8}}>
              102 Đỗ Đức Dục
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleRegainLocation}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.action,
              marginTop: 32,
              maxWidth: '50%',
              alignSelf: 'flex-end',
              marginRight: 24,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              source={ImageAssets.MapIcon}
              style={{width: 16, height: 16}}
              resizeMode={'cover'}
              tintColor={colors.bg_default}
            />
            <Text style={{color: colors.bg_default, marginLeft: 4}}>
              Vị trí hiện tại
            </Text>
          </TouchableOpacity>
        </Mapbox.MapView>
      </View>
    </MainLayout>
  );
};
export default CheckInLocation;
