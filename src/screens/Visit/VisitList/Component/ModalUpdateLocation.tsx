import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import isEqual from 'react-fast-compare';
import {Block, AppText as Text} from '../../../../components/common';
import Modal from 'react-native-modal';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import Mapbox from '@rnmapbox/maps';
import {useTranslation} from 'react-i18next';
import {
  backgroundErrorListener,
  useEffectOnce,
  useSelector,
} from '../../../../config/function';
import {CommonUtils} from '../../../../utils';
import {VisitListItemType} from '../../../../models/types';

import {AppService} from '../../../../services';
import {ApiConstant} from '../../../../const';
import MarkerItem from '../../../../components/common/MarkerItem';
import {ModalUpdateType} from '../ListVisit';
type Props = {
  isVisible: ModalUpdateType;
  //   setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onBackButtonPress: () => void;
  currentLocation: any;
  item?: VisitListItemType;
  handleCheckin: (
    item: VisitListItemType,
    isDetail: boolean,
    coords: any,
    detailAdd?: any,
  ) => void;
};

interface MarkingAddress {
  detailAdd: string;
  coords: {
    lat?: number;
    lon?: number;
  };
}

const ModalUpdateLocation = ({
  isVisible,
  item,
  onBackButtonPress,
  handleCheckin,
  currentLocation,
}: Props) => {
  const theme = useTheme();
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const curLocation = useRef<any>(currentLocation);
  const markingLocation = useRef<MarkingAddress>({
    detailAdd: '',
    coords: {
      lat: undefined,
      lon: undefined,
    },
  });
  const categoriesCheckin = useSelector(
    state => state.checkin.categoriesCheckin,
  );
  const {t: getLabel} = useTranslation();
  const styles = rootStyles(theme);
  const [isPending, setIsPending] = useState<boolean>(false);
  

  useEffect(() => {
    if (currentLocation && Object.keys(currentLocation).length > 0) {
      mapboxCameraRef.current?.flyTo(
        [currentLocation?.coords?.longitude, currentLocation?.coords?.latitude],
        200,
      );
    } else {
      return;
    }
  },[]);
  const handleMarkerMap = useCallback(
    async (lat: number, lng: number) => {
      Keyboard.dismiss();
      setIsPending(true);
      const response: any = await AppService.getDetailLocation(lat, lng);
      if (response.status === ApiConstant.STT_OK || 'OK') {
        markingLocation.current.detailAdd =
          response.results[0].formatted_address;
        markingLocation.current.coords.lat = lat;
        markingLocation.current.coords.lon = lng;
        setIsPending(false);
      }
    },
    [
      curLocation.current,
      markingLocation.current.coords,
      markingLocation.current.detailAdd,
    ],
  );

  const handleUpdateLocation = async (item: VisitListItemType | undefined) => {
    startTransition(() => {
      handleMarkerMap(
        curLocation.current?.coords?.latitude,
        curLocation.current?.coords?.longitude,
      );
    });
    if (item && Object.keys(item).length > 0) {
      onBackButtonPress();
      handleCheckin(
        item!,
        isVisible.isDetail,
        markingLocation.current.coords,
        markingLocation.current.detailAdd,
      );
    }

    // }
  };

  const handleRegainLocation = async () => {
    CommonUtils.getCurrentLocation(
      locations => {
        startTransition(() =>{
        curLocation.current = locations;
        handleMarkerMap(
          curLocation.current?.coords?.latitude,
          curLocation.current?.coords?.longitude,
        );
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [locations.coords.longitude, locations.coords.latitude],
            1000,
          );
        })
      },
      err => backgroundErrorListener(err.code),
    );
  };

  return (
    <Modal
      isVisible={isVisible.status}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackButtonPress}
      backdropOpacity={0.5}>
      <Block height={400} colorTheme="white" borderRadius={16}>
        <Block
          alignItems="center"
          justifyContent="center"
          marginTop={16}
          marginBottom={8}>
          <Block marginBottom={8}>
            <Text lineHeight={24} colorTheme="text_primary" fontSize={16}>
              Chưa có vị trí khách hàng
            </Text>
          </Block>
          <Block paddingHorizontal={16}>
            <Text fontSize={14} textAlign="center">
              Khách hàng chưa có vị trí, bạn muốn cắm mốc vị trí hiện tại của
              mình cho khách hàng và tiếp tục checkin?
            </Text>
          </Block>
          <Block
            // overflow="hidden"
            // color='red'
            position="relative"
            width={'100%'}
            height={200}
            paddingHorizontal={16}
            paddingVertical={16}
            borderRadius={16}>
            <Mapbox.MapView
              pitchEnabled={false}
              attributionEnabled={false}
              scaleBarEnabled={false}
              styleURL={Mapbox.StyleURL.Street}
              logoEnabled={false}
              style={{height: 200, borderRadius: 16, width: '100%'}}>
              {markingLocation?.current?.coords &&
                markingLocation.current.coords.lat != undefined &&
                markingLocation.current.coords.lon != undefined && (
                  <Mapbox.PointAnnotation
                    id="1"
                    coordinate={[
                      markingLocation.current.coords.lon,
                      markingLocation.current.coords.lat,
                    ]}>
                    <MarkerItem item={item!} index={0} />
                  </Mapbox.PointAnnotation>
                )}
              <Mapbox.Camera
                ref={mapboxCameraRef}
                animationMode={'flyTo'}
                animationDuration={0}
                centerCoordinate={
                  curLocation.current &&
                  curLocation.current.coords &&
                  Object.keys(curLocation.current.coords).length > 0
                    ? [
                        curLocation.current.coords.longitude,
                        curLocation.current.coords.latitude,
                      ]
                    : undefined
                }
                zoomLevel={11}
              />
              <Mapbox.LocationPuck
                visible={true}
                puckBearing="course"
                puckBearingEnabled={true}
                // key={list.le}
                pulsing={{
                  isEnabled: true,
                  color: theme.colors.action,
                  radius: 40,
                }}
              />
            </Mapbox.MapView>
            <Block
              marginTop={40}
              zIndex={2000}
              paddingHorizontal={14}
              alignItems="center"
              direction="row"
              justifyContent="space-between">
              <TouchableOpacity
                style={styles.touchableContain}
                onPress={onBackButtonPress}>
                <Text>{getLabel('close')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.regainPosition}
                onPress={handleRegainLocation}>
                <Text
                  style={styles.textRegain}
                  fontSize={14}
                  fontWeight="bold"
                  colorTheme="action">
                  {getLabel('regainPosition')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkinButton}
                disabled={isPending}
                onPress={() => handleUpdateLocation(item)}>
                {isPending ? (
                  <ActivityIndicator size="large" color={theme.colors.white} />
                ) : (
                  <Text
                    fontSize={14}
                    lineHeight={21}
                    fontWeight="bold"
                    style={styles.textCheckin}
                    colorTheme="bg_default">
                    {getLabel('marking')}
                  </Text>
                )}
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
};

export default React.memo(ModalUpdateLocation, isEqual);
const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    touchableContain: {
      height: 32,
      borderColor: theme.colors.action,
      borderRadius: 16,
      paddingTop: 2,
      // backgroundColor:'
    } as ViewStyle,
    regainPosition: {
      borderWidth: 1,
      borderColor: theme.colors.action,
      borderRadius: 16,
      //   height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    textRegain: {
      paddingVertical: 7.5,
      paddingHorizontal: 15,
    } as TextStyle,
    checkinButton: {
      backgroundColor: theme.colors.action,
      borderRadius: 16,
      //   height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    textCheckin: {
      paddingVertical: 7.5,
      paddingHorizontal: 15,
    } as TextStyle,
  });
