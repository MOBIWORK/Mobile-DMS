import { Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../layouts/theme';

type Props = {
    width? : number,
    height? : number,
    borderRadius? :number,
    color? : string
};

const SkeletonLoading = ({width,height,borderRadius,color}: Props) => {
    const theme = useTheme();
    const loadingAnimation = useRef(new Animated.Value(1)).current;
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
        <Animated.View
            style={[
                {
                    width : width ? width : "100%" ,
                    height : height ? height : 10 ,
                    borderRadius: borderRadius ? borderRadius : 0 ,
                    opacity: loadingAnimation,
                    backgroundColor : color ? color : theme.colors.bg_neutral
                }
            ]}>
        </Animated.View>
    );
};

export default SkeletonLoading;