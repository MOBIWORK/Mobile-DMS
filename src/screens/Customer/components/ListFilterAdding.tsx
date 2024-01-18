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
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const ListFilterAdding = (props: Props) => {
  const {type, filterRef, setValueFilter, valueFilter, setData, data, setShow} =
    props;
  const styles = rootStyles(useTheme());

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
      setShow(false);
    },
    [setData, setValueFilter, filterRef, setShow],
  );

  return (
    <View>
      {type === AppConstant.CustomerFilterType.ngay_sinh_nhat ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
                setShow && setShow(false);
              }}>
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
                onPress={() => {
                  setValueFilter(prev => ({
                    ...prev,
                    customerBirthday: item.title,
                  }));
                  filterRef?.current?.close();
                  setShow(false);
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
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
                setShow && setShow(false);
              }}>
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
                onPress={() => {
                  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }));
                  setData(prev => ({
                    ...prev,
                    type: item.title,
                  }));
                  console.log('v');
                  filterRef?.current?.close();
                  setShow(false);
                }}>
                <Text style={styles.itemText(item.title, data.type)}>
                  {item.title}
                </Text>
                {item.title === data.type && (
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
      ) : type === AppConstant.CustomerFilterType.nhom_khach_hang ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
                setShow && setShow(false);
              }}>
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
                onPress={() => {
                  setData(prev => ({...prev, group: item.title}));
                  setValueFilter(prev => ({
                    ...prev,
                    customerGroupType: item.title,
                  }));
                  filterRef?.current?.close();
                  setShow(false);
                }}>
                <Text style={styles.itemText(item.title, data.group)}>
                  {item.title}
                </Text>
                {item.title === data.group && (
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
      ) : type === AppConstant.CustomerFilterType.khu_vuc ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
                setShow && setShow(false);
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={useTheme().colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Khu vực</Text>
          </View>
          {listFilterType.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setData(prev => ({...prev, area: item.title}));
                  setValueFilter(prev => ({
                    ...prev,
                    area: item.title,
                  }));
                  filterRef?.current?.close();
                  setShow(false);
                }}>
                <Text style={styles.itemText(item.title, data.area!)}>
                  {item.title}
                </Text>
                {item.title === data?.area && (
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
      ) : type === AppConstant.CustomerFilterType.tan_suat ? (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                filterRef.current?.close();
                setShow && setShow(false);
              }}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={useTheme().colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>Tần suất</Text>
          </View>
          {listFrequencyType.map((item: any, index: number) => {
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
                    color={useTheme().colors.primary}
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
