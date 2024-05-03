import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { Block } from "../../../components/common";

const TOUCH_SLOP = 5;
const TIME_TO_ACTIVATE_PAN = 400;

 const DragComponent = (props:any) => {
  const touchStart = useSharedValue({ x: 0, y: 0, time: 0 });

  const gesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((e:any) => {
      touchStart.value = {
        x: e.changedTouches[0].x,
        y: e.changedTouches[0].y,
        time: Date.now(),
      };
    })
    .onTouchesMove((e, state) => {
      if (Date.now() - touchStart.value.time > TIME_TO_ACTIVATE_PAN) {
        console.log(state,'date')
        state.activate();
      } else if (
        Math.abs(touchStart.value.x - e.changedTouches[0].x) > TOUCH_SLOP ||
        Math.abs(touchStart.value.y - e.changedTouches[0].y) > TOUCH_SLOP
      ) {
        state.fail();
      }
    })
    .onUpdate(() => {
      console.log('pan update');
    });

  return (
    <GestureDetector gesture={gesture}>
      <Block>{props.children}</Block>
    </GestureDetector>
  );
};
export default DragComponent