// import { StyleSheet, Text, View ,ViewStyle} from 'react-native'
// import React, { ReactElement, useLayoutEffect, useState } from 'react'
// import { MainLayout } from '../../layouts'
// import Animated from 'react-native-reanimated';
// import { Widget } from '../../const/app.const';
// import { IWidget } from '../../models/types';
// import { useMMKVString } from 'react-native-mmkv';
// import { AppConstant, DataConstant } from '../../const';
// import IconList from './IconList';
// import ItemWidget from './ItemWidget';

// type Props = {}

// export const MARGIN_TOP = 150;
// export const MARGIN_LEFT = 32;
// export const NUMBER_OF_LINES = 3;
// export const WORD_HEIGHT = 55;
// export const SENTENCE_HEIGHT = (NUMBER_OF_LINES - 1) * WORD_HEIGHT;

// export type SharedValues<
//   T extends Record<string, string | number | boolean>
// > = {
//   [K in keyof T]: Animated.SharedValue<T[K]>;
// };

// export type Offset = SharedValues<{
//   order: number;
//   width: number;
//   x: number;
//   y: number;
//   originalX: number;
//   originalY: number;
// }>;

// const isNotInBank = (offset: Offset) => {
//   "worklet";
//   return offset.order.value !== -1;
// };

// const byOrder = (a: Offset, b: Offset) => {
//   "worklet";
//   return a.order.value > b.order.value ? 1 : -1;
// };

// export const lastOrder = (input: Offset[]) => {
//   "worklet";
//   return input.filter(isNotInBank).length;
// };

// const DropDrag = (props: Props) => {
//   const [favourites, setFavourites] = useState<IWidget[]>([]);
//   const [widgetFv, setWidgetFv] = useMMKVString(AppConstant.Widget);
//   const [widgets, setWidgets] = useState<IWidget[]>(DataConstant.DataWidget.slice(0,4));
//   const getUtlFavourites = () => {
//     if (widgetFv) {
//       const arrN = JSON.parse(widgetFv);

//       setFavourites(arrN);
//       const mergedArray = widgets.map(item1 => {
//         const matchingItem = arrN.find((item2: any) => item2.id === item1.id);
//         if (matchingItem) {
//           return {...item1, isUse: true};
//         } else {
//           return item1;
//         }
//       });
//       setWidgets(mergedArray.slice(0,4));
//     }
//   };

//   useLayoutEffect(() => {
//     getUtlFavourites();
//   }, []);

//   return (
//     <MainLayout>
//       <View style={{backgroundColor:'red',flex:1}}>
//         <IconList>
//         {favourites &&
//         favourites.map((item, index) => {
//           return (
//          <View style={styles.row} key={item.id}>
//               <ItemWidget {...item}  />
//          </View>

//           );
//         })}
//         </IconList>

//       </View>

//       <IconList>
//         {widgets.map((word) => (
//           <ItemWidget key={word.id} {...word} />
//         ))}
//       </IconList>
//     </MainLayout>
//   )
// }

// export default DropDrag

// const styles = StyleSheet.create({
//   row: {
//     // flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     opacity: 0,
//   } as ViewStyle,
// })

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {MainLayout} from '../../layouts';
import {Accordion, Block, BottomSheet} from '../../components/common';
import {BottomSheetRefProps} from '../../components/common/CustomBottomSheet/index';


type Props = {};

const DropDrag = (props: Props) => {
  const snapPoint = useMemo(() => ['20%'], []);
  const [show, setShow] = useState(false);
  const ref = useRef<BottomSheetRefProps>(null);

  const onPress = useCallback(() => {
    // const isActive = ref?.current?.isActive();
    // console.log(isActive, 'isActive');
    // if (isActive) {
    //   ref?.current?.scrollTo(0);
    // } else {
    //   ref?.current?.scrollTo(-SCREEN_HEIGHT * 0.4);
    // }
  }, []);

  const setShowAcc = () => {
    setShow(!show);
  };

  return (
    <>
      <MainLayout style={{backgroundColor: 'white'}}>
        <TouchableOpacity onPress={() => setShow(true)}>
          <Block width={40} height={40} borderRadius={40} colorTheme="blue700">
            <Text>aaaaaa</Text>
          </Block>
        </TouchableOpacity>
        <Accordion   title='â'  type='nested' >
            <Block  colorTheme='white'  justifyContent='center'  padding={10}>
              <Block>
                <Text>sss</Text>
              </Block>
              <Text>aaaaaa</Text>
            </Block>
        </Accordion>
        <Text>DropDrag</Text>
      </MainLayout>
    </>
  );
};

export default DropDrag;

const styles = StyleSheet.create({});
