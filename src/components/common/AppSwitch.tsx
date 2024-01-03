import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated, {
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {useTheme,AppTheme} from '../../layouts/theme'
type Props = {
  onSwitch: () => void;
  title?: string;
};

const AppSwitch = (props: Props) => {
  const theme = useTheme()
  const styles = rootStyles(theme)
  const {onSwitch} = props;
  // const dispatch = useDispatch()
  const switchTranslate = useSharedValue(0);
  // state for activate Switch
  const [active, setActive] = useState(false);
  // Progress Value
  const progress = useDerivedValue(() => {
    return withTiming(active ? 22 : 0);
  });
  const textValue = useSharedValue(0);
  const [isText, setIsText] = useState<boolean>(
    props.title !== '' || props.title !== undefined ? true : false,
  );

  // const progress = useSharedValue(() =>{return withTiming(active ? 22 :0)})

  useEffect(() => {
    if (props.title != '' && props.title != undefined) {
      setIsText(true);
    } else {
      setIsText(false);
    }

    if (active) {
      if (isText === true) {
        // console.log('run case')
        switchTranslate.value = 68;
        textValue.value = 10;
      } else if (props.title === undefined) {
        // console.log('run case 2')
        
        switchTranslate.value = 22;
        // textValue.value = 60;
      } else {
        // console.log('run case 3')
        switchTranslate.value = 22;
        // textValue.value = 60;
      }
    } else {
      switchTranslate.value = 4;
      textValue.value = 28;

      // setText(false);
    }
  }, [active, switchTranslate, onSwitch, props.title,textValue]);
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
  }, [onSwitch]);

  const textSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(textValue.value, {
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
      backgroundColor: interpolateColor(
        progress.value,
        [0, 22],
        ['#FF5630', '#22C55E'],
      ),
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setActive(!active);
        onSwitch();
        // setText(!text);
      }}>
      <Animated.View
        style={[styles.container(props.title), backgroundColorStyle]}>
        <Animated.View
          style={[styles.circle(props.title), customSpringStyles]}
        />
        <Animated.Text
          style={[styles.positionText(active),textSpringStyles] }
          >
          {props.title}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AppSwitch;

const rootStyles = (theme:AppTheme) =>StyleSheet.create({
  container: (text: string | undefined) =>
    ({
      width: text != undefined ? 90 : 50,
      height: 28,
      borderRadius: 30,
      justifyContent: 'center',
      // backgroundColor: '#F2F5F7',
    } as ViewStyle),
  circle: (text: string | undefined) =>
    ({
      width: text != undefined ? 18 : 24,
      height: text != undefined ? 18 : 24,
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
    } as ViewStyle),
  positionText:(isText:boolean) =>({
    position: 'absolute',
    left: 5,
    top: 6,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    fontSize:12,
    fontWeight:'400',
    color: theme.colors.white
  }) as TextStyle,
});
