import {
  Animated,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {AppTheme, useTheme} from '../../../layouts/theme';

type Props = {
  loading: boolean;
};

const ItemLoading = (props: Props) => {
  const {loading} = props;
  const loadingAnimation = useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;
  const theme = useTheme();
  const styles = rootStyles(theme);
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
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => animationFade());
  };

  useEffect(() => {
    animationFade();
  }, [loading]);

  const renderScene = useCallback(() => {
    return (
      <Animated.View style={[styles.root, {opacity: loadingAnimation}]}>
        
      </Animated.View>
    );
  }, []);

  return (
    <FlatList
      data={item}
      style={styles.containItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={true}
      renderItem={renderScene}
    />
  );
};

export default ItemLoading;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      width: 50,
      height: 50,
      backgroundColor: theme.colors.bg_disable,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 8,
      padding: 9,
      borderRadius:8
    //   flexDirection:'row'
    } as ViewStyle,
    containItem: {
      flexDirection: 'row',
      flexWrap: 'wrap',
        padding:10
    } as ViewStyle,
  });
