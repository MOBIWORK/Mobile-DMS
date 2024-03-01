import {Pressable, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React, {ReactElement, useEffect, useState} from 'react';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  runOnUI,
  measure,
  withTiming,
} from 'react-native-reanimated';
import Chevron from './AnimatedArrow';
import {Block} from '../Block';
import {AppText as Text} from '../AppText';
import {useTheme, AppTheme} from '../../../layouts/theme';

type Regular = {
  children: ReactElement | ReactElement[];
  title: string;
  type: 'regular';
  containerStyle?: ViewStyle;
  titleContainerStyle?: ViewStyle;
  contentStyle?:ViewStyle
};
type Nested = {
  children: ReactElement | ReactElement[];
  type: 'nested';
  title: string;
  containerStyle?: ViewStyle;
  titleContainerStyle?: ViewStyle;
  contentStyle?:ViewStyle

};

type Props = Regular | Nested;

const Accordion = (props: Props) => {
  const listRef = useAnimatedRef<Animated.View>();
  const heightValue = useSharedValue(0);
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const styles = rootStyle(theme);

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  useEffect(() => {
    setTimeout(() => {
      if (heightValue.value === 0) {
        runOnUI(() => {
          'worklet';
          heightValue.value = withTiming(measure(listRef)!.height);
        })();
      } else {
        heightValue.value = withTiming(0);
      }
      setShow(!show);
    }, 500);
  }, []);

  return props.type === 'regular' ? (
    <Block
      style={[styles.container, props.containerStyle]}
      colorTheme="bg_neutral">
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
        style={[styles.titleContainer('regular'), props.titleContainerStyle]}>
        <Text fontSize={14} fontWeight="500" colorTheme="text_primary">
          {props.title}
        </Text>
        <Chevron show={show} />
      </Pressable>
      <Animated.View style={heightAnimationStyle}>
        <Animated.View style={styles.contentContainer} ref={listRef}>
          {props.type === 'regular' && <>{props.children}</>}
        </Animated.View>
      </Animated.View>
    </Block>
  ) : (
    <Block style={[styles.container, props.containerStyle]}>
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
        style={styles.titleContainer('nested')}>
        <Text fontSize={14} fontWeight="500" colorTheme="text_secondary">
          {props.title}
        </Text>
        <Chevron show={show} />
      </Pressable>
      <Animated.View style={[heightAnimationStyle]}>
        <Animated.View style={[styles.contentContainer,props.contentStyle]} ref={listRef}>
          {props.children}
        </Animated.View>
      </Animated.View>
    </Block>
  );
};

export default Accordion;

const rootStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      // marginHorizontal: 8,
      marginBottom: 10,
      borderRadius: 14,
      overflow: 'hidden',
    } as ViewStyle,

    titleContainer: (type: 'nested' | 'regular') =>
      ({
        // padding: 20,
        paddingHorizontal: type === 'nested' ? 0 : 16,
        paddingTop: type === 'nested' ? 10 : 16,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      } as ViewStyle),
    contentContainer: {
      position: 'absolute',
      width: '100%',
      top: 0,
      // paddingHorizontal
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
