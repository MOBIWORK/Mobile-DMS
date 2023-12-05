import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
const Backdrop: FC<BackdropProps> = ({open}) => {
  return open ? (
    <Animated.View
      style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0, 0, 0, 0.4)'}]}
    />
  ) : null;
};

interface BackdropProps {
  open: boolean;
}

export default Backdrop;
