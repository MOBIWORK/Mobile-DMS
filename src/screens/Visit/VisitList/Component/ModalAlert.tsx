import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import Modal from 'react-native-modal';
import {Block, AppText as Text} from '../../../../components/common';
import {ModalType} from '../ListVisit';
import {AppTheme, useTheme} from '../../../../layouts/theme';
import isEqual from 'react-fast-compare';
import {VisitListItemType} from '../../../../models/types';

import Mapbox from '@rnmapbox/maps';
import {LocationProps} from '../VisitItem';
import MarkerItem from '../../../../components/common/MarkerItem';
import {
  backgroundErrorListener,
  calculateDistance,
  useEffectOnce,
  useSelector,
} from '../../../../config/function';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../../utils';
import {DMSConfigMobile} from '../../../../services/appService';
import {AppConstant} from '../../../../const';
type Props = {
  show: ModalType;
  setShow: React.Dispatch<React.SetStateAction<ModalType>>;
  currentLocation: any;
  item?: VisitListItemType;
  handleCheckin: (item: VisitListItemType) => void;
};

const ModalAlert = ({
  show,
  setShow,
  item,
  currentLocation,
  handleCheckin,
}: Props) => {
  const theme = useTheme();
  const location: LocationProps =
    item?.customer_location_primary != null &&
    JSON.parse(item?.customer_location_primary);
  const styles = rootStyles(theme);
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const systemConfig: DMSConfigMobile = useSelector(
    state => state.app.systemConfig,
  );
  const curLocation = useRef<any>(currentLocation);

  const {t: getLabel} = useTranslation();

  useEffectOnce(() => {
    if (currentLocation && Object.keys(currentLocation).length > 0) {
      mapboxCameraRef.current?.flyTo(
        [currentLocation?.coords?.longitude, currentLocation?.coords?.latitude],
        200,
      );
    } else {
      return;
    }
  });
  const data = React.useMemo(() => {
    let res = calculateDistance(
      curLocation?.current?.coords ? curLocation?.current?.coords.latitude : 0,
      curLocation?.current?.coords ? curLocation?.current?.coords.longitude : 0,
      location?.lat,
      location.long,
    );
    return res;
  }, [curLocation]);

  const handleRegainLocation = async () => {
    CommonUtils.getCurrentLocation(
      locations => {
        curLocation.current = locations;
        mapboxCameraRef.current &&
          mapboxCameraRef.current.moveTo(
            [locations.coords.longitude, locations.coords.latitude],
            1000,
          );
      },
      err => backgroundErrorListener(err.code),
    );
  };

  return (
    <Modal
      isVisible={show.status}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackButtonPress={() =>
        setShow(prev => ({
          ...prev,
          status: false,
        }))
      }
      onBackdropPress={() =>
        setShow(prev => ({
          ...prev,
          status: false,
        }))
      }>
      <Block height={400} colorTheme="white" borderRadius={16}>
        {show.type === 'loading' ? (
          <Block justifyContent="center" alignItems="center" block>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Block justifyContent="center" alignItems="center" marginTop={16}>
              <Text textAlign="center"> Đang lấy dữ liệu, vui lòng chờ...</Text>
            </Block>
          </Block>
        ) : (
          <Block justifyContent="center">
            <Block
              alignItems="center"
              justifyContent="center"
              marginTop={16}
              marginBottom={8}>
              <Block marginBottom={8}>
                <Text lineHeight={24} colorTheme="text_primary" fontSize={16}>
                  Sai số khoảng cách
                </Text>
              </Block>
              <Text
                fontSize={14}
                textAlign="center">{`Vị trí của bạn đang cách vị trí của khách hàng ${Math.ceil(
                show.cal! * 1000,
              )}m. Bạn vui lòng lấy lại vị trí hoặc checkin với sai số`}</Text>
            </Block>
            <Block marginTop={8}>
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
                  {item && item.customer_location_primary != null && (
                    <Mapbox.MarkerView
                      coordinate={[location.long, location.lat]}>
                      <MarkerItem item={item} index={0} />
                    </Mapbox.MarkerView>
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
                    zoomLevel={
                      show.cal && show.cal != undefined && show.cal > 1
                        ? 11
                        : 13
                    }
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
                  direction="row"
                  justifyContent="space-between">
                  <TouchableOpacity
                    style={styles.touchableContain}
                    onPress={() =>
                      setShow(prev => ({
                        ...prev,
                        status: false,
                        type: 'loading',
                      }))
                    }>
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
                  {systemConfig.kb_vitringoaisaiso === 1 &&
                    data * 1000 <=
                      systemConfig.saiso_chophep_kb_vitringoaisaiso +
                        AppConstant.additional_distance && (
                      <TouchableOpacity
                        style={styles.checkinButton}
                        onPress={() => handleCheckin(item!)}>
                        <Text
                          fontSize={14}
                          lineHeight={21}
                          fontWeight="bold"
                          style={styles.textCheckin}
                          colorTheme="bg_default">
                          Checkin
                        </Text>
                      </TouchableOpacity>
                    )}
                </Block>
              </Block>
            </Block>
          </Block>
        )}
      </Block>
    </Modal>
  );
};

export default React.memo(ModalAlert, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    touchableContain: {
      height: 32,
      borderColor: theme.colors.action,
      borderRadius: 16,
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
