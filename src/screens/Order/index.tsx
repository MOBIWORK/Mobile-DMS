import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MainLayout } from '../../layouts';
import {
  AppBottomSheet,
  AppHeader,
  AppIcons,
} from '../../components/common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlatList, Image, Text, TextStyle, View, ViewStyle, StyleSheet, ImageStyle, Pressable } from 'react-native';
import { ImageAssets } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import ButtonFilter from '../../components/common/ButtonFilter';
import { ICON_TYPE } from '../../const/app.const';
import { Button } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { AppConstant, ScreenConstant } from '../../const';
import FilterListComponent, {
  IFilterType,
} from '../../components/common/FilterListComponent';
import { NavigationProp } from '../../navigation/screen-type';
import { AppTheme, useTheme } from '../../layouts/theme';
import { CommonUtils } from '../../utils';
import { useTranslation } from 'react-i18next';
import { IOrderList } from '../../models/types';
import { orderAction } from '../../redux-store/order-reducer/reducer';
import { dispatch } from '../../utils/redux';
import { useSelector } from '../../config/function';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../layouts/ErrorBoundary';

const OrderList = () => {

  const { t: getLabel } = useTranslation()
  const { colors } = useTheme();
  const styles = createStyles(useTheme())
  const bottomSheetRefStatus = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const navigation = useNavigation<NavigationProp>();

  const [dataStatus, setDataStatus] = useState<IFilterType[]>([
    {
      label: 'all',
      value: "All",
      isSelected: true,
    },
    {
      label: 'pending',
      value: "Draft",
      isSelected: false,
    },
    {
      label: 'pendingDeliverAndBill',
      value: 'To Deliver and Bill',
      isSelected: false,
    },
    {
      label: 'pendingBill',
      value: 'To Bill',
      isSelected: false,
    },
    {
      label: 'pendingDeliver',
      value: 'To Deliver',
      isSelected: false,
    },
    {
      label: 'completed',
      value: 'Completed',
      isSelected: false,
    },
    {
      label: 'cancelled',
      value: 'Cancelled',
      isSelected: false,
    }
  ]);

  const [dataTimeOrder, setDataTimeOrder] = useState<IFilterType[]>([
    {
      label: 'all',
      value: "",
      isSelected: true,
    },
    {
      label: 'dayNow',
      value: "today",
      isSelected: false,
    },
    {
      label: 'weekly',
      value: "weekly",
      isSelected: false,
    },
    {
      label: 'montly',
      value: "monthly",
      isSelected: false,
    },
    {
      label: 'lastMonthly',
      value: "last_month",
      isSelected: false,
    },
    {
      label: 'lastMonthlyAgain',
      value: "last_month_again",
      isSelected: false,
    },
  ]);

  const orders = useSelector(state => state.order.data);
  const totalData = useSelector(state => state.order.totalItem);

  const [dataFilter, setDataFilter] = useState<IFilterType[]>([]);
  const [label, setLabel] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<IFilterType>();
  const [timeOrder, setTimeOrder] = useState<IFilterType>();
  // Filter Order
  const [fromDate, setFromDate] = useState<number>(0);
  const [toDate, setToDate] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);

  const onOpenBottomSheet = (type: string) => {
    setType(type);
    switch (type) {
      case 'status':
        setLabel(getLabel("status"));
        setDataFilter(dataStatus);
        break;
      case 'timeOrder':
        setLabel(getLabel("time"));
        setDataFilter(dataTimeOrder);
        break;
      default:
        setDataFilter([]);
        break;
    }
    if (bottomSheetRefStatus.current) {
      bottomSheetRefStatus.current.snapToIndex(0);
    }
  };

  const onChangeData = (item: IFilterType) => {
    switch (type) {
      case 'status': {
        const newData = dataStatus.map(itemRes => {
          if (item.label === itemRes.label) {
            return { ...itemRes, isSelected: true };
          } else {
            return { ...itemRes, isSelected: false };
          }
        });
        setFilterStatus(item.value?.toString())
        setStatus(item);
        setDataStatus(newData);
        break;
      }
      case 'timeOrder': {
        const newData = dataTimeOrder.map(itemRes => {
          if (item.label === itemRes.label) {
            return { ...itemRes, isSelected: true };
          } else {
            return { ...itemRes, isSelected: false };
          }
        });
        if (item.value) {
          const { from_date, to_date } = CommonUtils.dateToDate(item.value.toString());
          setFromDate(new Date(from_date).getTime());
          setToDate(new Date(to_date).getTime())
        } else {
          setFromDate(0);
          setToDate(0)
        }
        setTimeOrder(item);
        setDataTimeOrder(newData);
        break;
      }
      default:
        break;
    }

    if (bottomSheetRefStatus.current) {
      bottomSheetRefStatus.current.close();
    }
  };

  const renderUiItem = (item: IOrderList) => {
    const status = CommonUtils.getStatusColor(item.status, colors)
    return (
      <View
        style={[styles.containerItem]}>
        <View style={[styles.flexSpace as any, { paddingBottom: 8 }]}>
          <View>
            <Text style={[styles.nameCustomer]}> {item.customer} </Text>
            <Text style={[styles.codeCustomer]}> {item.custom_id} </Text>
          </View>
          <View
            style={[
              styles.statusView,
              { backgroundColor: status.bg },
            ]}>
            <Text style={[styles.textStatus as any, { color: status.color }]}>
              {getLabel(status.text)}
            </Text>
          </View>
        </View>
        <View style={styles.inforOr}>
          <View style={styles.inforDes}>
            <AppIcons
              iconType={ICON_TYPE.IonIcon}
              name="barcode-outline"
              size={18}
              color={colors.text_primary}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.itemDesc as any,
                { marginLeft: 6, color: colors.text_primary  },
              ]}>
              {item.name}
            </Text>
          </View>
          <View style={styles.inforDes}>
            <AppIcons
              iconType={ICON_TYPE.Feather}
              name="map-pin"
              size={18}
              color={colors.text_primary}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.itemDesc as any,
                { marginLeft: 6, color: colors.text_primary },
              ]}>
              {item.address_display}
            </Text>
          </View>
          <View style={styles.inforDes}>
            <AppIcons
              iconType={ICON_TYPE.Feather}
              name="clock"
              size={18}
              color={colors.text_primary}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.itemDesc as any, { marginLeft: 6 }]}>
              {CommonUtils.convertDateToString(item.creation * 1000)}
            </Text>
          </View>
          <View style={styles.inforDes}>
            <AppIcons
              iconType={ICON_TYPE.Feather}
              name="truck"
              size={18}
              color={colors.text_primary}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.itemDesc as any, { marginLeft: 6 }]}>
              {item.delivery_date ? CommonUtils.convertDate(item.delivery_date * 1000): "- - - "}
            </Text>
          </View>
        </View>
        <View style={[styles.flexSpace as any, { marginTop: 8 }]}>
          <Button
            icon="printer-outline"
            mode="outlined"
            style={{
              borderColor: colors.action,
            }}
            textColor={colors.action}
            onPress={() => console.log('Pressed')}>
            {getLabel("printOrder")}
          </Button>
          <View style={styles.flex}>
            <Text style={styles.itemTotal}>
              {getLabel("totalPrice")} :
            </Text>
            <Text style={[styles.nameCustomer]}>
              {CommonUtils.formatCash(item.rounded_total.toString())}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const onScrollPage = ()=>{
    const number_page = (totalData / pageSize).toFixed();
    if(Number(number_page) > page) setPage(page +1)
  }

  const fetchData = async () => {
    dispatch(orderAction.onGetData({
      from_date: fromDate > 0 ? fromDate / 1000 : undefined,
      to_date: toDate > 0 ? toDate / 1000 : undefined,
      status: filterStatus,
      page_number: page,
      page_size: pageSize
    }))
  }

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, filterStatus, page]);

  useEffect(() => {
      dispatch(orderAction.resetDataOrder())
  }, [fromDate, toDate, filterStatus]);

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
        <AppHeader
          label={getLabel("order")}
          labelStyle={{ textAlign: 'left', marginLeft: 8 }}
          onBack={() => navigation.goBack()}
          rightButton={
            <TouchableOpacity onPress={() => navigation.navigate(ScreenConstant.SEARCH_COMMON_SCREEN, { type: "order" })}>
              <Image
                source={ImageAssets.SearchIcon}
                style={styles.iconBack}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          }
        />
        <View style={[styles.containerFilter]}>
          <ButtonFilter
            style={{ maxWidth: "48%" }}
            label={getLabel("status")}
            value={getLabel(status?.label || "") || getLabel("all")}
            onPress={() => onOpenBottomSheet('status')}
          />
          <ButtonFilter
            style={{ maxWidth: "48%" }}
            label={getLabel("time")}
            value={getLabel(timeOrder?.label || "") || getLabel("all")}
            onPress={() => onOpenBottomSheet('timeOrder')}
          />
        </View>
        <Text style={[styles.countOrder]}>
          {orders.length > 0 && (
            <>
              {totalData} <Text style={{ color: colors.text_secondary }}>{getLabel("order")}</Text>
            </>
          )}

        </Text>
        <View style={{flex :1}}>
          <FlatList
            data={orders}
            onEndReached={onScrollPage}
            onEndReachedThreshold={0.1}
            initialNumToRender={pageSize}
            showsVerticalScrollIndicator={false}
            style={{flex :1}}
            renderItem={({ item }) =>
              <Pressable
                onPress={() =>
                  navigation.navigate(ScreenConstant.ORDER_DETAIL_SCREEN, { name: item.name })
                }>
                {renderUiItem(item)}
              </Pressable>}
          />
        </View>
      </MainLayout>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRefStatus}
        snapPointsCustom={snapPoints}>
        <FilterListComponent
          title={label}
          data={dataFilter}
          isSearch={false}
          handleItem={onChangeData}
          onClose={() =>
            bottomSheetRefStatus.current && bottomSheetRefStatus.current.close()
          }
        />
      </AppBottomSheet>
    </ErrorBoundary>
  );
};

