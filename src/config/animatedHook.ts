import {useCallback, useEffect} from 'react';
import Animated, {
  AnimationCallback,
  Easing,
  Extrapolation,
  WithTimingConfig,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const sharedBin = (value: boolean): 0 | 1 => {
  'worklet';
  return value ? 1 : 0;
};
export const sharedTiming = (
  toValue: number,
  config?: WithTimingConfig,
  callBack?: AnimationCallback,
) => {
  'worklet';
  return withTiming(
    toValue,
    Object.assign(
      {
        duration: 500,
        easing: Easing.bezier(0.33, 0.01, 0, 1),
      },
      config,
    ),
    callBack,
  );
};

export const useSharedTransition = (
  state: boolean | number,
  config?: WithTimingConfig,
): Animated.SharedValue<number> => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = typeof state === 'boolean' ? sharedBin(state) : state;
  }, [state, value]);
  return useDerivedValue(() =>
    withTiming(
      value.value,
      Object.assign(
        {duration: 500, easing: Easing.bezier(0.33, 0.01, 0, 1)},
        config,
      ),
    ),
  );
};

export const useInterpolate = (
  progress: Animated.SharedValue<number>,
  input: number[],
  output: number[],
  type?: Extrapolation,
) => useDerivedValue(() => interpolate(progress.value, input, output, type));


export const useShareClamp = (
  value: Animated.SharedValue<number>,
  lowerValue: number,
  upperValue: number,
) => {
  'worklet';
  return useDerivedValue(() =>
    sharedClamp(value.value, lowerValue, upperValue),
  );
};
export const sharedClamp = (
  value: number,
  lowerValue: number,
  upperValue: number,
) => {
  'worklet';
  return Math.min(Math.max(lowerValue, value), upperValue);
};


/**
 * Provides dynamic content height calculating functionalities, by
 * replacing the placeholder `CONTENT_HEIGHT` with calculated layout.
 * @example
 * [0, 'CONTENT_HEIGHT', '100%']
 * @param initialSnapPoints your snap point with content height placeholder.
 * @returns {
 *  - animatedSnapPoints: an animated snap points to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedHandleHeight: an animated handle height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - animatedContentHeight: an animated content height callback node to be set on `BottomSheet` or `BottomSheetModal`.
 *  - handleContentLayout: a `onLayout` callback method to be set on `BottomSheetView` component.
 * }
 */
export const useBottomSheetDynamicSnapPoints = (
  initialSnapPoints: Array<string | number>
) => {
  // variables
  const animatedContentHeight = useSharedValue(0);
  const animatedHandleHeight = useSharedValue(-999);
  const animatedSnapPoints = useDerivedValue(() => {
    if (
      animatedHandleHeight.value === -999 ||
      animatedContentHeight.value === 0
    ) {
      return initialSnapPoints.map(() => -999);
    }
    const contentWithHandleHeight =
      animatedContentHeight.value + animatedHandleHeight.value;

    return initialSnapPoints.map(snapPoint =>
      snapPoint === 'CONTENT_HEIGHT' ? contentWithHandleHeight : snapPoint
    );
  }, []);

  type HandleContentLayoutProps = {
    nativeEvent: {
      layout: { height: number };
    };
  };
  // callbacks
  const handleContentLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: HandleContentLayoutProps) => {
      animatedContentHeight.value = height;
    },
    [animatedContentHeight]
  );

  return {
    animatedSnapPoints,
    animatedHandleHeight,
    animatedContentHeight,
    handleContentLayout,
  };
};

export const useRadian = (value: Animated.SharedValue<number>) =>
  useDerivedValue(() => {
    'worklet';
    return `${value.value}deg`;
  });

  export const useMix = (
    progress: Animated.SharedValue<number>,
    x: number,
    y: number,
  ) => {
    'worklet';
    return useDerivedValue(() => x + progress.value * (y - x));
  };
  