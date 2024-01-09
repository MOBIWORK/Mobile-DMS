import {StyleSheet, ViewStyle} from 'react-native';

export const styles = StyleSheet.create({
  bg: {
    width: '100%',
    flex: 1,
    height: 4,
    backgroundColor: '#dbdbdb',
    marginVertical: 3,
    overflow: 'hidden',
    flexDirection:'row'
  } as ViewStyle,
  fg: {
    backgroundColor: '#C4161C',
    flex: 1,
  },
});
