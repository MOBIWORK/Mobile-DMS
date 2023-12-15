import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Colors} from '../../../assets';
import { TouchableOpacity } from 'react-native';

type Props = {
    type:string
};

const FilterHandle = (props: Props) => {
  const [value, setValue] = React.useState('Gần nhất');

  return (
    <View style={styles.root}>
        {props.type === '1' ? (
             <TouchableOpacity style={styles.containText}>
             <Text style={styles.titleText}>Khoảng cách: </Text>
             <Text style={styles.contentText}>{value}</Text>
           </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.containText}>
            {/* <Text style={styles.titleText}>Khoảng cách: </Text> */}
            <Text style={styles.contentText}>Bộ lọc khác</Text>
          </TouchableOpacity>
        )}
     
    </View>
  );
};

export default FilterHandle;

const styles = StyleSheet.create({
  root: {
    marginRight: 8,
  } as ViewStyle,
  containText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.white,
    borderWidth:1,
    padding:6,
    borderRadius:16,
    borderColor:Colors.gray_300
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
});
