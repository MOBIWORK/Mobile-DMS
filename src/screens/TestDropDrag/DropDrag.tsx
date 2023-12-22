import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {useTheme, AppTheme} from '../../layouts/theme';
import {MainLayout} from '../../layouts';
import {AppConstant, DataConstant} from '../../const';
import ItemWidget from './ItemWidget';
import {IWidget} from '../../models/types';
import {SvgIconTypes} from '../../assets/svgIcon';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {BlurView} from 'expo-blur';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';
import Draggable from './Dragable';
import {newArrayWid} from '../../const/data.const';
import {useMMKVString} from 'react-native-mmkv';

type Props = {};

const ITEM_HEIGHT = 32;

const listToObject = (list: any[]) => {
  const values = Object.values(list);
  const object: any = {};
  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }
  return object;
};
interface MoveAbleIcon {
  id: number;
  name: string;
  icon: SvgIconTypes;
  positions: any;
  scrollY: SharedValue<number>;
  iconCount: number;
}

function clamp(value: number, lowerBound: number, upperBound: number) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(object: any, from: any, to: any) {
  'worklet';
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

const MoveAbleIcon = (props: MoveAbleIcon) => {
  const {positions, id, scrollY, iconCount} = props;

  const dimension = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(props.positions.value[props.id] * ITEM_HEIGHT);
  useAnimatedReaction(
    () => props.positions.value[props.id],
    (currentPosition, prevPosition) => {
      if (currentPosition !== prevPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * ITEM_HEIGHT);
        }
      }
    },
    [moving],
  );
  const gestureHandler = useAnimatedGestureHandler({
    onStart() {
      runOnJS(setMoving)(true);
      if (Platform.OS === 'ios') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    },
    onActive(event) {
      const positionY = event.absoluteY + props.scrollY.value;
      if (positionY <= props.scrollY.value + ITEM_HEIGHT) {
        props.scrollY.value = withTiming(0, {duration: 1500});
      } else if (
        positionY >=
        props.scrollY.value + dimension.height - ITEM_HEIGHT
      ) {
        const contentHeight = props.iconCount * ITEM_HEIGHT;
        const containerHeight = (dimension.height = inset.top - inset.bottom);
        const maxScroll = contentHeight - containerHeight;
        scrollY.value = withTiming(maxScroll, {duration: 1500});
      } else {
        cancelAnimation(scrollY);
      }
      top.value = withTiming(positionY - ITEM_HEIGHT, {duration: 16});
      const newPosition = clamp(
        Math.floor(positionY / ITEM_HEIGHT),
        0,
        iconCount - 1,
      );
      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition,
        );
      }
      if (Platform.OS === 'ios') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onFinish() {
      top.value = positions.value[id] * ITEM_HEIGHT;
      runOnJS(setMoving)(false);
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: top.value,
      zIndex: moving ? 1 : 0,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(moving ? 0.2 : 0),
      shadowRadius: 10,
      marginVertical: 10,
    };
  }, [moving]);
  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={moving ? 100 : 0} tint="light">
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{maxWidth: '80%', margin: 10}}>
            <ItemWidget
              id={id}
              name={props.name}
              icon={props.icon}
              navigate={''}
            />
          </Animated.View>
        </PanGestureHandler>
      </BlurView>
    </Animated.View>
  );
};

const DropDrag = (props: Props) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const arrWidget = useRef<IWidget[]>(DataConstant.DataWidget);
  const positions = useSharedValue(listToObject(arrWidget.current));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<any>();
  const [arr, setArr] = useState(newArrayWid);
  const [widgetFv, setWidgetFv] = useMMKVString(AppConstant.Widget);
  const [widgets, setWidgets] = useState<IWidget[]>(DataConstant.DataWidget.slice(0,4));
  const [favourites, setFavourites] = useState<IWidget[]>([]);
  useAnimatedReaction(
    () => scrollY.value,
    scrolling => scrollTo(scrollViewRef, 0, scrolling, false),
  );
  const handleScroll = useAnimatedScrollHandler(
    event => (scrollY.value = event.contentOffset.y),
  );
console.log(listToObject(widgets))
  //   const setValueArr = (item: any) => {
  //     const newArr = arrWidget.current.map(item2 =>
  //       item2.id === item.id ? {...item2, isUse: true} : item2,
  //     );
  //     setArr(newArr);
  //   };

  const getUtlFavourites = () => {
    if (widgetFv) {
      const arrN = JSON.parse(widgetFv);
   
      setFavourites(arrN);
      const mergedArray = widgets.map(item1 => {
        const matchingItem = arrN.find((item2: any) => item2.id === item1.id);
        if (matchingItem) {
          return {...item1, isUse: true};
        } else {
          return item1;
        }
      });
      setWidgets(mergedArray.slice(0,4));
    }
  };
// console.log(favourites,'favorites')
  const setValueArr = (type: string, item: IWidget) => {
    console.log(type, 'type');
    if (type === 'add') {
      // console.log(item,'item');
      if (favourites.length < 10) {
        setFavourites([...favourites, item]);
        const newArr = widgets.map(item2 =>
          item2.id === item.id ? {...item2, isUse: true} : item2,
        );
        console.log(newArr,'newArr');
        setWidgets(newArr);
      }
    } else if (type === 'remove') {
      if (favourites.length > 1) {
        setFavourites(favourites.filter(data => item.id !== data.id));
        const newArr = widgets.map(item2 =>
          item2.id === item.id ? {...item2, isUse: false} : item2,
        );
        setWidgets(newArr);
      }
    }
  };

  useLayoutEffect(() => {
    getUtlFavourites();
  

  }, []);
  return (
    <SafeAreaView style={styles.layout}>
      <Text style={styles.textHdr}>Xem thêm</Text>
      <View style={styles.containerWidget}>
        <View style={styles.containerItem}>
          {favourites &&
            favourites.map(item => (
              <View
                key={item.id}
                style={{
                  width: (AppConstant.WIDTH - 80) / 4,
                  marginLeft: 16,
                }}>
                {/* <ItemWidget
                  id={item.id}
                  name={item.name}
                  icon={item.icon}
                  navigate={item.navigate}
                /> */}
                <Draggable
                   key={item.id}
                   value={item}
                   title={item.id?.toString()}
                   setValue={setValueArr}
                   type=""
                />
              </View>
            ))}
        </View>
      </View>
      <View style={styles.flexItem}>
        {widgets &&
          widgets.map(item => {
            return (
              <Draggable
                key={item.id}
                value={item}
                title={item.id.toString()}
                setValue={setValueArr}
                type="add"
              />
            );
          })}
      </View>

      {/* <Draggable/> */}
    </SafeAreaView>
  );
};

export default DropDrag;

const createStyleSheet = (theme: AppTheme) =>
  StyleSheet.create({
    layout: {
      flex: 1,
    } as ViewStyle,
    containerItem: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
    } as ViewStyle,
    textHdr: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '500',
      color: theme.colors.text_primary,
      paddingVertical: 8,
    } as TextStyle,
    containerWidget: {
      marginTop: 22,
      paddingVertical: 16,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
      flex: 1,
    } as ViewStyle,
    flexItem: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    } as ViewStyle,
    dropZone: {
      height: 200,
      backgroundColor: '#00334d',
    },
    text: {
      marginTop: 25,
      marginLeft: 5,
      marginRight: 5,
      textAlign: 'center',
      color: '#fff',
      fontSize: 25,
      fontWeight: 'bold',
    } as TextStyle,
  });
