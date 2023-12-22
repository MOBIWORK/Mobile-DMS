import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppIcons} from '../../../components/common';
import {AppConstant} from '../../../const';

import {listBirthDayType, listFilterType} from './data';
import {IValueType} from '../Customer';
import { AppTheme, useTheme } from '../../../layouts/theme';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type Props = {
  type: string;
  filterRef: React.RefObject<BottomSheetMethods>;
  setValueFilter: (value: React.SetStateAction<IValueType>) => void;
  valueFilter: IValueType;
  setShow?:React.Dispatch<React.SetStateAction<boolean>>
};

const ListFilter = (props: Props) => {
  const {type, filterRef, setValueFilter, valueFilter,setShow} = props;
  const styles = rootStyles(useTheme());
  return (
    <View>
      {type === AppConstant.CustomerFilterType.ngay_sinh_nhat ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={() => filterRef.current?.close()}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={useTheme().colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Ngày sinh nhật </Text>
          </View>
          {listBirthDayType.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() =>{

                
                  setValueFilter(prev => ({
                    ...prev,
                    customerBirthday: item.title,
                  }))
                  filterRef?.current?.close()
                }
                }>
                <Text
                  style={styles.itemText(
                    item.title,
                    valueFilter.customerBirthday,
                  )}>
                  {item.title}
                </Text>
                {item.title === valueFilter.customerBirthday && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={useTheme().colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : type === AppConstant.CustomerFilterType.loai_khach_hang ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={() => filterRef.current?.close()}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={useTheme().colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Loại khách hàng</Text>
          </View>
          {listFilterType.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() =>
                {  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }))
                filterRef?.current?.close()
                }
                }>
                <Text
                  style={styles.itemText(item.title, valueFilter.customerType)}>
                  {item.title}
                </Text>
                {item.title === valueFilter.customerType && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={useTheme().colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={() => filterRef.current?.close()}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={useTheme().colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Nhóm khách hàng</Text>
          </View>
          {listFilterType.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() =>
                 { 
                  console.log(item,'item')
                  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }))
                filterRef?.current?.close()
                }
                  
                }>
                <Text
                  style={styles.itemText(item.title, valueFilter.customerType)}>
                  {item.title}
                </Text>
                {item.title === valueFilter.customerType && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={useTheme().colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default React.memo(ListFilter);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    titleHeaderText: {
      // alignSelf:'center',
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      flex: 1,
      marginLeft: 8,
      // backgroundColor:'blue',
      textAlign: 'center',
    } as TextStyle,
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      // justifyContent:'space-around',
      alignItems: 'center',
    } as ViewStyle,
    itemText: (text: string, value: string) =>
      ({
        fontSize: 16,
        fontWeight: text === value ? '600' : '400',
        lineHeight: 21,
        marginBottom: 16,
      } as TextStyle),
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
  });
