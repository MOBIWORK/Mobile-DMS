'use strict';
import React, {memo} from 'react';
import {
  View,
  //   Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {momentMod} from '../helper';
import {Moment} from 'moment';
import {ViewStyle} from 'react-native';
import {Block} from '../../Block';
import {AppText as Text} from '../../AppText';
import isEqual from 'react-fast-compare';
const DEVICE_WIDTH = Dimensions.get('window').width;

const areEqual = (prevProps: any, nextProps: any) => {
  if (nextProps.day.type != prevProps.day.type) {
    return false;
  }

  if (nextProps.onSelectDate != prevProps.onSelectDate) {
    return false;
  }

  return true;
};

interface Props {
  onSelectDate(arg0: Moment): void;
  day: any;
  dayProps: any;
  textColor:string
}

const Day = memo((props: Props) => {
  const {day, dayProps} = props;

  const {
    dayBackgroundColor,
    dayTextColor,
    pointBackgroundColor,
    pointTextColor,
    selectedBackgroundColor,
    selectedTextColor,
    dayContainerOffset = 10,
  } = dayProps;

  const side = Math.floor(DEVICE_WIDTH / 7) + 2;
  const size = {
    width: side,
    height: side,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dayWrapperStyle = {
    ...size,
    backgroundColor: 'transparent',
  } as ViewStyle;

  const dayStyle = {
    width: side - dayContainerOffset,
    height: side - dayContainerOffset,
    // flex: 0,
    backgroundColor: dayBackgroundColor || 'transparent',
    position: 'relative',
    borderRadius: side - dayContainerOffset,
  };

  const textDayStyle = {color: dayTextColor || 'black'};

  switch (day.type) {
    case 'single':
      dayStyle.backgroundColor =
        pointBackgroundColor || selectedBackgroundColor;
      textDayStyle.color = pointTextColor || selectedTextColor;
      break;
    case 'first':
      dayStyle.backgroundColor =
        pointBackgroundColor || selectedBackgroundColor;
      textDayStyle.color = pointTextColor || selectedTextColor;
      dayWrapperStyle.backgroundColor = selectedBackgroundColor;
      dayWrapperStyle.borderBottomLeftRadius = side;
      dayWrapperStyle.borderTopLeftRadius = side;
      break;
    case 'last':
      dayStyle.backgroundColor =
        pointBackgroundColor || selectedBackgroundColor;
      textDayStyle.color = pointTextColor || selectedTextColor;
      dayWrapperStyle.backgroundColor = selectedBackgroundColor;
      dayWrapperStyle.borderBottomRightRadius = side;
      dayWrapperStyle.borderTopRightRadius = side;
      break;
    case 'between':
      dayStyle.backgroundColor = selectedBackgroundColor;
      textDayStyle.color = selectedTextColor;
      dayWrapperStyle.backgroundColor = selectedBackgroundColor;
      break;
    case 'disabled':
    case 'blockout':
      textDayStyle.color = '#ccc';
    default:
      break;
  }

  if (day.date) {
    if (day.type == 'disabled')
      return (
        <TouchableWithoutFeedback>
          <Block style={dayWrapperStyle}>
            <Block style={{...dayStyle, justifyContent: 'center'}}>
              <Text
                textAlign="center"
                fontSize={Math.floor(DEVICE_WIDTH / 26)}
                style={{
                  ...textDayStyle,
                  backgroundColor: 'transparent',
                }}>
                {momentMod(day.date, 'YYYYMMDD').date()}
              </Text>
              {day.date == momentMod().format('YYYYMMDD') ? (
                <Block
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  justifyContent="center"
                  color="transparent">
                  <Text
                    style={{
                      fontSize: Math.floor(DEVICE_WIDTH / 17),
                      fontWeight: 'bold',
                      color: '#ccc',
                      textAlign: 'center',
                    }}>
                    __
                  </Text>
                </Block>
              ) : null}
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      );
    else if (day.type == 'blockout') {
      const strikeTop = Math.floor(DEVICE_WIDTH / -22);
      return (
        <TouchableWithoutFeedback>
          <Block style={dayWrapperStyle}>
            <Block style={{...dayStyle, justifyContent: 'center'}}>
              <Text
                style={{
                  ...textDayStyle,
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  fontSize: Math.floor(DEVICE_WIDTH / 26),
                }}>
                {momentMod(day.date, 'YYYYMMDD').date()}
              </Text>
              <Block
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                justifyContent="center"
                color="transparent">
                <Text
                  style={{
                    fontSize: Math.floor(DEVICE_WIDTH / 17),
                    color: '#ccc',
                    textAlign: 'center',
                  }}>
                  __
                </Text>
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      );
    } else
      return (
        <TouchableWithoutFeedback
          onPress={() => props.onSelectDate(momentMod(day.date, 'YYYYMMDD'))}>
          <Block style={dayWrapperStyle}>
            <Block style={{...dayStyle}} justifyContent="center">
              <Text
                style={{
                  ...textDayStyle,
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  fontSize: Math.floor(DEVICE_WIDTH / 26),
                }}>
                {momentMod(day.date, 'YYYYMMDD').date()}
              </Text>
              {day.date == momentMod().format('YYYYMMDD') ? (
                <Block
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  justifyContent="center"
                  color="transparent">
                  <Text
                    style={{
                      fontSize: Math.floor(DEVICE_WIDTH / 17),
                      fontWeight: 'bold',
                      color: dayProps.selectedBackgroundColor,
                      textAlign: 'center',
                    }}>
                    __
                  </Text>
                </Block>
              ) : null}
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      );
  } else
    return (
      <TouchableWithoutFeedback>
        <Block style={dayWrapperStyle}>
          <Block style={{...dayStyle, ...size, justifyContent: 'center'}}>
            <Text
              style={{
                ...textDayStyle,
                textAlign: 'center',
                backgroundColor: 'transparent',
                fontSize: Math.floor(DEVICE_WIDTH / 26),
              }}>
              {null}
            </Text>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    );
}, areEqual || isEqual);

export default Day;
