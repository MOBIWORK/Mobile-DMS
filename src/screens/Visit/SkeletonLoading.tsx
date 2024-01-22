import {StyleSheet, View, Animated, ViewStyle, FlatList} from 'react-native';
import React, {useEffect, useRef, useCallback} from 'react';
import {AppTheme, useTheme} from '../../layouts/theme';
import {AppText, SvgIcon} from '../../components/common';

type Props = {
  loading: boolean;
};

const SkeletonLoading = (props: Props) => {
  const theme = useTheme();
  const loadingAnimation = useRef(new Animated.Value(1)).current;
  const styles = styleLoading(theme);
  const item = React.useRef([
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
  }, []);

  const renderScene = useCallback(() => {
    return (
      <Animated.View style={[{opacity: loadingAnimation}]}>
        <View style={styles.cardCourseContainer}>
          <View style={styles.containTitleCard}>
            <Animated.View
              style={[styles.containTitle, {opacity: loadingAnimation}]}>
              <SvgIcon source="IconUser" size={20} />
              <Animated.View
                style={[styles.skeletonView, {opacity: loadingAnimation}]}
              />
            </Animated.View>
            <Animated.View
              style={[styles.containTitle, {opacity: loadingAnimation}]}>
              <Animated.View
                style={[styles.skeletonView, {opacity: loadingAnimation}]}
              />
            </Animated.View>
          </View>
          <View style={{marginHorizontal: 16}}>
            <Animated.View
              style={[styles.lines, {opacity: loadingAnimation}]}
            />
          </View>
          <Animated.View
            style={[styles.containContent, {opacity: loadingAnimation}]}>
            <SvgIcon source="MapPin" size={20} />
            <Animated.View
              style={[
                styles.skeletonView,
                {opacity: loadingAnimation, width: '90%'},
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[styles.containContent, {opacity: loadingAnimation}]}>
            <SvgIcon source="Phone" size={20} />
            <Animated.View
              style={[styles.skeletonView, {opacity: loadingAnimation}]}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.containContent,
              styles.addToContainContent,
              {
                opacity: loadingAnimation,
              },
            ]}>
            <View style={styles.lastView} />
            <Animated.View
              style={[styles.skeletonView, {opacity: loadingAnimation}]}
            />
          </Animated.View>
        </View>
      </Animated.View>
    );
  }, [props.loading]);

  return (
    <View style={styles.root}>
      <FlatList
        data={item}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderScene}
      />
    </View>
  );
};

export default SkeletonLoading;

export const styleLoading = (theme: AppTheme) =>
  StyleSheet.create({
    render: {
      marginVertical: 8,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.bg_default,
      // rowGap: 8,
    } as ViewStyle,
    cardCourseContainer: {
      // height: 133,
      // flexDirection: 'row',
      backgroundColor: theme.colors.bg_neutral,
      marginHorizontal: 16,
      // justifyContent: 'space-between',
      borderRadius: 16,
      paddingVertical: 10,
      marginVertical: 16,
    } as ViewStyle,
    containLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    } as ViewStyle,
    skeletonView: {
      width: 98,
      height: 15,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    containContentLoading: {
      flex: 1,
      paddingBottom: 4,
    } as ViewStyle,
    skeletonSecondView: {
      marginTop: 10,
      width: 250,
      height: 40,
      borderRadius: 4,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    root: {
      // flex: 1,
      backgroundColor: theme.colors.white,
    } as ViewStyle,
    containTitle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    } as ViewStyle,
    lines: {height: 1, marginVertical: 8, backgroundColor: theme.colors.black},
    containTitleCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.bg_neutral,
      marginHorizontal: 16,
      justifyContent: 'space-between',
      // width:'90%'
    } as ViewStyle,
    containContent: {
      // justifyContent: 'center',
      // alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: 16,
    } as ViewStyle,
    addToContainContent: {
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
    } as ViewStyle,
    lastView: {
      width: 91,
      height: 37,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
    } as ViewStyle,
  });
