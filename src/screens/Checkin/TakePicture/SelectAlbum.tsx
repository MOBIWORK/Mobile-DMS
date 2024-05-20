import React, {FC, useMemo, useState} from 'react';
import {IFilterType} from '../../../components/common/FilterListComponent';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {AppBottomSheet} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageAssets} from '../../../assets';
import {Button} from 'react-native-paper';
import {IAlbumImage} from '../../../models/types';
import {useTranslation} from 'react-i18next';
import {AlbumBottomSheet} from '.';

const SelectAlbum: FC<SelectAlbumProps> = ({
  bottomSheetRef,
  data,
  setData,
  setAlbumImageData,
  albumImageData,
}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {t: getLabel} = useTranslation();
  const {bottom} = useSafeAreaInsets();

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [curData, setCurData] = useState<AlbumBottomSheet[] | undefined>(data);

  const handleItem = (item: AlbumBottomSheet) => {
    const newData =
      curData &&
      curData.map((itemCur, index) => {
        if (item.value === itemCur.value) {
          return {
            ...itemCur,
            id: itemCur.id,
            isSelected: !itemCur.isSelected,
            numPicsRequired: itemCur.numPicsRequired,
          };
        } else {
          return itemCur;
        }
      });
    if (newData) {
      const selectedItem = newData.find(
        item => item.value === item.value && item.isSelected,
      );
      if (selectedItem) {
        const selectedIndex = newData.indexOf(selectedItem);
        newData.splice(selectedIndex, 1); // Remove selected item
        newData.unshift(selectedItem); // Add it to the beginning of the array
      }
    }
    setCurData(newData);
  };

  const handleAlbum = (selectedItem: AlbumBottomSheet[]) => {
    const selectedData = selectedItem
      .filter(item => item.isSelected)
      .map((selected, selectedIdx) => ({
        id: selected.id,
        label: selected.label,
        image: ['IconCamera'],
        numberImageReq: selected.numPicsRequired,
      }));

    const albumImageDataCopy = [...albumImageData];

    selectedData.forEach(selectedItem => {
      const existingIndex = albumImageDataCopy.findIndex(
        item => item.label === selectedItem.label,
      );

      if (existingIndex === -1 && !('isSelected' in selectedItem)) {
        const indexToRemove = albumImageDataCopy.findIndex(
          item => item.label === selectedItem.label,
        );
        if (indexToRemove !== -1) {
          albumImageDataCopy.splice(indexToRemove, 1);
        }
      }
    });

    // console.log('selectedItem2', selectedData);

    if (selectedData.length > 0) {
      if (albumImageData.length > 0) {
        setAlbumImageData([
          ...selectedData.map((item, index) => ({
            id: item.id, // Adjust this based on your actual structure
            label: item.label,
            image: albumImageData[index]?.image
              ? albumImageData[index]?.image
              : item.image.map(image => ({url: image})),
            numberImageReq: item.numberImageReq,
          })),
        ]);
      } else {
        setAlbumImageData([
          ...selectedData.map(item => ({
            id: item.id, // Adjust this based on your actual structure
            label: item.label,
            image: item.image.map(image => ({url: image})),
            numberImageReq: item.numberImageReq,
          })),
        ]);
      }
    } else {
      setAlbumImageData([]);
    }
    return selectedData;
  };

  const ItemAlbum: FC<ItemAlbumProps> = ({item}) => {
    return (
      <Pressable
        style={styles.row}
        onPress={() => {
          handleItem(item);
        }}>
        <Text
          style={[
            styles.itemText,
            {fontWeight: item.isSelected ? '500' : '400'},
          ]}>
          {item.label}
        </Text>
        <Image
          source={ImageAssets.CheckIcon}
          style={{width: 24, height: 24}}
          tintColor={
            item.isSelected ? theme.colors.primary : theme.colors.bg_default
          }
        />
      </Pressable>
    );
  };

  const ListAlbumSelected = () => {
    return (
      <View style={styles.listAlbumStyle}>
        {curData &&
          curData
            .filter(item => item.isSelected)
            .map((item, index) => {
              return (
                <Button
                  key={index}
                  onPress={() => {
                    handleItem(item);
                  }}
                  style={{backgroundColor: theme.colors.bg_neutral}}
                  contentStyle={{flexDirection: 'row-reverse'}}
                  mode={'contained-tonal'}
                  labelStyle={{
                    color: theme.colors.text_primary,
                    fontWeight: '400',
                    fontSize: 13,
                  }}
                  icon={'close'}>
                  {item.label}
                </Button>
              );
            })}
      </View>
    );
  };

  return (
    <>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        // @ts-ignore
      >
        <BottomSheetScrollView
          style={{paddingBottom: bottom + 16, paddingHorizontal: 16}}
          onLayout={handleContentLayout}>
          <View>
            <View style={styles.row}>
              <Text
                onPress={() => {
                  if (albumImageData?.length === 0) {
                    setCurData(
                      prevState =>
                        prevState &&
                        prevState.map(item => {
                          return {...item, isSelected: false};
                        }),
                    );
                  }
                  bottomSheetRef.current?.close();
                }}
                style={styles.cancelTxt}>
                {getLabel('cancel')}
              </Text>
              <Text style={styles.albumTxt}>Album</Text>
              <Text
                onPress={() => {
                  if (curData) {
                    setData(curData);
                    handleAlbum(curData);
                  }
                  bottomSheetRef.current?.close();
                }}
                style={styles.confirmTxt}>
                {getLabel('confirm')}
              </Text>
            </View>
            {curData && curData?.length > 0 ? (
              <>
                <ListAlbumSelected />
                {curData.map((item, index) => {
                  return <ItemAlbum key={index} item={item} />;
                })}
              </>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.text_primary,
                  textAlign: 'center',
                  padding: 16,
                }}>
                {getLabel('noAlbum')}
              </Text>
            )}
          </View>
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
};
interface SelectAlbumProps {
  bottomSheetRef: any;
  data: IFilterType[] | undefined;
  setData: (data: IFilterType[]) => void;
  setAlbumImageData: React.Dispatch<React.SetStateAction<IAlbumImage[]>>;
  albumImageData: IAlbumImage[];
}
interface ItemAlbumProps {
  item: IFilterType;
}
export default SelectAlbum;
const createStyleSheet = (theme: ExtendedTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 6,
    } as ViewStyle,
    itemText: {
      color: theme.colors.text_primary,
      fontSize: 16,
    } as TextStyle,
    cancelTxt: {
      color: theme.colors.text_disable,
      fontSize: 16,
      fontWeight: '500',
      width: 100,
    } as TextStyle,
    albumTxt: {
      color: theme.colors.text_primary,
      fontSize: 18,
      fontWeight: '500',
    } as TextStyle,
    confirmTxt: {
      color: theme.colors.action,
      fontSize: 16,
      fontWeight: '500',
      width: 100,
      textAlign: 'right',
    } as TextStyle,
    listAlbumStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      rowGap: 8,
      columnGap: 16,
      flexWrap: 'wrap',
      marginTop: 24,
      marginBottom: 16,
    } as ViewStyle,
  });
