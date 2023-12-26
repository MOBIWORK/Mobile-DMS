import {StyleSheet, Text, View, Animated,ViewStyle} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';

type Props = {};

const CardLoading = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyle(theme);
  const loadingAnimation = useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;
  const item = useRef([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
  ]).current;
  const animationFade = () => {
    Animated.sequence([
      Animated.timing(loadingAnimation, {
        toValue: 0.4,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loadingAnimation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => animationFade());
  };

  useEffect(() => {
    animationFade();
  }, []);

  return (
    <Animated.View style={[styles.cardContain,{opacity:loadingAnimation}]}>
    </Animated.View>
  );
};

export default CardLoading;

const rootStyle = (theme: AppTheme) => StyleSheet.create({
    cardContain:{   
        width:361,
        height:295,
        backgroundColor:theme.colors.bg_disable,
        borderRadius:16
    } as ViewStyle
});
