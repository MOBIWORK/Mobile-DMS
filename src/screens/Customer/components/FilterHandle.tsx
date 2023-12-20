import {
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Colors} from '../../../assets';
import {TouchableOpacity} from 'react-native';
import AppImage from '../../../components/common/AppImage';
import { AppTheme, useTheme } from '../../../layouts/theme';

type Props = {
  type: string;
  onPress: () => void;
  value: string;
};

const FilterHandle = (props: Props) => {
  // const [value, setValue] = React.useState('Gần nhất');
  const styles = rootStyles(useTheme())
  return (
    <View style={styles.root}>
      {props.type === '1' ? (
        <TouchableOpacity
          style={styles.containText}
          onPress={() => props.onPress()}>
          <Text style={styles.titleText}>Khoảng cách: </Text>
          <Text style={styles.contentText}>{props.value}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.containText}
          onPress={() => props?.onPress()}>
          {/* <Text style={styles.titleText}>Khoảng cách: </Text> */}
          <AppImage source="IconFilter" style={styles.iconStyle} />
          <Text style={styles.contentSecondText}>Bộ lọc khác</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilterHandle;

const rootStyles =(theme:AppTheme) =>StyleSheet.create({
  root: {
    marginRight: 8,
   
  } as ViewStyle,
  containText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:theme.colors.bg_neutral ,
    borderWidth: 1,
    padding: 6,
    borderRadius: 16,
    borderColor: Colors.gray_300,
    paddingHorizontal: 8,
    paddingVertical: 6,
  } as ViewStyle,
  titleText: {
    color: Colors.gray_600,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  contentText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  contentSecondText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  } as TextStyle,
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 4,
  } as ImageStyle,
});
