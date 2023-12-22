import React from 'react';
import {StyleSheet, View, ViewStyle,Text, Platform} from 'react-native';
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
import * as Haptics from 'expo-haptics'
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
      runOnJS(setShowDraggable)(true)
      if (Platform.OS === 'ios') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
      ctx.translateX = translateX.value;
      ctx.translateY = translateY.value;
    },
    onActive: (event: any, ctx: any) => {
      translateX.value = ctx.translateX + event.translationX;
      translateY.value = ctx.translateY + event.translationY;
      // console.log(ctx.translateY + event.translationY)
      
    },
    onEnd: (_, ctx) => {
      console.log(translateY.value);
      // console.log(ctx,'ctx')
      if(translateY.value < -300 && translateY.value > -650){
        // console.log('run on add')
        runOnJS(setValue)('add',value)
        translateX.value = withSpring(ctx.translateX + _.translationX)
        translateY.value = withSpring(ctx.translateY + _.translationY)
        opacity.value = withTiming(0,{duration:1000})
      }else{
        // console.log('run on remove')
        runOnJS(setValue)('remove',value)
        opacity.value = withTiming(1,{duration:1000})
        translateX.value = withSpring(ctx.translateX + _.translationX)
        translateY.value = withSpring(ctx.translateY + _.translationY)
        // opacity.value = withTiming(0,{duration:1000})



      }
     
      // console.log(value)
      // runOnJS(setValue)(value,type)
      
      // }
    },
    onFinish(){
      runOnJS(setShowDraggable)(false)
    }
    ,
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
  },[showDraggable]);

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
