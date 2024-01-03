import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactElement, useState} from 'react';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  runOnUI,
  measure,
  withTiming,
} from 'react-native-reanimated';
import Chevron from './AnimatedArrow';
import AccordionNested from './AccordionNested';
import { Colors } from '../../../assets';

type Regular = {
  children: ReactElement | ReactElement[];
  title: string;
  type: 'regular';
};
type Nested = {
  children: ReactElement | ReactElement[];
  type: 'nested';
  title: string;
};

type Props = Regular | Nested;

const Accordion = (props: Props) => {
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const [show, setShow] = useState(false);

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  return props.type === 'regular' ? (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (heightValue.value === 0) {
            runOnUI(() => {
              'worklet';
              heightValue.value = withTiming(measure(listRef)!.height);
            })();
          } else {
            heightValue.value = withTiming(0);
          }
          setShow(!show);
        }}
        style={styles.titleContainer}>
        <Text style={styles.textTitle}>{props.title}</Text>
        <Chevron show={show} />
      </Pressable>
      <Animated.View style={heightAnimationStyle}>
        <Animated.View style={styles.contentContainer} ref={listRef}>
          {props.type === 'regular' && <>{props.children}</>}
        </Animated.View>
      </Animated.View>
    </View>
  ) : (
    <View>
      <Pressable
        onPress={() => {
          if (heightValue.value === 0) {
            runOnUI(() => {
              'worklet';
              heightValue.value = withTiming(measure(listRef)!.height);
            })();
          } else {
            heightValue.value = withTiming(0);
          }
          setShow(!show);
        }}
        style={styles.titleContainer}>
        <Text style={styles.textTitle}>{props.title}</Text>
        <Chevron show={show} />
      </Pressable>
      <Animated.View style={[heightAnimationStyle, styles.container]}>
        <Animated.View style={styles.contentContainer} ref={listRef}>
          {props.children}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    marginHorizontal: 10,
    // borderWidth:1,
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
  } as ViewStyle,
  textTitle: {
    fontSize: 16,
    color: 'black',
  } as TextStyle,
  titleContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  contentContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
  } as ViewStyle,
  content: {
    padding: 20,
    backgroundColor: '#D6E1F0',
  } as ViewStyle,
  textContent: {
    fontSize: 14,
    color: 'black',
  } as TextStyle,
});
