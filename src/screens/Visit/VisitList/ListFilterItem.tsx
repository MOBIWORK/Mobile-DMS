import React, {FC} from 'react';
import {IListVisitParams} from '../../../services/appService';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {AppConstant} from '../../../const';
import {AppIcons} from '../../../components/common';
import {useTheme} from '@react-navigation/native';
import {ListCustomerRoute, ListCustomerType} from '../../../models/types';

// @ts-ignore
const ListFilterItem: FC<ListFilterItemProps> = ({
  type,
  valueFilter,
  setValueFilter,
  filterRef,
  data,
}) => {
  const theme = useTheme();

  const _renderContent = () => {
    switch (type) {
      case AppConstant.VisitFilterType.customerType:
        return (
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

              <Text style={styles.titleHeaderText}>Loại khách hàng</Text>
            </View>
            {data.map((item: any) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={item.id.toString()}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      customer_type: item.title,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.title,
                      valueFilter.customer_type ?? '',
                    )}>
                    {item.title}
                  </Text>
                  {item.title === valueFilter.customer_type && (
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
        );
      case AppConstant.VisitFilterType.channel:
        return (
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

              <Text style={styles.titleHeaderText}>Tuyến</Text>
            </View>
            {data.map((item: ListCustomerRoute, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      route: item,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.channel_name,
                      valueFilter.route ?? '',
                    )}>
                    {item.channel_name}
                  </Text>
                  {item.channel_name === valueFilter.route && (
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
        );
      case AppConstant.VisitFilterType.state:
        return (
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

              <Text style={styles.titleHeaderText}>Trạng thái</Text>
            </View>
            {data.map((item: any, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      status: item.title,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.title,
                      valueFilter.route ?? '',
                    )}>
                    {item.title}
                  </Text>
                  {item.title === valueFilter.status && (
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
        );
      case AppConstant.VisitFilterType.distance:
        return (
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

              <Text style={styles.titleHeaderText}>Khoảng cách</Text>
            </View>
            {data.map((item: any, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      distance: item.title,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.title,
                      valueFilter.distance ?? '',
                    )}>
                    {item.title}
                  </Text>
                  {item.title === valueFilter.distance && (
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
        );
      case AppConstant.VisitFilterType.name:
        return (
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

              <Text style={styles.titleHeaderText}>Sắp xếp theo tên</Text>
            </View>
            {data.map((item: any, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      orderby: item.title,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.title,
                      valueFilter.orderby ?? '',
                    )}>
                    {item.title}
                  </Text>
                  {item.title === valueFilter.orderby && (
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
        );
      case AppConstant.VisitFilterType.birthday:
        return (
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

              <Text style={styles.titleHeaderText}>Ngày sinh</Text>
            </View>
            {data.map((item: any, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      birthDay: item.title,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.title,
                      valueFilter.birthDay ?? '',
                    )}>
                    {item.title}
                  </Text>
                  {item.title === valueFilter.birthDay && (
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
        );
      case AppConstant.VisitFilterType.customerGroup:
        return (
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

              <Text style={styles.titleHeaderText}>Nhóm khách hàng</Text>
            </View>
            {data.map((item: ListCustomerType, index) => {
              return (
                <TouchableOpacity
                  style={styles.containItemBottomView}
                  key={index}
                  onPress={() => {
                    setValueFilter((prev: IListVisitParams) => ({
                      ...prev,
                      customer_group: item.customer_group_name,
                    }));
                    filterRef?.current?.close();
                  }}>
                  <Text
                    style={styles.itemText(
                      item.customer_group_name,
                      valueFilter.customer_group ?? '',
                    )}>
                    {item.customer_group_name}
                  </Text>
                  {item.customer_group_name === valueFilter.customer_group && (
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
        );
    }
  };

  return _renderContent();
};
interface ListFilterItemProps {
  filterRef: any;
  type: string;
  valueFilter: IListVisitParams;
  setValueFilter: (value: any) => void;
  data: any[];
}
export default ListFilterItem;
const styles = StyleSheet.create({
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
