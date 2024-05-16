import {StyleSheet, Text, FlatList, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {momentMod} from '../helper';
import Month from './Month';
import {Block} from '../../Block';

interface Props {
  initialMonth?: string;
  dayHeadings: string[];
  availableDates?: string[];
  maxMonth?: number;
  buttonColor?: string;
  buttonContainerStyle?: Record<string, any>;
  startDate?: string;
  untilDate?: string;
  minDate?: string;
  maxDate?: string;
  showReset?: boolean;
  showClose?: boolean;
  ignoreMinDate?: boolean;
  isHistorical?: boolean;
  onClose?: () => void;
  onSelect?: (startDate?: string, untilDate?: string) => void;
  onConfirm?: (startDate: string, untilDate: string) => void;
  placeHolderStart?: string;
  placeHolderUntil?: string;
  selectedBackgroundColor?: string;
  selectedTextColor?: string;
  todayColor?: string;
  infoText?: string;
  infoStyle?: Record<string, any>;
  infoContainerStyle?: Record<string, any>;
  showSelectionInfo?: boolean;
  showButton?: boolean;
}

const RangeDatePicker = (props: Props) => {
  const {
    initialMonth = '',
    dayHeadings = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    maxMonth = 12,
    showReset = true,
    showClose = true,
    ignoreMinDate = false,
    isHistorical = false,
    placeHolderStart = 'Start Date',
    placeHolderUntil = 'Until Date',
    selectedBackgroundColor = 'green',
    selectedTextColor = 'white',
    todayColor = 'green',
    showSelectionInfo = true,
    showButton = true,
  } = props;
  const [startDate, setStartDate] = useState<any>(
    props.startDate && momentMod(props.startDate, 'DD/MM/YYYY'),
  );
  const [untilDate, setUntilDate] = useState<any>(
    props.untilDate && momentMod(props.untilDate, 'DD/MM/YYYY'),
  );
  const [availableDates, setAvailableDates] = useState<any>(
    props.availableDates || null,
  );

  useEffect(() => {
    return setAvailableDates(props.availableDates!);
  }, [props.availableDates]);

  const onSelectDate = (date: any) => {
    let tempStartDate = null;
    let tempUntilDate = null;
    // console.log('startDate', startDate);
    // console.log('untilDate', untilDate);

    if (startDate && !untilDate) {
      if (
        date.format('DD/MM/YYYY') < startDate.format('DD/MM/YYYY') ||
        isInvalidRange(date)
      ) {
        // console.log(1);
        tempStartDate = date;
      } else if (date.format('DD/MM/YYYY') > startDate.format('DD/MM/YYYY')) {
        // console.log(2);
        tempStartDate = startDate;
        tempUntilDate = date;
      } else {
        // console.log(3);
        tempStartDate = null;
        tempUntilDate = null;
      }
    } else if (!isInvalidRange(date)) {
      // console.log(4);
      tempStartDate = date;
    } else {
      // console.log(5);
      tempStartDate = null;
      tempUntilDate = null;
    }

    setStartDate(tempStartDate);
    setUntilDate(tempUntilDate);
    typeof props.onSelect != undefined &&
      props.onSelect!(tempStartDate, tempUntilDate);
  };

  const isInvalidRange = (date: any) => {
    if (availableDates && availableDates.length > 0) {
      //select endDate condition
      if (startDate && !untilDate) {
        for (
          let i = startDate.format('DD/MM/YYYY');
          i <= date.format('DD/MM/YYYY');
          i = momentMod(i, 'DD/MM/YYYY').add(1, 'days').format('DD/MM/YYYY')
        ) {
          if (
            availableDates.indexOf(i) == -1 &&
            startDate.format('DD/MM/YYYY') != i
          )
            return true;
        }
      }
      //select startDate condition
      else if (availableDates.indexOf(date.format('DD/MM/YYYY')) == -1) {
        return true;
      }
    }

    return false;
  };

  const getMonthStack = () => {
    let res = [];
    const {maxMonth, initialMonth, isHistorical} = props;
    let initMonth = momentMod();
    if (initialMonth && initialMonth != '')
      initMonth = momentMod(initialMonth, 'YYYYMM');

    for (let i = 0; i < maxMonth!; i++) {
      res.push(
        !isHistorical
          ? initMonth.clone().add(i, 'month').format('YYYYMM')
          : initMonth.clone().subtract(i, 'month').format('YYYYMM'),
      );
    }

    return res;
  };

  const onReset = () => {
    setStartDate(null);
    setUntilDate(null);

    props.onConfirm!(null as any, null as any);
  };

  const handleConfirmDate = () => {
    props.onConfirm && props.onConfirm(startDate, untilDate);
  };

  const handleRenderRow = (month: any, index: number) => {
    let newData: any;
    const {
      selectedBackgroundColor,
      selectedTextColor,
      todayColor,
      ignoreMinDate,
      minDate,
      maxDate,
    } = props;
    if (availableDates && availableDates.length > 0) {
      newData = availableDates.filter(function (d: any) {
        if (d.indexOf(month) >= 0) return true;
      });
      setAvailableDates(newData);
    }

    return (
      <Month
        onSelectDate={onSelectDate}
        startDate={startDate}
        untilDate={untilDate}
        availableDates={availableDates}
        minDate={minDate ? momentMod(minDate, 'DD/MM/YYYY') : minDate}
        maxDate={maxDate ? momentMod(maxDate, 'DD/MM/YYYY') : maxDate}
        ignoreMinDate={ignoreMinDate}
        dayProps={{selectedBackgroundColor, selectedTextColor, todayColor}}
        month={month}
      />
    );
  };
  return (
    <Block
      style={{
        backgroundColor: '#fff',
        zIndex: 1000,
        alignSelf: 'center',
        width: '100%',
        flex: 1,
      }}>
      {props.showClose || props.showReset ? (
        <Block
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingBottom: 10,
          }}>
          {props.showClose && (
            <Text style={{fontSize: 20}} onPress={props.onClose}>
              Close
            </Text>
          )}
          {props.showReset && (
            <Text style={{fontSize: 20}} onPress={onReset}>
              Reset
            </Text>
          )}
        </Block>
      ) : null}
      {props.showSelectionInfo ? (
        <Block
          direction="row"
          justifyContent="space-between"
          paddingHorizontal={20}
          paddingBottom={5}
          alignItems="center">
          <Block block>
            <Text style={{fontSize: 34, color: '#666'}}>
              {startDate
                ? momentMod(startDate).format('DD/MM/YYYY')
                : props.placeHolderStart}
            </Text>
          </Block>

          <Block style={{}}>
            <Text style={{fontSize: 80}}>/</Text>
          </Block>

          <Block block>
            <Text style={{fontSize: 34, color: '#666', textAlign: 'right'}}>
              {untilDate
                ? momentMod(untilDate).format('DD/MM/YYYY')
                : props.placeHolderUntil}
            </Text>
          </Block>
        </Block>
      ) : null}

      {props.infoText != '' && (
        <Block style={props.infoContainerStyle}>
          <Text style={props.infoStyle}>{props.infoText}</Text>
        </Block>
      )}
      <Block style={styles.dayHeader}>
        {props.dayHeadings.map((day, i) => {
          return (
            <Text style={{width: '14.28%', textAlign: 'center'}} key={i}>
              {day}
            </Text>
          );
        })}
      </Block>
      <FlatList
        style={{flex: 1}}
        data={getMonthStack()}
        renderItem={({item, index}) => {
          return handleRenderRow(item, index);
        }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />

      {props.showButton ? (
        <Block style={[styles.buttonWrapper, props.buttonContainerStyle]}>
          <Button
            title="Select Date"
            onPress={handleConfirmDate}
            color={props.buttonColor}
          />
        </Block>
      ) : null}
    </Block>
  );
};

export default React.memo(RangeDatePicker, isEqual);
const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'stretch',
  },
});
