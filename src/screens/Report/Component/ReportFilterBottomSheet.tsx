import React, {FC, useMemo, useState} from 'react';
import {
  AppBottomSheet,
  AppIcons,
  AppInput,
  Block,
  AppText as Text,
} from '../../../components/common';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {AppConstant} from '../../../const';
import {
  BottomSheetScrollView,
  TouchableOpacity,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
// @ts-ignore
import CalendarPicker from 'react-native-calendar-picker';
import {useTheme} from '@react-navigation/native';
import {getLabel} from '../../../language';
import isEqual from 'react-fast-compare';
import moment from 'moment';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';

const ReportFilterBottomSheet: FC<ReportFilterBottomSheetProps> = ({
  filerBottomSheetRef,
  onChange,
  onChangeDateCalender,
  isKPI,
  isNonCustomer,
  isDebt,
}) => {
  const theme = useTheme();
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [data, setData] = useState<IFilterType[]>(
    isKPI
      ? AppConstant.ReportFilterKPIData
      : isNonCustomer || isDebt
      ? AppConstant.ReportFilterNonCustomerData
      : AppConstant.ReportFilterData,
  );
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [startDate, setStartDateCalender] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
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

  const handleCalender = (date: any, type: any) => {
    if (type === 'END_DATE') {
      setEndDate(date);
    } else {
      setStartDateCalender(date);
      setEndDate(null);
    }
    // onChangeDateCalender(date);

    // filerBottomSheetRef?.current.close();
  };

  const onApply = React.useCallback(() => {
    onChangeDateCalender(startDate, endDate);
    filerBottomSheetRef?.current.close();
  }, [startDate, endDate]);

  // console.log(startDate, endDate, 'bstưb');

  return (
    <AppBottomSheet
      bottomSheetRef={filerBottomSheetRef}
      snapPointsCustom={animatedSnapPoints}
      contentHeight={animatedContentHeight}
      handleHeight={animatedHandleHeight}
      onClose={() => setShowCalender(false)}>
      <BottomSheetScrollView
        style={{paddingBottom: 24}}
        onLayout={handleContentLayout}>
        {showCalender ? (
          <Block>
            <Block paddingBottom={10}>
              <Block
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal={16}
                marginBottom={20}>
                <TouchableOpacity
                  onPress={() => {
                    filerBottomSheetRef?.current.close();
                    setStartDateCalender(null);
                    setEndDate(null);
                  }}>
                  <Text fontSize={16} colorTheme="primary" fontWeight="400">
                    Hủy
                  </Text>
                </TouchableOpacity>

                <Block>
                  <Text
                    fontWeight="400"
                    fontSize={18}
                    colorTheme="text_primary">
                    Chọn ngày
                  </Text>
                </Block>
                <TouchableOpacity onPress={onApply}>
                  <Text fontSize={16} colorTheme="primary" fontWeight="400">
                    Áp dụng
                  </Text>
                </TouchableOpacity>
              </Block>
              {isNonCustomer || !isDebt ? (
                <Block
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <AppInput
                    label={'Ngày bắt đầu'}
                    value={
                      startDate === null
                        ? 'Chọn ngày'
                        : moment(startDate).format('DD/MM/YYYY')
                    }
                    editable={false}
                    styles={styles.appInput}
                    hiddenRightIcon={startDate === null}
                    onChangeValue={() => setStartDateCalender(null)}
                  />
                  <AppInput
                    label={'Ngày kết thúc'}
                    value={
                      endDate === null
                        ? 'Chọn ngày'
                        : moment(endDate).format('DD/MM/YYYY')
                    }
                    editable={false}
                    styles={styles.appInput}
                    hiddenRightIcon={endDate === null}
                    onChangeValue={() => setEndDate(null)}
                  />
                </Block>
              ) : null}
            </Block>

            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={isNonCustomer ? false : !isDebt}
              weekdays={calenderConfig.weekdays}
              maxDate={new Date()}
              maxRangeDuration={[6]}
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
              selectedStartDate={startDate ? startDate : undefined}
              selectedEndDate={endDate ? endDate : undefined}
              selectedDayStyle={{
                backgroundColor: theme.colors.primary,
              }}
              selectedDayColor={theme.colors.primary}
              selectedDayTextStyle={{color: theme.colors.bg_default}}
              onDateChange={handleCalender}
            />
          </Block>
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
  onChangeDateCalender: (date: any, endDate?: any) => void;
  isKPI?: boolean;
  isNonCustomer?: boolean;
  isDebt?: boolean;
}

const styles = StyleSheet.create({
  appInput: {
    flex: 1,
    width: 165,
  } as ViewStyle,
  labelStyles: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 23,
    color: '#637381',
  } as TextStyle,
  contentStyle: (value: any) =>
    ({
      color: value === null ? '#C4CDD5' : '#212B36',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } as TextStyle),
});

export default React.memo(ReportFilterBottomSheet, isEqual);
