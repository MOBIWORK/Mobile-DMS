import React, {FC, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppIcons,
  SvgIcon,
} from '../../../components/common';
import {AppConstant, DataConstant} from '../../../const';
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
import FilterItem from './Component/FilterItem';

const FilterContainer: FC<FilterContainerProps> = ({
  bottomSheetRef,
  filterRef,
  filterValue,
  setFilter,
  channelData,
  customerGroupData,
  handleFilter,
  handleReset,
}) => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['100%'], []);
  // const initialSnapPoints = useMemo(() => [''], []);

  const [filterType, setFilterType] = useState<string>(
    AppConstant.VisitFilterType.channel,
  );

  const _renderData = () => {
    switch (filterType) {
      case AppConstant.VisitFilterType.channel:
        return channelData;
      case AppConstant.VisitFilterType.state:
        return DataConstant.FilterStateData(getLabel);
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
          label={getLabel('filter')}
          onBack={() =>
            bottomSheetRef.current && bottomSheetRef.current.close()
          }
          backButtonIcon={
            <SvgIcon
              source="Close"
              // name={'close'}
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
            <FilterItem
              label={getLabel('gland')}
              value={
                filterValue?.router
                  ? filterValue.router.channel_name
                  : getLabel('all')
              }
              type={AppConstant.VisitFilterType.channel}
              setFilterType={setFilterType}
              filterRef={filterRef}
            />
            <FilterItem
              label={getLabel('visitStatus')}
              value={filterValue?.status ?? getLabel('all')}
              type={AppConstant.VisitFilterType.state}
              setFilterType={setFilterType}
              filterRef={filterRef}
            />
            <FilterItem
              label={getLabel('sortByName')}
              value={filterValue?.order_by ?? 'Z -> A'}
              type={AppConstant.VisitFilterType.name}
              setFilterType={setFilterType}
              filterRef={filterRef}
            />
            <FilterItem
              label={getLabel('customerBirthDay')}
              value={filterValue?.birthDay ?? getLabel('all')}
              type={AppConstant.VisitFilterType.birthday}
              setFilterType={setFilterType}
              filterRef={filterRef}
            />
            <FilterItem
              label={getLabel('groupCustomer')}
              value={filterValue?.customer_group ?? getLabel('all')}
              type={AppConstant.VisitFilterType.customerGroup}
              setFilterType={setFilterType}
              filterRef={filterRef}
            />
            <FilterItem
              label={getLabel('customerType')}
              value={filterValue?.customer_type ?? getLabel('all')}
              type={AppConstant.VisitFilterType.customerType}
              setFilterType={setFilterType}
              filterRef={filterRef}
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
            label={getLabel('reset')}
            styleLabel={{color: colors.text_secondary}}
            onPress={() => {
              // setFilter({});
              bottomSheetRef.current?.close();
              handleReset();
            }}
          />
          <AppButton
            style={{width: '45%'}}
            label={getLabel('apply')}
            onPress={handleFilter}
          />
        </View>
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={filterRef}
        enableDynamicSizing={true}
        // snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}>
        <BottomSheetScrollView style={{paddingBottom: bottom + 16}}>
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
  handleReset: () => void;
}

export default React.memo(FilterContainer);
