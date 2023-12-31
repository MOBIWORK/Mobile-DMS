import React, {FC, useLayoutEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
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
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FilterContainer: FC<FilterContainerProps> = ({
  bottomSheetRef,
  filterRef,
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

  const [channelLabel, setChannelLabel] = useState<string>('Tất cả');
  const [visitStateLabel, setVisitStateLabel] = useState<string>('Tất cả');
  const [distanceLabel, setDistanceLabel] = useState<string>('Gần nhất');
  const [nameLabel, setNameLabel] = useState<string>('A -> Z');
  const [birthdayLabel, setBirthdayLabel] = useState<string>('Tất cả');
  const [customerGroupLabel, setCustomerGroupLabel] =
    useState<string>('Tất cả');
  const [customerTypeLabel, setCustomerTypeLabel] = useState<string>('Tất cả');

  const [visitStateData, setVisitStateData] = useState<IFilterType[]>(
    DataConstant.FilterStateData(getLabel),
  );
  const [distanceData, setDistanceData] = useState<IFilterType[]>(
    DataConstant.FilterDistanceData(getLabel),
  );
  const [nameData, setNameData] = useState<IFilterType[]>(
    DataConstant.FilterNameData(getLabel),
  );
  const [birthdayData, setBirthdayData] = useState<IFilterType[]>(
    DataConstant.FilterBirthdayData(getLabel),
  );

  const [channelData, setChannelData] = useState<IFilterType[]>([]);
  const [customerGroupData, setCustomerGroupData] = useState<IFilterType[]>([]);
  const [customerTypeData, setCustomerTypeData] = useState<IFilterType[]>([]);

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

  const _renderTitle = () => {
    switch (filterType) {
      case AppConstant.VisitFilterType.channel:
        return 'Tuyến';
      case AppConstant.VisitFilterType.state:
        return 'Trạng thái';
      case AppConstant.VisitFilterType.distance:
        return 'Khoảng cách';
      case AppConstant.VisitFilterType.name:
        return 'Sắp xếp theo tên';
      case AppConstant.VisitFilterType.birthday:
        return 'Sinh nhật';
      case AppConstant.VisitFilterType.customerGroup:
        return 'Nhóm khách hàng';
      case AppConstant.VisitFilterType.customerType:
        return 'Loại khách hàng';
    }
  };

  const _renderData = () => {
    switch (filterType) {
      case AppConstant.VisitFilterType.channel:
        return channelData;
      case AppConstant.VisitFilterType.state:
        return visitStateData;
      case AppConstant.VisitFilterType.distance:
        return distanceData;
      case AppConstant.VisitFilterType.name:
        return nameData;
      case AppConstant.VisitFilterType.birthday:
        return birthdayData;
      case AppConstant.VisitFilterType.customerGroup:
        return customerGroupData;
      case AppConstant.VisitFilterType.customerType:
        return customerTypeData;
    }
  };

  const handleItemMethod = (
    item: IFilterType,
    data: IFilterType[],
    setLabel: any,
    setData: any,
  ) => {
    const newData = data.map(itemRes => {
      if (item.label === itemRes.label) {
        return {...itemRes, isSelected: true};
      } else {
        return {...itemRes, isSelected: false};
      }
    });
    setLabel(item.label);
    setData(newData);
    filterRef.current && filterRef.current.close();
  };

  const handleItem = (item: IFilterType) => {
    switch (filterType) {
      case AppConstant.VisitFilterType.channel: {
        handleItemMethod(item, channelData, setChannelLabel, setChannelData);
        break;
      }
      case AppConstant.VisitFilterType.state: {
        handleItemMethod(
          item,
          visitStateData,
          setVisitStateLabel,
          setVisitStateData,
        );
        break;
      }
      case AppConstant.VisitFilterType.distance:
        handleItemMethod(item, distanceData, setDistanceLabel, setDistanceData);
        break;
      case AppConstant.VisitFilterType.name:
        handleItemMethod(item, nameData, setNameLabel, setNameData);
        break;
      case AppConstant.VisitFilterType.birthday:
        handleItemMethod(item, birthdayData, setBirthdayLabel, setBirthdayData);
        break;
      case AppConstant.VisitFilterType.customerGroup:
        handleItemMethod(
          item,
          customerGroupData,
          setCustomerGroupLabel,
          setCustomerGroupData,
        );
        break;
      case AppConstant.VisitFilterType.customerType:
        handleItemMethod(
          item,
          customerTypeData,
          setCustomerTypeLabel,
          setCustomerTypeData,
        );
        break;
    }
  };

  useLayoutEffect(() => {
    setChannelData(FilterData);
    setCustomerGroupData(FilterData);
    setCustomerTypeData(FilterData);
  }, []);

  return (
    <>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={snapPoints}>
        <View style={{padding: 16, height: '100%'}}>
          <AppHeader
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
          <View style={{marginTop: 32, rowGap: 24}}>
            <Item
              label={'Tuyến'}
              value={channelLabel}
              type={AppConstant.VisitFilterType.channel}
            />
            <Item
              label={'Trạng thái viếng thăm'}
              value={visitStateLabel}
              type={AppConstant.VisitFilterType.state}
            />
            <Item
              label={'Sắp xếp theo khoảng cách'}
              value={distanceLabel}
              type={AppConstant.VisitFilterType.distance}
            />
            <Item
              label={'Sắp xếp theo tên'}
              value={nameLabel}
              type={AppConstant.VisitFilterType.name}
            />
            <Item
              label={'Ngày sinh nhật'}
              value={birthdayLabel}
              type={AppConstant.VisitFilterType.birthday}
            />
            <Item
              label={'Nhóm khách hàng'}
              value={customerGroupLabel}
              type={AppConstant.VisitFilterType.customerGroup}
            />
            <Item
              label={'Loại khách hàng'}
              value={customerTypeLabel}
              type={AppConstant.VisitFilterType.customerType}
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingTop: 10,
              position: 'absolute',
              bottom: 0,
              height: AppConstant.HEIGHT * 0.1,
              width: '100%',
              alignSelf: 'center',
            }}>
            <AppButton
              style={{width: '45%', backgroundColor: colors.bg_neutral}}
              label={'Bỏ qua'}
              styleLabel={{color: colors.text_secondary}}
              onPress={() => console.log('bỏ qua')}
            />
            <AppButton
              style={{width: '45%'}}
              label={'Áp dụng'}
              onPress={() => console.log('áp dụng')}
            />
          </View>
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
          <FilterListComponent
            title={_renderTitle() ?? ''}
            data={_renderData() ?? []}
            handleItem={handleItem}
            onClose={() => filterRef.current && filterRef.current.close()}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
};
interface FilterContainerProps {
  bottomSheetRef: any;
  filterRef: any;
}
interface ItemProps {
  label: string;
  value: string;
  type: string;
}
export default FilterContainer;
const FilterData: IFilterType[] = [
  {label: 'Tất cả', isSelected: true},
  {label: 'Đồng hồ', isSelected: false},
  {label: 'Máy tính', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
];
