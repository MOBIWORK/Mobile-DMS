import {Image, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import { SvgIcon } from '../AppSvgIcon';
import { useMix, useRadian, useSharedTransition } from '../../../config/animatedHook';

type Props = {
 show:boolean
};

const Chevron = ({show}: Props) => {

  const progress = useSharedTransition(show);
  
  const rotate = useRadian(useMix(progress, 0, -180));
  const arrowStyle = useAnimatedStyle(
    () => ({
      transform: [{rotate: rotate.value}],
    }),
    [],
  );


  return (
    <Animated.View style={arrowStyle}>
      <SvgIcon source='ArrowDown'   size={24}  />
    </Animated.View>
  );
};

export default Chevron;

const styles = StyleSheet.create({
  chevron: {
    width: 24,
    height: 24,
  },
});