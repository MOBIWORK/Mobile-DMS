import React, {FC, useMemo, useState} from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {IStaff} from '../../../models/types';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {AppBottomSheet, AppCheckBox} from '../../../components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SelectedStaff: FC<SelectedStaffProps> = ({
  bottomSheetRef,
  data,
  setData,
  onCancel,
}) => {
  const theme = useTheme();
  const styles = createStyleSheet(theme);
  const {bottom} = useSafeAreaInsets();

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [curData, setCurData] = useState<IStaff[]>(data);

  const [disableConfirm, setDisableConfirm] = useState<boolean>(true);

  const handleItem = (itemData: IStaff) => {
    const newData = curData.map(item => {
      if (itemData.id === item.id) {
        return {...item, isSelected: !item.isSelected};
      } else {
        return item;
      }
    });
    setCurData(newData);
    setDisableConfirm(newData.filter(item => item.isSelected).length === 0);
  };

  const RenderItem: FC<RenderItemProps> = ({item}) => {
    return (
      <Pressable>
        <Pressable
          onPress={() => handleItem(item)}
          style={{
            marginVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 10,
            }}>
            <Avatar.Image
              source={{
                uri: 'https://th.bing.com/th/id/OIG.ey_KYrwhZnirAkSgDhmg',
              }}
              size={48}
            />
            <View style={{gap: 4}}>
              <Text
                style={{
                  color: theme.colors.text_primary,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  color: theme.colors.text_secondary,
                }}>
                {item.position}
              </Text>
            </View>
          </View>
          <AppCheckBox
            status={item.isSelected}
            onChangeValue={() => handleItem(item)}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: bottom + 16, paddingHorizontal: 16}}
          onLayout={handleContentLayout}>
          <View>
            <View style={styles.row}>
              <Text
                onPress={() => {
                  setCurData(data);
                  onCancel();
                  bottomSheetRef.current?.close();
                }}
                style={styles.cancelTxt}>
                Hủy
              </Text>
              <Text style={styles.albumTxt}>Album</Text>
              <Text
                disabled={disableConfirm}
                onPress={() => {
                  setData(curData);
                  bottomSheetRef.current?.close();
                }}
                style={[
                  styles.confirmTxt,
                  {
                    color: disableConfirm
                      ? theme.colors.text_disable
                      : theme.colors.action,
                  },
                ]}>
                Xác nhận
              </Text>
            </View>
            {curData.map((item, index) => {
              return <RenderItem key={index} item={item} />;
            })}
          </View>
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
};
interface SelectedStaffProps {
  bottomSheetRef: any;
  onCancel: () => void;
  data: IStaff[];
  setData: (data: IStaff[]) => void;
}
interface RenderItemProps {
  item: IStaff;
}
export default SelectedStaff;
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
    } as TextStyle,
  });
