import {Platform, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import ListVisit from './ListVisit';
type Props = {};

const Visits = (props: Props) => {
  const ref = useRef<MapView>(null);
  const [location, setLocation] = useState<GeolocationResponse>();
  // console.log(Geolocation.getCurrentPosition(info => setLocation(info)))

  // useEffect(() => {
  //   ref.current?.animateToRegion(
  //     {
  //       latitude: location?.coords.latitude!,
  //       longitude: location?.coords.longitude!,
  //       latitudeDelta: 0.05,
  //       longitudeDelta: 0.04,
  //     },
  //     1000,
  //   );
  // }, [location]);
  return <ListVisit />;
};

export default Visits;

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  } as ViewStyle,
});
