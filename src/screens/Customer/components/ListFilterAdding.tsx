import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, {useCallback} from 'react';
import {AppIcons} from '../../../components/common';
import {AppConstant} from '../../../const';

import {listBirthDayType, listFilterType, listFrequencyType} from './data';
import {IValueType} from '../Customer';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {IDataCustomer} from '../../../models/types';

type Props = {
  type: string;
  filterRef: React.RefObject<BottomSheetMethods>;
  setValueFilter: (value: React.SetStateAction<IValueType>) => void;
  valueFilter: IValueType;
  setData: React.Dispatch<React.SetStateAction<IDataCustomer>>;
  data: IDataCustomer;
};

const ListFilterAdding = (props: Props) => {
  const {type, filterRef, setValueFilter, valueFilter, setData, data} = props;
  const theme = useTheme();
  const styles = rootStyles(theme);

  const handlePress = useCallback(
    (item: any) => {
      setData(prev => {
        const updatedFrequency = prev.frequency.includes(item.title)
          ? prev.frequency.filter(
              (selectedItem: any) => selectedItem !== item.title,
            )
          : [...prev.frequency, item.title];

        return {
          ...prev,
          frequency: updatedFrequency,
        };
      });

      setValueFilter(prev => ({
        ...prev,
        customerGroupType: item.title,
      }));

      filterRef?.current?.close();
    },
    [setData, setValueFilter, filterRef],
  );

  return (
    <View>
      {type === AppConstant.CustomerFilterType.ngay_sinh_nhat ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Ngày sinh nhật </Text>
          </View>
          {listBirthDayType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setValueFilter(prev => ({
                    ...prev,
                    customerBirthday: item.title,
                  }));
                  filterRef?.current?.close();
                }}>
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
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : type === AppConstant.CustomerFilterType.loai_khach_hang ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Loại khách hàng</Text>
          </View>
          {listFilterType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }));
                  setData(prev => ({
                    ...prev,
                    customer_type: item.title,
                  }));
                  console.log('v');
                  filterRef?.current?.close();
                }}>
                <Text style={styles.itemText(item.title, data.customer_type)}>
                  {item.title}
                </Text>
                {item.title === data.customer_type && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : type === AppConstant.CustomerFilterType.nhom_khach_hang ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Nhóm khách hàng</Text>
          </View>
          {listFilterType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setData(prev => ({...prev, customer_group: item.title}));
                  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }));
                  filterRef?.current?.close();
                }}>
                <Text style={styles.itemText(item.title, data.customer_group)}>
                  {item.title}
                </Text>
                {item.title === data.customer_group && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : type === AppConstant.CustomerFilterType.khu_vuc ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Khu vực</Text>
          </View>
          {listFilterType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setData(prev => ({...prev, territory: item.title}));
                  setValueFilter(prev => ({
                    ...prev,
                    territory: item.title,
                  }));
                  filterRef?.current?.close();
                }}>
                <Text style={styles.itemText(item.title, data.territory!)}>
                  {item.title}
                </Text>
                {item.title === data?.territory && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : type === AppConstant.CustomerFilterType.tan_suat ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Tần suất</Text>
          </View>
          {listFrequencyType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => handlePress(item)}>
                <Text style={styles.itemText(item.title, data.frequency!)}>
                  {item.title}
                </Text>
                {data.frequency && data.frequency.includes(item.title) && (
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(ListFilterAdding);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    titleHeaderText: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      flex: 1,
      marginLeft: 8,
      textAlign: 'center',
      color: theme.colors.text_primary,
    } as TextStyle,
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    itemText: (text: string, value: string) =>
      ({
        fontSize: 16,
        fontWeight: text === value ? '600' : '400',
        lineHeight: 21,
        marginBottom: 16,
        color: theme.colors.text_primary,
      } as TextStyle),
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
  });
