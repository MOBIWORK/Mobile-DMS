import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
  FlatList
} from 'react-native';
import React from 'react';
import {AppIcons} from '../../../components/common';
import {AppConstant} from '../../../const';

import {listBirthDayType, listFilterType} from './data';
import {IValueType} from '../Customer';
import {useTheme} from '../../../layouts/theme';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ListCustomerType} from '../../../models/types';
import {useTranslation} from 'react-i18next';

type Props = {
  type: string;
  filterRef: React.RefObject<BottomSheetMethods>;
  setValueFilter: (value: React.SetStateAction<IValueType>) => void;
  valueFilter: IValueType;
  customerType: ListCustomerType[];
};

const ListFilter = (props: Props) => {
  const {type, filterRef, setValueFilter, valueFilter, customerType} = props;
  const theme = useTheme();
  const styles = rootStyles();
  const {t: getLabel} = useTranslation();

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
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('customerBirthDay')}{' '}
            </Text>
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
            <TouchableOpacity onPress={() => filterRef.current?.close()}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('customerType')}
            </Text>
          </View>
          {listFilterType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => {
                  setValueFilter(prev => ({
                    ...prev,
                    customerType: getLabel(item.title),
                  }));
                  filterRef?.current?.close();
                }}>
                <Text
                  style={styles.itemText(
                    getLabel(item.title),
                    valueFilter.customerType,
                  )}>
                  {getLabel(item.title)}
                </Text>
                {getLabel(item.title) === valueFilter.customerType && (
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
      ) : (
        <View>
          <View style={styles.headerBottomSheet}>
            <TouchableOpacity onPress={() => filterRef.current?.close()}>
              <AppIcons
                iconType={AppConstant.ICON_TYPE.IonIcon}
                name={'close'}
                size={24}
                color={theme.colors.text_primary}
              />
            </TouchableOpacity>

            <Text style={styles.titleHeaderText}>
              {getLabel('groupCustomer')}
            </Text>
          </View>
          <FlatList
            data={customerType}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            bounces={false}
            decelerationRate={'fast'}
            onEndReachedThreshold={1}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setValueFilter(prev => ({
                      ...prev,
                      customerGroupType: item.name,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.name,
                      valueFilter.customerGroupType,
                    )}>
                    {item.name}
                  </Text>
                  {item.name === valueFilter.customerGroupType && (
                    <AppIcons
                      iconType={AppConstant.ICON_TYPE.Feather}
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(ListFilter);

const rootStyles = () =>
  StyleSheet.create({
    titleHeaderText: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      flex: 1,
      marginLeft: 8,
      textAlign: 'center',
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
      } as TextStyle),
    containItemBottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    } as ViewStyle,
  });
