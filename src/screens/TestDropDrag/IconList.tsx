import {StyleSheet, Text, View, ViewStyle, Dimensions} from 'react-native';
import React, {ReactElement, useState, useLayoutEffect} from 'react';
import {runOnUI, useSharedValue, runOnJS} from 'react-native-reanimated';
import {MARGIN_LEFT, NUMBER_OF_LINES, WORD_HEIGHT} from './DropDrag';
import SortableWord from './Dragable';
import {IWidget} from '../../models/types';
import {useMMKVString} from 'react-native-mmkv';
import {AppConstant, DataConstant} from '../../const';
import ItemWidget from './ItemWidget';
interface WordListProps {
  children: ReactElement<{id: number}>[];
}
const containerWidth = Dimensions.get('window').width - MARGIN_LEFT * 2;
const IconList = ({children}: WordListProps) => {
  const [ready, setReady] = useState(false);
  const [favourites, setFavourites] = useState<IWidget[]>([]);
  const [widgetFv, setWidgetFv] = useMMKVString(AppConstant.Widget);
  const [widgets, setWidgets] = useState<IWidget[]>(
    DataConstant.DataWidget.slice(0, 4),
  );

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
      setWidgets(mergedArray.slice(0, 4));
    }
  };

  useLayoutEffect(() => {
    getUtlFavourites();
  }, []);

  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));
  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: {x, y, width, height},
                },
              }) => {
                const offset = offsets[index]!;
                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalX.value = x;
                offset.originalY.value = y;
                runOnUI(() => {
                  'worklet';
                  if (offsets.filter(o => o.order.value !== -1).length === 0) {
                    runOnJS(setReady)(true);
                  }
                })();
              }}>
              {child}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
     

      {children.map((child, index) => (
        <SortableWord
          key={index}
          offsets={offsets}
          index={index}
          containerWidth={containerWidth}>
          {child}
        </SortableWord>
      ))}
    </View>
  );
};

export default IconList;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0,
  } as ViewStyle,
  container: {
    flex: 1,
    margin: MARGIN_LEFT,
  } as ViewStyle,
});
