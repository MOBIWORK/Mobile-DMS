import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppIcons,
  AppInput,
  FilterView,
} from '../../../components/common';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {ImageAssets} from '../../../assets';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {IProductList} from '../../../models/types';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {TextInput} from 'react-native-paper';
import {AppConstant, ScreenConstant} from '../../../const';
import {CommonUtils} from '../../../utils';
import {NavigationProp} from '../../../navigation';
import {useSelector} from 'react-redux';
import {AppSelector} from '../../../redux-store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const ListProduct = () => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const searchProductValue = useSelector(AppSelector.getSearchProductValue);

  const filterRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [filterType, setFilterType] = useState<string>(
    AppConstant.ProductFilterType.nhom_sp,
  );

  // const [listProduct, setListProduct] = useState<IProductList[]>([]);
  // const [listProductMaster, setListProductMaster] = useState<IProductList[]>([]);

  const [productGroupLabel, setProductGroupLabel] = useState<string>('Tất cả');
  const [trademarkLabel, setTrademarkLabel] = useState<string>('Tất cả');
  const [commodityTypeLabel, setCommodityTypeLabel] =
    useState<string>('Tất cả');

  const [productGroupData, setProductGroupData] = useState<IFilterType[]>([]);
  const [trademarkData, setTrademarkData] = useState<IFilterType[]>([]);
  const [commodityTypeData, setCommodityTypeData] = useState<IFilterType[]>([]);

  const [productGroupMasterData, setProductGroupMasterData] = useState<
    IFilterType[]
  >([]);
  const [trademarkMasterData, setTrademarkMasterData] = useState<IFilterType[]>(
    [],
  );
  const [commodityTypeMasterData, setCommodityTypeMasterData] = useState<
    IFilterType[]
  >([]);

  const [searchProductGroup, setSearchProductGroup] = useState<string>('');
  const [searchTrademark, setSearchTrademark] = useState<string>('');
  const [searchCommodity, setSearchCommodity] = useState<string>('');

  const handleItem = (item: IFilterType) => {
    switch (filterType) {
      case AppConstant.ProductFilterType.nhom_sp: {
        const newData = productGroupData.map(itemRes => {
          if (item.label === itemRes.label) {
            return {...itemRes, isSelected: true};
          } else {
            return {...itemRes, isSelected: false};
          }
        });
        setProductGroupLabel(item.label);
        setProductGroupData(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
      case AppConstant.ProductFilterType.thuong_hieu: {
        const newData = trademarkData.map(itemRes => {
          if (item.label === itemRes.label) {
            return {...itemRes, isSelected: true};
          } else {
            return {...itemRes, isSelected: false};
          }
        });
        setTrademarkLabel(item.label);
        setTrademarkData(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
      case AppConstant.ProductFilterType.nghanh_hang: {
        const newData = commodityTypeData.map(itemRes => {
          if (item.label === itemRes.label) {
            return {...itemRes, isSelected: true};
          } else {
            return {...itemRes, isSelected: false};
          }
        });
        setCommodityTypeLabel(item.label);
        setCommodityTypeData(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
    }
  };

  const _renderItemProduct = (item: IProductList) => {
    return (
      <TouchableOpacity onPress={() => console.log('123')}>
        <View
          style={{
            borderRadius: 16,
            marginVertical: 8,
            backgroundColor: colors.bg_default,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Image
            source={ImageAssets.ImgAppWatch}
            style={{width: 64, height: 82}}
            resizeMode={'cover'}
          />
          <View style={{marginLeft: 16, rowGap: 5}}>
            <Text
              style={{
                color: colors.text_primary,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {item.name}
            </Text>
            <Text style={{color: colors.text_primary}}>{item.type}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={ImageAssets.BarCodeIcon}
                style={{width: 16, height: 16}}
                resizeMode={'cover'}
              />
              <Text style={{color: colors.text_primary, marginLeft: 4}}>
                {item.code}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ProductFilter = () => {
    return (
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
          <AppInput
            label={'Nhóm sản phẩm'}
            value={productGroupLabel}
            onPress={() => {
              setFilterType(AppConstant.ProductFilterType.nhom_sp);
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
          <AppInput
            label={'Thương hiệu'}
            value={trademarkLabel}
            onPress={() => {
              setFilterType(AppConstant.ProductFilterType.thuong_hieu);
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
          <AppInput
            label={'Nghành hàng'}
            value={commodityTypeLabel}
            editable={false}
            onPress={() => {
              setFilterType(AppConstant.ProductFilterType.nghanh_hang);
              filterRef.current && filterRef.current.snapToIndex(0);
            }}
            rightIcon={
              <TextInput.Icon
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={colors.text_secondary}
              />
            }
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
    );
  };

  useLayoutEffect(() => {
    setProductGroupData(FilterData);
    setProductGroupMasterData(FilterData);
    setTrademarkData(FilterData);
    setTrademarkMasterData(FilterData);
    setCommodityTypeData(FilterData);
    setCommodityTypeMasterData(FilterData);
  }, []);

  useEffect(() => {
    if (searchProductValue) {
      console.log('searchProductValue', searchProductValue);
      // CommonUtils.handleSearch()
    }
  }, [searchProductValue]);

  return (
    <MainLayout style={{backgroundColor: colors.bg_neutral}}>
      <AppHeader
        label={getLabel('product')}
        labelStyle={{textAlign: 'left', marginLeft: 8}}
        onBack={() => navigation.goBack()}
        rightButton={
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenConstant.SEARCH_PRODUCT)}>
            <Image
              source={ImageAssets.SearchIcon}
              style={{width: 30, height: 30, tintColor: colors.text_secondary}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        }
      />
      <FilterView
        style={{marginTop: 16}}
        onPress={() =>
          bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
        }
      />
      <View style={{marginTop: 24}}>
        <Text
          style={{color: colors.text_primary, fontWeight: '500', fontSize: 16}}>
          {ProductData.length}
          {'  '}
          <Text style={{fontWeight: '400', fontSize: 14}}>sản phẩm</Text>
        </Text>
        <FlatList
          data={ProductData}
          renderItem={({item}) => _renderItemProduct(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          style={{height: '85%'}}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '500',
                  color: colors.text_primary,
                }}>
                No Data
              </Text>
            </View>
          }
        />
      </View>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={snapPoints}>
        <ProductFilter />
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
            title={
              filterType === AppConstant.ProductFilterType.nhom_sp
                ? 'Nhóm sản phẩm'
                : filterType === AppConstant.ProductFilterType.nghanh_hang
                ? 'Nghành hàng'
                : 'Thương hiệu'
            }
            searchPlaceholder={
              filterType === AppConstant.ProductFilterType.nhom_sp
                ? 'Tìm kiếm nhóm sản phẩm'
                : filterType === AppConstant.ProductFilterType.nghanh_hang
                ? 'Tìm kiếm nghành hàng'
                : 'Tìm kiếm thương hiệu'
            }
            data={
              filterType === AppConstant.ProductFilterType.nhom_sp
                ? productGroupData
                : filterType === AppConstant.ProductFilterType.nghanh_hang
                ? commodityTypeData
                : trademarkData
            }
            handleItem={handleItem}
            searchValue={
              filterType === AppConstant.ProductFilterType.nhom_sp
                ? searchProductGroup
                : filterType === AppConstant.ProductFilterType.nghanh_hang
                ? searchCommodity
                : searchTrademark
            }
            onChangeSearch={(text: string) =>
              filterType === AppConstant.ProductFilterType.nhom_sp
                ? CommonUtils.handleSearch(
                    text,
                    setSearchProductGroup,
                    productGroupMasterData,
                    setProductGroupData,
                  )
                : filterType === AppConstant.ProductFilterType.nghanh_hang
                ? CommonUtils.handleSearch(
                    text,
                    setSearchCommodity,
                    commodityTypeMasterData,
                    setCommodityTypeData,
                  )
                : CommonUtils.handleSearch(
                    text,
                    setSearchTrademark,
                    trademarkMasterData,
                    setTrademarkData,
                  )
            }
            onClose={() => filterRef.current && filterRef.current.close()}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </MainLayout>
  );
};

export default ListProduct;

const ProductData: IProductList[] = [
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
  {
    name: 'Đồng hồ apple watch SPCX-100',
    type: 'Đồng hồ',
    code: 'SP-543',
  },
];

const FilterData: IFilterType[] = [
  {label: 'Tất cả', isSelected: true},
  {label: 'Đồng hồ', isSelected: false},
  {label: 'Máy tính', isSelected: false},
  {label: 'Bàn phím', isSelected: false},
];
