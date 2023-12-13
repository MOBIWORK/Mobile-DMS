import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {TextStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import {Colors} from '../../assets';
import AppImage from '../../components/common/AppImage';
import {ImageStyle} from 'react-native';
import FilterHandle from './components/FilterHandle';

type Props = {};

const Customer = (props: Props) => {
  const {t: getLabel} = useTranslation();

  return (
    <MainLayout>
      <View style={styles.rootHeader}>
        <Text style={styles.labelStyle}>Khách hàng</Text>
        <TouchableOpacity
          onPress={() => console.log('on press search')}
          style={styles.iconSearch}>
          <AppImage source="IconSearch" style={styles.iconSearch} />
        </TouchableOpacity>
      </View>
      <View style={styles.containFilterView}>
        <FilterHandle type={'1'}/>
        <FilterHandle type={'2'}/>
      </View>

      <Text>Customer</Text>
    </MainLayout>
  );
};

export default React.memo(Customer);

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 24,
    color: Colors.gray_800,
    lineHeight: 25,
    fontWeight: '500',
    textAlign: 'left',
    // alignSelf:'flex-end'
  } as TextStyle,
  iconSearch: {
    width: 28,
    height: 28,
    marginRight: 16,
  } as ImageStyle,
  searchButtonStyle: {
    alignItems: 'flex-end',
    backgroundColor: 'red',
    width: 200,
    flex: 1,
  } as ViewStyle,
  labelContentStyle: {alignSelf: 'flex-end'} as ViewStyle,
  rootHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    marginBottom:16
  } as ViewStyle,
  containFilterView: {
    flexDirection: 'row',
    height: 48,
    marginBottom:16
  } as ViewStyle,
});
