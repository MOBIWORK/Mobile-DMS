import {StyleSheet} from 'react-native';
import React from 'react';
import {Block} from '../../Block';
import {AppText as Text} from '../../AppText';
import isEqual from 'react-fast-compare';
import {momentMod} from '../helper';
import {Moment} from 'moment';
import moment from 'moment';
import DayHeader from './DayHeader';
import DayRow from './DayRow';
type Props = {
  titleFormat?: string;
  titleStyle?: any;
  dayHeaderProps?: any;
  showDaysHeader?: boolean;
  capitalizeTitle?: boolean;
  month?: any;
  dayProps?: any;
  startDate?: Moment;
  untilDate?: Moment;
  availableDates?: string[];
  minDate?: Moment | any;
  maxDate?: Moment | any;
  ignoreMinDate?: boolean;
  textColor?: any;
  onSelectDate?: (arg: Moment) => void;
};
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Month = (props: Props) => {
  const {
    month,
    dayProps,
    titleStyle = {fontSize: 20, padding: 20},
    titleFormat = 'DD/MM/YYYY',
    capitalizeTitle,
    dayHeaderProps,
    textColor,
  } = props;

  const getDayStack = (month: Moment) => {
    let res: any[] = [];
    let currMonth = month.month(); //get this month
    let currDate = month.clone().startOf('month'); //get first day in this month

    let dayColumn: any[] = [];
    let dayRow: any[] = [];
    let dayObject: {type: string | null; date: string | null} = {
      type: null,
      date: null,
    };
    let {
      startDate,
      untilDate,
      availableDates,
      minDate,
      maxDate,
      ignoreMinDate,
    } = props;

    do {
      dayColumn = [];
      for (let i = 0; i < 7; i++) {
        dayObject = {type: null, date: null};
        if (i === currDate.day() && currDate.month() === currMonth) {
          if (
            minDate &&
            minDate.format('DD/MM/YYYY') &&
            currDate.format('DD/MM/YYYY') < minDate.format('DD/MM/YYYY')
          ) {
            if (
              startDate &&
              startDate.format('DD/MM/YYYY') > currDate.format('DD/MM/YYYY') &&
              currDate.format('DD/MM/YYYY') > moment().format('DD/MM/YYYY') &&
              ignoreMinDate
            ) {
              // do nothing
            } else {
              dayObject.type = 'disabled';
            }
          }
          if (
            maxDate &&
            maxDate.format('DD/MM/YYYY') &&
            currDate.format('DD/MM/YYYY') > maxDate.format('DD/MM/YYYY')
          ) {
            dayObject.type = 'disabled';
          }
          if (
            availableDates &&
            availableDates.indexOf(currDate.format('DD/MM/YYYY')) === -1
          ) {
            dayObject.type = 'blockout';
          }
          if (
            startDate &&
            startDate.format('DD/MM/YYYY') === currDate.format('DD/MM/YYYY')
          ) {
            if (!untilDate) dayObject.type = 'single';
            else {
              dayObject.type = 'first';
            }
          }
          if (
            untilDate &&
            untilDate.format('DD/MM/YYYY') === currDate.format('DD/MM/YYYY')
          ) {
            dayObject.type = 'last';
          }
          if (
            startDate &&
            startDate.format('DD/MM/YYYY') < currDate.format('DD/MM/YYYY') &&
            untilDate &&
            untilDate.format('DD/MM/YYYY') > currDate.format('DD/MM/YYYY')
          )
            dayObject.type = 'between';

          dayObject.date = currDate.clone().format('DD/MM/YYYY');
          dayColumn.push(dayObject);
          currDate = currDate.add(1, 'day');
        } else {
          if (
            startDate &&
            untilDate &&
            startDate.format('DD/MM/YYYY') < currDate.format('DD/MM/YYYY') &&
            untilDate.format('DD/MM/YYYY') >= currDate.format('DD/MM/YYYY')
          )
            dayObject.type = 'between';

          dayColumn.push(dayObject);
        }
      }

      dayRow.push(dayColumn);
    } while (currDate.month() === currMonth);

    return dayRow;
  };
  const dayStack = getDayStack(momentMod(month, 'YYYYMM'));
  return (
    <Block>
      <Text style={{color: props.textColor, ...titleStyle}}>
        {capitalizeTitle
          ? capitalize(momentMod(month, 'YYYYMM').format(titleFormat))
          : momentMod(month, 'YYYYMM').format(titleFormat)}
      </Text>
      {props.showDaysHeader && <DayHeader {...dayHeaderProps} />}
      <Block>
        {dayStack.map((days, i) => {
          return (
            <DayRow
              days={days}
              dayProps={dayProps}
              key={i}
              onSelectDate={props.onSelectDate!}
              textColor={props.textColor}
            />
          );
        })}
      </Block>
    </Block>
  );
};

export default React.memo(Month, isEqual);

const styles = StyleSheet.create({});
