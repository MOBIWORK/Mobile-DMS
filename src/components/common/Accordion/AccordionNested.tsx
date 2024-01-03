import {Pressable, StyleSheet, Text} from 'react-native';
import React, {ReactElement} from 'react';
import isEqual from 'react-fast-compare';

import Animated, {
  
  useAnimatedStyle,
  useSharedValue,
  useAnimatedRef,
  runOnUI,
  measure,
  useDerivedValue,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

import {AppTheme, useTheme} from '../../../layouts/theme';
import {ViewStyle} from 'react-native';
import {Block} from '../Block';
import { TextStyle } from 'react-native';
import Chevron from './AnimatedArrow';

type Props = {
  parentHeighValue: SharedValue<number>;
  children:ReactElement | ReactElement[]
  title:string
};

const AccordionNested = ({parentHeighValue,children,title}: Props) => {
  //   const {show =false, setShow} = props;
  const theme = useTheme();
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const open = useSharedValue(false);
  const progressValue = useDerivedValue(() =>
    open.value ? withTiming(1) : withTiming(0),
  );
  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));
 

  return (
    <Block style={styles(theme).container}>
      <Pressable
        onPress={() => {
          if (heightValue.value === 0) {
            runOnUI(() => {
              'worklet';
              heightValue.value = withTiming(measure(listRef)!.height);
              parentHeighValue.value = withTiming(
                parentHeighValue.value + measure(listRef)!.height,
              );
            })();
          } else {
            runOnUI(() => {
              'worklet';
              heightValue.value = withTiming(0);
              parentHeighValue.value = withTiming(
                parentHeighValue.value - measure(listRef)!.height,
              );
            })();
          }
          open.value = !open.value;
        }}
        style={styles(theme).titleContainer}>
        <Text style={styles(theme).textTitle}>{title}</Text>
        <Chevron progress={progressValue} />
      </Pressable>
      <Animated.View style={heightAnimationStyle}>
        <Animated.View style={styles(theme).contentContainer} ref={listRef}>
              {children}
        </Animated.View>
      </Animated.View>
    </Block>
  );
};

export default React.memo(AccordionNested, isEqual);

const styles = (theme: AppTheme) =>
  StyleSheet.create({
   
    container: {
      backgroundColor: '#E3EDFB',
      marginHorizontal: 10,
      marginVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    textContent: {
      fontSize: 14,
      color: 'black',
    } as TextStyle,
  });
