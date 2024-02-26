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
import {useTranslation} from 'react-i18next';

type Props = {
  type: string;
  onPress: () => void;
  value: string;
};

const FilterHandle = (props: Props) => {
  const styles = rootStyles();
  const {t: getLabel} = useTranslation();
  return (
    <View style={styles.root}>
      {props.type === '1' ? (
        <TouchableOpacity
          style={styles.containText}
          onPress={() => props.onPress()}>
          <Text style={styles.titleText}>{`${getLabel('distance')}: `} </Text>
          <Text style={styles.contentText}>{props.value}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.containText}
          onPress={() => props?.onPress()}>
          <AppImage source="IconFilter" style={styles.iconStyle} />
          <Text style={styles.contentSecondText}>
            {getLabel('otherFilters')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(FilterHandle);

const rootStyles = () =>
  StyleSheet.create({
    root: {
      marginRight: 8,
    } as ViewStyle,
    containText: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.gray_200,
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
