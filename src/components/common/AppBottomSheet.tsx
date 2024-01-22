import React, {FC, ReactElement, useCallback, useMemo} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import { SharedValue } from 'react-native-reanimated';

const AppBottomSheet: FC<AppBottomSheetProps> = ({
  bottomSheetRef,
  snapPointsCustom,
  hiddenBackdrop,
  useBottomSheetView,
  enablePanDownToClose,
  onClose,
  children,
  contentHeight,
  backgroundColor,
  handleHeight,
  onChange,
  index=-1,
  onAnimated,
  ...otherProps

}) => {
  const snapPoints = useMemo(() => ['20%'], []);
  const {colors} = useTheme();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        
      />
    ),
    [],
  );
  return (
    <BottomSheet
      snapPoints={snapPointsCustom ?? snapPoints}
      onClose={onClose}
      ref={bottomSheetRef}
      contentHeight={contentHeight}
      handleHeight={handleHeight}
      onChange={onChange}
      onAnimate={onAnimated}
      handleIndicatorStyle={{
        backgroundColor: backgroundColor ?? colors.bg_default,
      }}
      handleStyle={{
        // display: 'none',
        backgroundColor: backgroundColor ?? colors.bg_default,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        // backgroundColor:'red'
      }}
      backdropComponent={hiddenBackdrop ? null : renderBackdrop}
      enablePanDownToClose={enablePanDownToClose ?? true}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={true}

      enableOverDrag={false}
      index={index}
      style={{
        // backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        // backgroundColor:'red',
        elevation: 24,
      }}
      {...otherProps}>
      {useBottomSheetView ? (
        <BottomSheetView
          style={{
            backgroundColor: colors.bg_default,
            width: '100%',
            height: '100%',
          }}>
          {children}
        </BottomSheetView>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor ?? colors.bg_default,
          }}>
          {children}
        </View>
      )}
    </BottomSheet>
  );
};

interface AppBottomSheetProps {
  bottomSheetRef: any;
  snapPointsCustom?: any;
  hiddenBackdrop?: boolean;
  enablePanDownToClose?: boolean;
  useBottomSheetView?: boolean;
  onClose?: () => void;
  footer?: boolean;
  children?: ReactElement | ReactElement[] ;
  backgroundColor?: any;
  onChange?:(index:number) => void,
  contentHeight?:number | SharedValue<number>,
  handleHeight?:number | SharedValue<number>,
  index?:number,
  onAnimated?:(fromIndex?:number,toIndex?:number) => void
}

export default AppBottomSheet;
