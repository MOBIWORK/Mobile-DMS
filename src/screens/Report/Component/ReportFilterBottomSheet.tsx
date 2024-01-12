import React, {FC, useMemo} from 'react';
import {AppBottomSheet} from '../../../components/common';
import FilterListComponent from '../../../components/common/FilterListComponent';
import {AppConstant} from '../../../const';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const ReportFilterBottomSheet: FC<ReportFilterBottomSheetProps> = ({
  filerBottomSheetRef,
}) => {
  const {bottom} = useSafeAreaInsets();
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <AppBottomSheet
      bottomSheetRef={filerBottomSheetRef}
      snapPointsCustom={animatedSnapPoints}
      // @ts-ignore
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}>
      <BottomSheetScrollView
        style={{paddingBottom: bottom + 12}}
        onLayout={handleContentLayout}>
        <FilterListComponent
          isSearch={false}
          title={'Thời gian'}
          data={AppConstant.ReportFilterData}
          handleItem={item => console.log(item)}
          onClose={() =>
            filerBottomSheetRef.current && filerBottomSheetRef.current.close()
          }
        />
      </BottomSheetScrollView>
    </AppBottomSheet>
  );
};
interface ReportFilterBottomSheetProps {
  filerBottomSheetRef: any;
}
export default ReportFilterBottomSheet;
