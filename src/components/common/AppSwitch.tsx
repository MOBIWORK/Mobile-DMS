import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated, {
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from '../../layouts/theme';
import { useDispatch } from 'react-redux';

type Props = {

  onSwitch: () => void;
};

const AppSwitch = (props: Props) => {
  const {onSwitch} = props;
  // const dispatch = useDispatch()
  const switchTranslate = useSharedValue(0);
  // state for activate Switch
  const [active, setActive] = useState(false);
  // Progress Value
  const progress = useDerivedValue(() => {
    return withTiming(active ? 22 : 0);
  });

// const progress = useSharedValue(() =>{return withTiming(active ? 22 :0)})

  useEffect(() => {
    if (active) {
      switchTranslate.value = 22;
      
    } else {
      switchTranslate.value = 4;
    }
  }, [active, switchTranslate,onSwitch]);
  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(switchTranslate.value, {
            mass: 1,
            damping: 15,
            stiffness: 120,
            overshootClamping: false,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
          }),
        },
      ],
    };
  },[onSwitch]);
  const backgroundColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:interpolateColor(
        progress.value,
        [0,22],
        ['#919EAB7A','#22C55E'],
      ),
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActive(!active);
        onSwitch()
      }}>
      <Animated.View style={[styles.container, backgroundColorStyle]}>
        <Animated.View style={[styles.circle, customSpringStyles]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AppSwitch;

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 28,
        borderRadius: 30,
        justifyContent: 'center',
        backgroundColor: '#F2F5F7',
      },
      circle: {
        width: 24,
        height: 24,
        borderRadius: 30,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 4,
      },
});
