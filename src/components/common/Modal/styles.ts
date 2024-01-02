import {StyleSheet, ViewStyle} from 'react-native';
export const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  } as ViewStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  wrapGesture: {
    paddingVertical: 6,
    alignSelf: 'center',
  } as ViewStyle,
  anchor: {
    height: 5,
    width: 50,
    borderRadius: 10,
    backgroundColor: 'black'  , 
  },
});
