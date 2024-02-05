import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MainLayout } from '../../../layouts';
import {
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppIcons,
  AppInput,
  FilterView,
} from '../../../components/common';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ImageAssets } from '../../../assets';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { IProduct, KeyAbleProps } from '../../../models/types';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import { TextInput } from 'react-native-paper';
import { AppConstant, ScreenConstant } from '../../../const';
import { NavigationProp } from '../../../navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductService } from '../../../services';
import { STT_OK } from '../../../const/api.const';
import { useSelector } from '../../../config/function';
import { dispatch } from '../../../utils/redux';
import { productActions } from '../../../redux-store/product-reducer/reducer';


const ListProduct = () => {

  const { colors } = useTheme();
  const { t: getLabel } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const searchProductValue = useSelector(state => state.app.searchProductValue);

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
  
  const {data,totalItem} = useSelector(state => state.product);
  const [page,setPage] = useState<number>(1)
  const [brand, setBrand] = useState<TypeFilter>();
  const [industry, setIndustry] = useState<TypeFilter>();
  const [groupItem, setGroupItem] = useState<TypeFilter>();

  const [dataBrand, setDataBrand] = useState<IFilterType[]>([]);
  const [dataIndustry, setDataIndustry] = useState<IFilterType[]>([]);
  const [dataGroupItem, setDataGroupItem] = useState<IFilterType[]>([]);
  const [dataFilter, setDataFilter] = useState<IFilterType[]>([]);

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string | number>("");
  const [filterBrand, setFilterBrand] = useState<string | number>("");
  const [filterIndustry, setFilterIndustry] = useState<string | number>("");
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [placeholder,setPlaceholder] = useState<string>("");
  const [titleModal,setTitleModal] = useState<string>("");

  const handleItem = (item: IFilterType) => {
    switch (filterType) {
      case AppConstant.ProductFilterType.nhom_sp: {
        const newData = dataGroupItem.map(itemRes => {
          if (item.label === itemRes.label) {
            return { ...itemRes, isSelected: true };
          } else {
            return { ...itemRes, isSelected: false };
          }
        });
        setGroupItem({
          label: item.label,
          value: item.value || ""
        });
        setDataGroupItem(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
      case AppConstant.ProductFilterType.thuong_hieu: {
        const newData = dataBrand.map(itemRes => {
          if (item.label === itemRes.label) {
            return { ...itemRes, isSelected: true };
          } else {
            return { ...itemRes, isSelected: false };
          }
        });
        setBrand({
          label: item.label,
          value: item.value || ""
        });
        setDataBrand(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
      case AppConstant.ProductFilterType.nghanh_hang: {
        const newData = dataIndustry.map(itemRes => {
          if (item.label === itemRes.label) {
            return { ...itemRes, isSelected: true };
          } else {
            return { ...itemRes, isSelected: false };
          }
        });
        setIndustry({
          label: item.label,
          value: item.value || ""
        });
        setDataIndustry(newData);
        filterRef.current && filterRef.current.close();
        break;
      }
    }
  };

  const _renderItemProduct = (item: IProduct) => {
    let image = {
      uri : item.image
    }
    if(!item.image){
      image = ImageAssets.NoDataImage
    }

    return (
      <TouchableOpacity onPress={() => navigation.navigate(ScreenConstant.PRODUCT_DETAIL, { item })}>
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
            source={image}
            style={{ width: 64, height: 82 }}
            resizeMode={'cover'}
          />
          <View style={{ marginLeft: 16, rowGap: 5 }}>
            <Text
              style={{
                color: colors.text_primary,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {item.item_name}
            </Text>
            <Text style={{ color: colors.text_primary }}>{item.item_group}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={ImageAssets.BarCodeIcon}
                style={{ width: 16, height: 16 }}
                resizeMode={'cover'}
              />
              <Text style={{ color: colors.text_primary, marginLeft: 4 }}>
                {item.item_code}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  const submitFilter = () => {
    setFilterBrand(brand?.value || "");
    setFilterGroup(groupItem?.value || "");
    setFilterIndustry(industry?.value || "");
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close()
    }
  }

  const resetFilter = () => {
    setBrand({ label: "", value: "" });
    setGroupItem({ label: "", value: "" });
    setIndustry({ label: "", value: "" });
    setSearchProduct("")
  }

  const ProductFilter = () => {
    return (
      <View style={{ padding: 16, height: '100%' }}>
        <AppHeader
          label={getLabel("filter")}
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
        <View style={{ marginTop: 32, rowGap: 24 }}>
          <AppInput
            label={getLabel("groupProduct")}
            value={groupItem?.label || getLabel("all")}
            onPress={() => {
              openDataFilter(AppConstant.ProductFilterType.nhom_sp)
            }}
            editable={false}
            rightIcon={
              <TextInput.Icon
                onPress={() => { openDataFilter(AppConstant.ProductFilterType.nhom_sp)}}
                icon={'chevron-down'}
                style={{ width: 24, height: 24 }}
                color={colors.text_secondary}
              />
            }
          />
          <AppInput
            label={getLabel("brand")}
            value={brand?.label || getLabel("all")}
            onPress={() => {openDataFilter(AppConstant.ProductFilterType.thuong_hieu) }}
            editable={false}
            rightIcon={
              <TextInput.Icon
                onPress={() => { openDataFilter(AppConstant.ProductFilterType.thuong_hieu)}}
                icon={'chevron-down'}
                style={{ width: 24, height: 24 }}
                color={colors.text_secondary}
              />
            }
          />
          <AppInput
            label={getLabel("industry")}
            value={industry?.label || getLabel("all")}
            editable={false}
            onPress={() => {openDataFilter(AppConstant.ProductFilterType.nghanh_hang)}}
            rightIcon={
              <TextInput.Icon
                onPress={() => {openDataFilter(AppConstant.ProductFilterType.nghanh_hang)}}
                icon={'chevron-down'}
                style={{ width: 24, height: 24 }}
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
            width: '100%',
            alignSelf: 'center',
            marginBottom: 30
          }}>
          <AppButton
            style={{ width: '45%', backgroundColor: colors.bg_neutral }}
            label={getLabel("reset")}
            styleLabel={{ color: colors.text_secondary }}
            onPress={() => resetFilter()}
          />
          <AppButton
            style={{ width: '45%' }}
            label={getLabel("apply")}
            onPress={() => submitFilter()}
          />
        </View>
      </View>
    );
  };

  const fetchProduct =  () => {
    dispatch(productActions.onGetData({
      brand: filterBrand.toString(),
      industry: filterIndustry.toString(),
      item_group: filterGroup.toString(),
      item_name: searchProduct,
      page_size : 20,
      page : page
    }))
  }

  const fetchBrandProduct = async () => {
    const { status, data }: KeyAbleProps = await ProductService.getBrand();
    if (status === STT_OK) {
      const rlt = data.result
      const newData: IFilterType[] = [];
      for (let i = 0; i < rlt.length; i++) {
        const element = rlt[i];
        newData.push({
          label: element.brand,
          value: element.name,
          isSelected: false
        })
      }
      setDataBrand(newData)
    }
  }

  const fetchIndustryProduct = async () => {
    const { data, status }: KeyAbleProps = await ProductService.getIndustry();
    if (status === STT_OK) {
      const rlt = data.result
      const newData: IFilterType[] = [];
      for (let i = 0; i < rlt.length; i++) {
        const element = rlt[i];
        newData.push({
          label: element.industry,
          value: element.name,
          isSelected: false
        })
      }
      setDataIndustry(newData)
    }
  }

  const fetchGroupProduct = async () => {
    const { data, status }: KeyAbleProps = await ProductService.getGroup();
    if (status === STT_OK) {
      const rlt = data.result
      const newData: IFilterType[] = [];
      for (let i = 0; i < rlt.length; i++) {
        const element = rlt[i];
        newData.push({
          label: element.item_group_name,
          value: element.name,
          isSelected: false
        })
      }
      setDataGroupItem(newData)
    }
  }

  const openDataFilter = (type :string) => {
    setFilterType(type)
    switch (type) {
      case AppConstant.ProductFilterType.nhom_sp: {
        setPlaceholder(getLabel("searchGroupProduct"));
        setTitleModal(getLabel("groupProduct"));
        setDataFilter(dataGroupItem);
        break;
      }
      case AppConstant.ProductFilterType.thuong_hieu: {
        setPlaceholder(getLabel("searchBrandProduct"));
        setTitleModal(getLabel("brand"));
        setDataFilter(dataBrand)
        break;
      }
      case AppConstant.ProductFilterType.nghanh_hang: {
        setPlaceholder(getLabel("searchIndustryProduct"));
        setTitleModal(getLabel("industry"));
        setDataFilter(dataIndustry)
        break;
      }
      default : {
        setDataFilter([])
      }
    }
    if(filterRef.current){
      filterRef.current.snapToIndex(0)
    }
  }

  const onSearchFilterData = (txt : string)=>{
    setSearchFilter(txt)
    switch (filterType) {
      case AppConstant.ProductFilterType.nhom_sp: {
        const newArr = dataGroupItem.filter(item => item.label.includes(txt));
        setDataFilter(newArr)
        break;
      }
      case AppConstant.ProductFilterType.thuong_hieu: {
        const newArr = dataBrand.filter(item => item.label.includes(txt));
        setDataFilter(newArr)
        break;
      }
      case AppConstant.ProductFilterType.nghanh_hang: {
        const newArr = dataIndustry.filter(item => item.label.includes(txt));
        setDataFilter(newArr)
        break;
      }
      default : {
        setDataFilter([])
      }
    }
  }

  useEffect(() => {
    fetchBrandProduct();
    fetchIndustryProduct();
    fetchGroupProduct();
  }, [])

  useEffect(() => {
    fetchProduct();
  }, [filterBrand, filterIndustry, filterGroup, searchProduct,page])

  useEffect(() => {
    setSearchProduct(searchProductValue);
  }, [searchProductValue]);

  return (
    <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
      <AppHeader
        label={getLabel('product')}
        labelStyle={{ textAlign: 'left', marginLeft: 8 }}
        onBack={() => navigation.goBack()}
        rightButton={
          <TouchableOpacity
            onPress={() => navigation.navigate(ScreenConstant.SEARCH_PRODUCT)}>
            <Image
              source={ImageAssets.SearchIcon}
              style={{ width: 30, height: 30, tintColor: colors.text_secondary }}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        }
      />
      <FilterView
        style={{ marginTop: 16 }}
        onPress={() =>
          bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
        }
      />
      <View style={{ marginTop: 24 }}>
        <Text
          style={{ color: colors.text_primary, fontWeight: '500', fontSize: 16 }}>
          {totalItem}
          {'  '}
          <Text style={{ fontWeight: '400', fontSize: 14 }}>{getLabel("product").toLocaleLowerCase()}</Text>
        </Text>
        <FlatList
          data={data}
          renderItem={({ item }) => _renderItemProduct(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ height: '85%' }}
          onEndReached={() => setPage(page + 1)}
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
          style={{ paddingBottom: bottom + 16 }}
          onLayout={handleContentLayout}>
          <FilterListComponent
            title={titleModal}
            searchPlaceholder={placeholder}
            data={dataFilter}
            handleItem={handleItem}
            searchValue={searchFilter}
            onChangeSearch={(txt: string) => onSearchFilterData(txt)
            }
            onClose={() => filterRef.current && filterRef.current.close()}
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </MainLayout>
  );
};

interface TypeFilter {
  label: string,
  value: string | number
}

export default ListProduct;