import React from 'react';
import Day from './Day';
import {Moment} from 'moment';
import {Block} from '../../Block';
import isEqual from 'react-fast-compare';

interface Props {
  days: any[];
  dayProps: any;
  onSelectDate(arg0: Moment): void;
  textColor: string;
}

const DayRow = (props: Props) => {
  return (
    <Block
      marginBottom={2}
      marginTop={2}
      block
      direction="row"
      justifyContent="space-evenly">
      {props.days.map((day, i) => {
        return (
          <Day
            key={i}
            dayProps={props.dayProps}
            onSelectDate={props.onSelectDate}
            day={day}
            textColor={props.textColor}
          />
        );
      })}
    </Block>
  );
};

export default React.memo(DayRow,isEqual);