export default OrderList;

const createStyles = (theme: AppTheme) => StyleSheet.create({
  flex: {
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  iconBack: {
    width: 30,
    height: 30,
    tintColor: theme.colors.text_secondary,
  } as ImageStyle,
  containerFilter: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 8,
    columnGap: 8,
    flexWrap: "wrap",
    rowGap: 8
  } as ViewStyle,
  flexSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  inforOr: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  } as ViewStyle,
  inforDes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width :"80%"
  } as ViewStyle,
  countOrder: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: theme.colors.text_primary,
    marginTop: 16,
    marginBottom: 12
  } as TextStyle,
  containerItem: {
    backgroundColor: theme.colors.bg_default,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  } as ViewStyle,
  textStatus: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  nameCustomer: {
    color: theme.colors.text_primary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  } as TextStyle,
  codeCustomer :{
    color: theme.colors.text_primary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  } as TextStyle,
  statusView: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemDesc: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: theme.colors.text_primary,
    width :"100%"
  } as TextStyle,
  itemTotal: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginRight: 10,
    color: theme.colors.text_primary,
  } as ViewStyle,
  footerBtSheet: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    height: AppConstant.HEIGHT * 0.1,
    width: '100%',
    alignSelf: 'center',
  } as ViewStyle,
  iconInput: {
    width: 24,
    height: 24
  } as ImageStyle
});