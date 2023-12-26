import {Animated, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useEffect} from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';

type Props = {};

const ItemNotiLoading = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const loadingAnimation = React.useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;

  const animationFade = () => {
    Animated.sequence([
      Animated.timing(loadingAnimation, {
        toValue: 0.4,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loadingAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => animationFade());
  };

  useEffect(() => {
    animationFade();
  }, []);

  return (
    <Animated.View style={{opacity: loadingAnimation}}>
      <View style={styles.containItem}>
        <Animated.View style={[styles.square, {opacity: loadingAnimation}]} />
        <View style={{flex: 1}}>
          <Animated.View
            style={[styles.contentTitle, {opacity: loadingAnimation}]}
          />
          <Animated.View
            style={[styles.content, {opacity: loadingAnimation}]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default ItemNotiLoading;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.bg_disable,
    } as ViewStyle,
    containItem: {
      backgroundColor: theme.colors.bg_default,
      height: 90,
      marginHorizontal: 16,
        // marginVertical:20,
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    square: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.bg_disable,
      padding: 10,
    } as ViewStyle,
    content: {
      height: 30,
      backgroundColor: theme.colors.bg_disable,
      width: '100%',
      marginLeft: 10,
    } as ViewStyle,
    contentTitle: {
      height: 10,
      backgroundColor: theme.colors.bg_disable,
      width: '50%',
      marginLeft: 10,
      marginBottom: 5,
    } as ViewStyle,
  });
