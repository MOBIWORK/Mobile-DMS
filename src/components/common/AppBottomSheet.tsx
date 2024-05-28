import React, {FC, ReactElement, useCallback, useMemo} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import {StyleSheet, View, ViewStyle} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import {Portal} from './portal';
import isEqual from 'react-fast-compare';
import {Block} from './Block';
import {AppTheme, useTheme} from '../../layouts/theme';

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
  index = -1,
  onAnimated,
  enableDynamicSizing = false,
  ...otherProps
}) => {
  const snapPoints = useMemo(() => ['20%'], []);
  const {colors} = useTheme();
  const theme = useTheme();
  const styles = rootStyles(theme);

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
    <Portal hostName={'Bottom-Sheet'}>
      <BottomSheet
        enableDynamicSizing={enableDynamicSizing}
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
        handleStyle={styles.handleStyle(backgroundColor)}
        backdropComponent={hiddenBackdrop ? null : renderBackdrop}
        enablePanDownToClose={enablePanDownToClose ?? true}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={true}
        enableOverDrag={false}
        index={index}
        style={styles.shadowStyle}
        {...otherProps}>
        {useBottomSheetView ? (
          <BottomSheetView style={styles.bottomSheetStyle}>
            {children}
          </BottomSheetView>
        ) : (
          <Block block color={backgroundColor ?? colors.bg_default}>
            {children}
          </Block>
        )}
      </BottomSheet>
    </Portal>
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
  children?: ReactElement | ReactElement[];
  backgroundColor?: any;
  onChange?: (index: number) => void;
  contentHeight?: number | SharedValue<number>;
  handleHeight?: number | SharedValue<number>;
  index?: number;
  onAnimated?: (fromIndex?: number, toIndex?: number) => void;
  enableDynamicSizing?: boolean;
}

export default AppBottomSheet;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    shadowStyle: {
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
    },
    bottomSheetStyle: {
      backgroundColor: theme.colors.bg_default,
      width: '100%',
      height: '100%',
    } as ViewStyle,
    handleStyle: (backgroundColor: any) =>
      ({
        // display: 'none',
        backgroundColor: backgroundColor ?? theme.colors.bg_default,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        // backgroundColor:'red'
      } as ViewStyle),
  });
