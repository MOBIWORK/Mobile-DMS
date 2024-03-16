import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useCallback, useImperativeHandle} from 'react';
import {rootStyles} from './style';
import {useTheme} from '../../../layouts/theme';
import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import {BottomSheetProps} from './type';

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({children, style}, ref) => {
    const theme = useTheme();
    const styles = rootStyles(theme);
    const translateY = useSharedValue(0);
    const contextValue = useSharedValue({y: 0});

    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, {damping: 50});
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({scrollTo, isActive}), [
      scrollTo,
      isActive,
    ]);

    // const scrollTo = useCallback((destination:number) =>{
    //     translateY.value = withTiming(destination)

    // },[])

    const gesture = Gesture.Pan()
      .onStart(ev => {
        contextValue.value = {y: translateY.value};
      })
      .onUpdate(ev => {
        translateY.value = ev.translationY + contextValue.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(event => {
        console.log(event);
      });
    const rBackdropStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(active.value ? 1 : 0),
      };
    }, []);

    const rBackdropProps = useAnimatedProps(() => {
      return {
        pointerEvents: active.value ? 'auto' : 'none',
      } as any;
    }, []);

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 15],
        Extrapolate.CLAMP,
      );

      return {
        borderRadius,
        transform: [{translateY: translateY.value}],
      };
    });

    // useEffect(() => {
    //   // translateY.value = withTiming(-SCREEN_HEIGHT*(parseFloat(props.snapPoint[0])/100))
    //   scrollTo(-SCREEN_HEIGHT * snapPoints.value);
    // }, [snapPoint[0]]);

    return (
      <>
        <Animated.View
          onTouchStart={(event) => {
            scrollTo(0);
            console.log(event.nativeEvent.target,'event phase')
          }}
          animatedProps={rBackdropProps}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
            rBackdropStyle,
          ]}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.container, rBottomSheetStyle, style]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

export default BottomSheet;
