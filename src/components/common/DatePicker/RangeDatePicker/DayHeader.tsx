import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import {Block} from '../../Block';
import {AppText as Text} from '../../AppText';
import isEqual from 'react-fast-compare';

interface DayHeaderProps {
  dayContainerOffset?: number;
  dayHeaderContainerStyle?: ViewStyle;
  dayHeaderStyle?: TextStyle;
  dayHeadings: string[];
}
const DEVICE_WIDTH = Dimensions.get('window').width;

const DayHeader = (props: DayHeaderProps) => {
  const {
    dayContainerOffset = 0,
    dayHeaderContainerStyle,
    dayHeaderStyle,
    dayHeadings,
  } = props;
  return (
    <Block style={[styles.dayHeader, dayHeaderContainerStyle]}>
      {dayHeadings.map((day, i) => {
        return (
          <Text
            style={[
              {textAlign: 'center'},
              dayHeaderStyle,
              {width: DEVICE_WIDTH / 7 - dayContainerOffset},
            ]}
            key={i}>
            {day}
          </Text>
        );
      })}
    </Block>
  );
};

export default React.memo(DayHeader,isEqual)
const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  } as ViewStyle,
});
