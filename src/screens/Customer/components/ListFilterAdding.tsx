import {StyleSheet, TouchableOpacity, TextStyle, ViewStyle} from 'react-native';
import React, {useCallback} from 'react';
import {AppIcons, Block, AppText as Text} from '../../../components/common';
import {AppConstant} from '../../../const';

import {listBirthDayType, listFilterType, listFrequencyType} from './data';
import {IValueType} from '../Customer';
import {AppTheme, useTheme} from '../../../layouts/theme';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {
  IDataCustomer,
  ListCustomerRoute,
  ListCustomerTerritory,
  ListCustomerType,
} from '../../../models/types';
import {useSelector} from '../../../config/function';

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
  const customerType: ListCustomerType[] = useSelector(
    state => state.customer.listCustomerType,
  );
  const listTerritory: ListCustomerTerritory[] = useSelector(
    state => state.customer.listCustomerTerritory,
  );

  const listRoute: ListCustomerRoute[] = useSelector(
    state => state.customer.listCustomerRoute,
  );

  const handlePress = useCallback(
    (item: any) => {
      setData(prev => {
        const isItemInFrequency = prev?.frequency?.includes(item.title);
        const updatedFrequency = isItemInFrequency
          ? prev?.frequency?.filter(
              (selectedItem: any) => selectedItem !== item.title,
            )
          : [...(prev?.frequency || []), item.title];
        return {
          ...prev,
          frequency: updatedFrequency,
        };
      });

      setValueFilter(prev => ({
        ...prev,
        customerGroupType: item.title,
      }));

      // filterRef?.current?.close();
    },
    [setData, setValueFilter, filterRef],
  );

  return (
    <Block>
      {type === AppConstant.CustomerFilterType.ngay_sinh_nhat ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
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
            <Text style={styles.titleHeaderText} />
          </Block>
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
        </Block>
      ) : type === AppConstant.CustomerFilterType.loai_khach_hang ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
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
            <Text style={styles.titleHeaderText} />
          </Block>
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
        </Block>
      ) : type === AppConstant.CustomerFilterType.nhom_khach_hang ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
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
            <Text style={styles.titleHeaderText} />
          </Block>
          {customerType &&
            customerType.length > 0 &&
            customerType?.map(item => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      customer_group: item.customer_group_name,
                    }));
                    setValueFilter(prev => ({
                      ...prev,
                      customerGroupType: item.customer_group_name,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.customer_group_name,
                      data.customer_group,
                    )}>
                    {item.customer_group_name}
                  </Text>
                  {item.customer_group_name === data.customer_group && (
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
        </Block>
      ) : type === AppConstant.CustomerFilterType.khu_vuc ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
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
            <Text style={styles.titleHeaderText} />
          </Block>
          {listTerritory &&
            listTerritory.length > 0 &&
            listTerritory?.map(item => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      territory: item.territory_name,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.territory_name,
                      data.territory,
                    )}>
                    {item.territory_name}
                  </Text>
                  {item.territory_name === data.territory && (
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
        </Block>
      ) : type === AppConstant.CustomerFilterType.tuyen ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
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

            <Text style={styles.titleHeaderText}>Tuyến</Text>
            <Text style={styles.titleHeaderText} />
          </Block>
          {listRoute &&
            listRoute.length > 0 &&
            listRoute?.map(item => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.name}
                  onPress={() => {
                    setData(prev => ({
                      ...prev,
                      router_name: [item.channel_name, item.name],
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.channel_name,
                      data.router_name!,
                    )}>
                    {item.channel_name}
                  </Text>
                  {item.channel_name === data.router_name && (
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
        </Block>
      ) : type === AppConstant.CustomerFilterType.tan_suat ? (
        <Block>
          <Block style={styles.headerBottomSheet}>
            <TouchableOpacity
              onPress={() => {
                setData(prev => ({
                  ...prev,
                  frequency: '',
                }));
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
            <Text
              onPress={() => filterRef.current?.close()}
              style={[styles.titleHeaderText, {color: theme.colors.primary}]}>
              Lưu
            </Text>
          </Block>
          {listFrequencyType.map((item: any) => {
            return (
              <TouchableOpacity
                style={styles.containItemBottomView}
                key={item.id.toString()}
                onPress={() => handlePress(item)}>
                <Text style={{marginVertical: 8}}>{item.title}</Text>
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
        </Block>
      ) : null}
    </Block>
  );
};

export default React.memo(ListFilterAdding);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    titleHeaderText: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      // flex: 1,
      // marginLeft: 8,
      // textAlign: 'center',
      color: theme.colors.text_primary,
    } as TextStyle,
    headerBottomSheet: {
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
