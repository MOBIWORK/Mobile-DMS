import React, {FC, useMemo, useState} from 'react';
import {AppBottomSheet, AppIcons} from '../../../components/common';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {AppConstant} from '../../../const';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// @ts-ignore
import CalendarPicker from 'react-native-calendar-picker';
import {useTheme} from '@react-navigation/native';
import {getLabel} from '../../../language';

const ReportFilterBottomSheet: FC<ReportFilterBottomSheetProps> = ({
  filerBottomSheetRef,
  onChange,
  onChangeDateCalender,
  isKPI,
}) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [data, setData] = useState<IFilterType[]>(
    isKPI ? AppConstant.ReportFilterKPIData : AppConstant.ReportFilterData,
  );
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [dateCalender, setDateCalender] = useState<any>(null);

  const calenderConfig = {
    weekdays: [
      getLabel('Monday'),
      getLabel('Tuesday'),
      getLabel('Wednesday'),
      getLabel('Thursday'),
      getLabel('Friday'),
      getLabel('Saturday'),
      getLabel('Sunday'),
    ],
    months: [
      getLabel('January'),
      getLabel('February'),
      getLabel('March'),
      getLabel('April'),
      getLabel('May'),
      getLabel('June'),
      getLabel('July'),
      getLabel('August'),
      getLabel('September'),
      getLabel('October'),
      getLabel('November'),
      getLabel('December'),
    ],
  };

  const handleItem = (item: IFilterType) => {
    
    const newData = data.map(newItem => {
      if (item.value === newItem.value) {
        return {...newItem, isSelected: true};
      } else {
        return {...newItem, isSelected: false};
      }
    });
    setData(newData);
    if (item.value === 'selectDate') {
      setShowCalender(true);
    } else {
      filerBottomSheetRef?.current.close();
    }
    onChange(item);
  };

  const handleCalender = (date: any) => {
    setDateCalender(date);
    onChangeDateCalender(date);
    filerBottomSheetRef?.current.close();
  };

  return (
    <AppBottomSheet
      bottomSheetRef={filerBottomSheetRef}
      snapPointsCustom={animatedSnapPoints}
      onClose={() => setShowCalender(false)}
      // @ts-ignore
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}>
      <BottomSheetScrollView
        style={{paddingBottom: bottom + 12}}
        onLayout={handleContentLayout}>
        {showCalender ? (
          <CalendarPicker
            startFromMonday={true}
            allowBackwardRangeSelect
            weekdays={calenderConfig.weekdays}
            months={calenderConfig.months}
            textStyle={{color: theme.colors.text_primary}}
            todayBackgroundColor={theme.colors.text_secondary}
            todayTextStyle={{color: theme.colors.bg_default}}
            previousComponent={
              <AppIcons
                iconType={AppConstant.ICON_TYPE.EntypoIcon}
                name={'chevron-left'}
                size={30}
                color={theme.colors.text_primary}
              />
            }
            nextComponent={
              <AppIcons
                iconType={AppConstant.ICON_TYPE.EntypoIcon}
                name={'chevron-right'}
                size={30}
                color={theme.colors.text_primary}
              />
            }
            selectedStartDate={dateCalender}
            selectedDayStyle={{
              backgroundColor: theme.colors.primary,
            }}
            selectedDayTextStyle={{color: theme.colors.bg_default}}
            onDateChange={handleCalender}
          />
        ) : (
          <FilterListComponent
            isSearch={false}
            title={'Thời gian'}
            data={data}
            handleItem={handleItem}
            onClose={() =>
              filerBottomSheetRef.current && filerBottomSheetRef.current.close()
            }
          />
        )}
      </BottomSheetScrollView>
    </AppBottomSheet>
  );
};
interface ReportFilterBottomSheetProps {
  filerBottomSheetRef: any;
  onChange: (item: IFilterType) => void;
  onChangeDateCalender: (date: any) => void;
  isKPI?: boolean;
}

export default ReportFilterBottomSheet;
