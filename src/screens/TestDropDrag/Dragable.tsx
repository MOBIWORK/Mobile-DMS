import React from 'react';
import {StyleSheet, View, ViewStyle,Text} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

interface DragAbleItem{
  title:string,
  setValue:(type:string,item:any) => void,
  value:any,
  type:string
}


const Draggable = ({value,title,setValue,type}:DragAbleItem) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const showDraggable = useSharedValue(true);
  const [draggable, setShowDraggable] = React.useState(false);
  const isDropArea = (ctx: any) => {
    'worklet';
    return ctx.startY < 200;
  };

  type ContextInterface = {
    translateX: number;
    translateY: number;
  };

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextInterface
  >({
    onStart: (_, ctx: any) => {
      ctx.translateX = translateX.value;
      ctx.translateY = translateY.value;
    },
    onActive: (event: any, ctx: any) => {
      translateX.value = ctx.translateX + event.translationX;
      translateY.value = ctx.translateY + event.translationY;
    },
    onEnd: (_, ctx) => {
      console.log(translateY.value);
      // console.log(ctx,'ctx')
      if(translateY.value < -300 && translateY.value > -500){
        runOnJS(setValue)(value,'add')
      }else{
        runOnJS(setValue)(value,'remove')

      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      // console.log(value)
      // runOnJS(setValue)(value,type)
      
      // }
    },
  });

  const handleDrop = () => {
    // Non-animated JavaScript code to handle drop
    console.log('Item dropped!');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
      opacity: opacity.value,
      // display: showDraggable.value ? "flex" : "none",
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.circle, animatedStyle]} >
          <Text>{title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 10,
  } as ViewStyle,
  circle: {
    backgroundColor: 'skyblue',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    margin: 10,
    justifyContent:'center',
    alignItems:'center'
  } as ViewStyle,
});

export default Draggable;
