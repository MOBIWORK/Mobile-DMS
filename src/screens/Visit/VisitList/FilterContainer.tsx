import React, {FC, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppIcons,
  AppInput,
} from '../../../components/common';
import {AppConstant, DataConstant} from '../../../const';
import {TextInput} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ListCustomerRoute, ListCustomerType} from '../../../models/types';
import {IListVisitParams} from '../../../services/appService';
import {listFilterType} from '../../Customer/components/data';
import ListFilterItem from './ListFilterItem';

const FilterContainer: FC<FilterContainerProps> = ({
  bottomSheetRef,
  filterRef,
  filterValue,
  setFilter,
  channelData,
  customerGroupData,
  handleFilter,
}) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['100%'], []);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [filterType, setFilterType] = useState<string>(
    AppConstant.VisitFilterType.channel,
  );

  //redux store

  const Item: FC<ItemProps> = ({label, value, type}) => {
    return (
      <AppInput
        label={label}
        value={value}
        onPress={() => {
          setFilterType(type);
          filterRef.current && filterRef.current.snapToIndex(0);
        }}
        editable={false}
        rightIcon={
          <TextInput.Icon
            icon={'chevron-down'}
            style={{width: 24, height: 24}}
            color={colors.text_secondary}
          />
        }
      />
    );
  };

  const _renderData = () => {
    switch (filterType) {
      case AppConstant.VisitFilterType.channel:
        return channelData;
      case AppConstant.VisitFilterType.state:
        return DataConstant.FilterStateData(getLabel);
      case AppConstant.VisitFilterType.distance:
        return DataConstant.FilterDistanceData(getLabel);
      case AppConstant.VisitFilterType.name:
        return DataConstant.FilterNameData(getLabel);
      case AppConstant.VisitFilterType.birthday:
        return DataConstant.FilterBirthdayData(getLabel);
      case AppConstant.VisitFilterType.customerGroup:
        return customerGroupData;
      case AppConstant.VisitFilterType.customerType:
        return listFilterType;
    }
  };

  return (
    <>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={snapPoints}>
        <AppHeader
          style={{marginTop: 32, marginHorizontal: 16}}
          label={'Bộ lọc'}
          onBack={() =>
            bottomSheetRef.current && bottomSheetRef.current.close()
          }
          backButtonIcon={
            <AppIcons
              iconType={AppConstant.ICON_TYPE.IonIcon}
              name={'close'}
              size={24}
              color={colors.text_primary}
            />
          }
        />
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 16,
            height: '100%',
          }}>
          <Pressable style={{marginTop: 32, rowGap: 24}}>
            <Item
              label={'Tuyến'}
              value={
                filterValue?.route ? filterValue.route.channel_name : 'Tất cả'
              }
              type={AppConstant.VisitFilterType.channel}
            />
            <Item
              label={'Trạng thái viếng thăm'}
              value={filterValue?.status ?? 'Tất cả'}
              type={AppConstant.VisitFilterType.state}
            />
            <Item
              label={'Sắp xếp theo khoảng cách'}
              value={filterValue?.distance ?? 'Gần nhất'}
              type={AppConstant.VisitFilterType.distance}
            />
            <Item
              label={'Sắp xếp theo tên'}
              value={filterValue?.orderby ?? 'A -> Z'}
              type={AppConstant.VisitFilterType.name}
            />
            <Item
              label={'Ngày sinh nhật'}
              value={filterValue?.birthDay ?? 'Tất cả'}
              type={AppConstant.VisitFilterType.birthday}
            />
            <Item
              label={'Nhóm khách hàng'}
              value={filterValue?.customer_group ?? 'Tất cả'}
              type={AppConstant.VisitFilterType.customerGroup}
            />
            <Item
              label={'Loại khách hàng'}
              value={filterValue?.customer_type ?? 'Tất cả'}
              type={AppConstant.VisitFilterType.customerType}
            />
          </Pressable>
        </BottomSheetScrollView>
        <View
          style={{
            padding: 16,
            marginBottom: 16,
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            alignSelf: 'center',
          }}>
          <AppButton
            style={{width: '45%', backgroundColor: colors.bg_neutral}}
            label={'Đặt lại'}
            styleLabel={{color: colors.text_secondary}}
            onPress={() => {
              setFilter({});
            }}
          />
          <AppButton
            style={{width: '45%'}}
            label={'Áp dụng'}
            onPress={handleFilter}
          />
        </View>
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={filterRef}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: bottom + 16}}
          onLayout={handleContentLayout}>
          <ListFilterItem
            filterRef={filterRef}
            type={filterType}
            valueFilter={filterValue}
            setValueFilter={setFilter}
            data={_renderData()}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
};
interface FilterContainerProps {
  bottomSheetRef: any;
  filterRef: any;
  filterValue: IListVisitParams;
  setFilter: (value: any) => void;
  channelData: ListCustomerRoute[];
  customerGroupData: ListCustomerType[];
  handleFilter: () => void;
}
interface ItemProps {
  label: string;
  value: string;
  type: string;
}
export default FilterContainer;
