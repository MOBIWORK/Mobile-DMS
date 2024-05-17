import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {MainLayout} from '../../../layouts';
import {
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppIcons,
  AppInput,
} from '../../../components/common';
import {AppConstant} from '../../../const';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {Searchbar, TextInput} from 'react-native-paper';
import {ImageAssets} from '../../../assets';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import FilterListComponent, {
  IFilterType,
} from '../../../components/common/FilterListComponent';
import {NavigationProp} from '../../../navigation/screen-type';
import {useSelector} from '../../../config/function';
import {dispatch} from '../../../utils/redux';
import {productActions} from '../../../redux-store/product-reducer/reducer';
import {IProduct} from '../../../models/types';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../utils';
import {AppTheme, useTheme} from '../../../layouts/theme';
import ItemSkeleton from './components/ItemSkeleton';
import ItemProductOrderComponent from './components/ItemProductOrderComponent';
import {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

const initFilterValue = {
  label: '',
  value: '',
  isSelected: false,
};

const SelectProducts = () => {
  const {colors} = useTheme();
  const {t: getLabel} = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRefData = useRef<BottomSheet>(null);
  const styles = createStyles(useTheme());

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const [isPending, startEffect] = useTransition();
  const [dataCategoryProduct, setdDtaCategoryProduct] = useState<IFilterType[]>(
    [],
  );
  const [dataBrandProduct, setDataBrandProduct] = useState<IFilterType[]>([]);
  const [dataIndustry, setDataIndustry] = useState<IFilterType[]>([]);

  const {
    totalItem,
    data: products,
    isLoading,
  } = useSelector(state => state.product);

  const dataProductSelected = useSelector(state => state.product.dataSelected);

  const [countSelect, setCountSelect] = useState<number>(0);
  const [data, setData] = useState<IProduct[]>([]);
  const [dataFilter, setDataFilter] = useState<IFilterType[]>([]);
  const [label, setLabel] = useState<string>('');
  const [category, setCategory] = useState<IFilterType>(initFilterValue);
  const [brand, setBrand] = useState<IFilterType>(initFilterValue);
  const [industry, setIndustry] = useState<IFilterType>(initFilterValue);
  const [isSearch, setShowSearch] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>('');
  const [productName, setProductName] = useState<string>('');

  const [filterProduct, setFilterProduct] = useState({
    brand: '',
    group: '',
    industry: '',
  });

  const openBottomSheetDataFilter = React.useCallback(
    (type: string, item?: IProduct) => {
      setDataFilter([]);
      const defautItem = {label: 'all', value: '', isSelected: false};
      switch (type) {
        case 'category':
          setLabel('groupProduct');
          setDataFilter([defautItem, ...dataCategoryProduct]);
          break;
        case 'brand':
          setLabel('trademark');
          setDataFilter([defautItem, ...dataBrandProduct]);
          break;
        case 'industry':
          setLabel('industry');
          setDataFilter([defautItem, ...dataIndustry]);
          break;
        case 'unit':
          setLabel('unit');
          if (item) {
            const newData = item.unit.map(unitItems => {
              return item.stock_uom === unitItems.uom
                ? {
                    label: unitItems.uom,
                    value: item.item_code,
                    isSelected: true,
                  }
                : {
                    label: unitItems.uom,
                    value: item.item_code,
                    isSelected: false,
                  };
            });
            setDataFilter(newData);
          }
          break;
        default:
          break;
      }
      if (bottomSheetRefData.current) {
        bottomSheetRefData.current.snapToIndex(0);
      }
    },
    [bottomSheetRefData.current],
  );

  const onSubmitFilter = () => {
    setFilterProduct({
      brand: brand.value?.toString() || '',
      industry: industry.value?.toString() || '',
      group: category.value?.toString() || '',
    });
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const resetFilter = () => {
    setCategory(initFilterValue);
    setBrand(initFilterValue);
    setIndustry(initFilterValue);
  };

  const bottomSheetFilter = React.useCallback(() => {
    return (
      <View
        style={{padding: 16, paddingTop: 0, height: '100%', marginTop: -25}}>
        <AppHeader
          label={getLabel('filter')}
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
            label={getLabel('groupProduct')}
            value={category?.label || getLabel('all')}
            editable={false}
            onPress={() => openBottomSheetDataFilter('category')}
            rightIcon={
              <TextInput.Icon
                onPress={() => openBottomSheetDataFilter('category')}
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={colors.text_secondary}
              />
            }
          />
          <AppInput
            label={getLabel('brand')}
            value={brand?.label || getLabel('all')}
            editable={false}
            onPress={() => openBottomSheetDataFilter('brand')}
            rightIcon={
              <TextInput.Icon
                onPress={() => openBottomSheetDataFilter('brand')}
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={colors.text_secondary}
              />
            }
          />
          <AppInput
            label={getLabel('industry')}
            value={industry?.label || getLabel('all')}
            editable={false}
            onPress={() => openBottomSheetDataFilter('industry')}
            rightIcon={
              <TextInput.Icon
                onPress={() => openBottomSheetDataFilter('industry')}
                icon={'chevron-down'}
                style={{width: 24, height: 24}}
                color={colors.text_secondary}
              />
            }
          />
        </View>
        <View style={styles.containerButton}>
          <AppButton
            style={{width: '45%', backgroundColor: colors.bg_neutral}}
            label={getLabel('reset')}
            styleLabel={{color: colors.text_secondary}}
            onPress={() => resetFilter()}
          />
          <AppButton
            style={{width: '45%'}}
            label={getLabel('apply')}
            onPress={() => onSubmitFilter()}
          />
        </View>
      </View>
    );
  }, [label, dataFilter]);

  const onChangeData = (item: IFilterType) => {
    let newData: any;
    switch (label) {
      case 'groupProduct': {
        startEffect(() => {
          newData = dataCategoryProduct.map(itemRes => {
            if (item.label === itemRes.label) {
              return {...itemRes, isSelected: true};
            } else {
              return {...itemRes, isSelected: false};
            }
          });
        });
        setCategory(item);
        setdDtaCategoryProduct(newData);
        break;
      }
      case 'trademark': {
        startEffect(() => {
          newData = dataBrandProduct.map(itemRes => {
            if (item.label === itemRes.label) {
              return {...itemRes, isSelected: true};
            } else {
              return {...itemRes, isSelected: false};
            }
          });
        });
        setBrand(item);
        setDataBrandProduct(newData);
        break;
      }
      case 'industry': {
        startEffect(() => {
          newData = dataIndustry.map(itemRes => {
            if (item.label === itemRes.label) {
              return {...itemRes, isSelected: true};
            } else {
              return {...itemRes, isSelected: false};
            }
          });
        });
        setIndustry(item);
        setDataIndustry(newData);
        break;
      }
      case 'unit': {
        startEffect(() => {
          const newProducts = data.map(item1 => {
            let priceUom = item1.unit.find(item2 => item2.uom === item.label);
            return item1.item_code === item.value
              ? {
                  ...item1,
                  stock_uom: item.label,
                  price: priceUom
                    ? Number(priceUom.conversion_factor) * item1.price
                    : 0,
                  stock_qty: priceUom ? Number(priceUom.conversion_factor) : 0,
                }
              : item1;
          });
          setData(newProducts);
        });
        break;
      }
      default:
        break;
    }

    if (bottomSheetRefData.current) {
      bottomSheetRefData.current.close();
    }
  };

  const onSelectProduct = React.useCallback(
    (id: string, isSelected: boolean) => {
      let newData: any;
      startEffect(() => {
        newData = data.map(item => {
          return item.item_code === id
            ? {...item, isSelected: !isSelected}
            : item;
        });
      });
      const numberSelect = newData.filter(
        (item: any) => item.isSelected == true,
      );
      setCountSelect(numberSelect.length);
      setData(newData);
    },
    [data],
  );

  const isSelectedAll = useMemo(() => {
    const dataSelect = data.filter(item => item.isSelected);
    return dataSelect.length > 0;
  }, [data]);

  const onSelectAllProduct = () => {
    const newData = data.map(item => ({...item, isSelected: !isSelectedAll}));
    if (isSelectedAll) {
      setCountSelect(0);
    } else {
      setCountSelect(data.length);
    }

    setData(newData);
  };

  const onChangeQuantityProduct = React.useCallback(
    (idItem: string, qty: number) => {
      const newData = data.map(item =>
        item.item_code === idItem ? {...item, quantity: qty} : item,
      );
      setData(newData);
    },
    [data],
  );

  const onSubmitProductSelect = async () => {
    const dataSelect = data.filter(item => item.isSelected);
    // if (dataProductSelected && dataProductSelected?.length > 0) {
    //   dispatch(
    //     productActions.setProductSelected(
    //       dataProductSelected.concat(dataSelect),
    //     ),
    //   );
    // } else {
    //
    // }
    dispatch(productActions.setProductSelected(dataSelect));

    navigation.goBack();
  };

  const animatedValue = useRef(new Animated.Value(1000)).current;

  const animatedStyle = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const debouncedSearch = CommonUtils.debounce(function (query: string) {
    setProductName(query);
  }, 1000);

  useEffect(() => {
    debouncedSearch(textSearch);
  }, [textSearch]);

  useEffect(() => {
    if (products?.length > 0) {
      setData(products);
    } else {
      setData([]);
    }
  }, [products]);

  useEffect(() => {
    dispatch(
      productActions.onGetData({
        item_group: filterProduct.group,
        brand: filterProduct.brand,
        industry: filterProduct.industry,
        item_name: productName,
      }),
    );
  }, [
    filterProduct.brand,
    filterProduct.group,
    filterProduct.industry,
    productName,
  ]);

  useEffect(() => {
    dispatch(productActions.resetDataProduct());
  }, [
    filterProduct.brand,
    filterProduct.group,
    filterProduct.industry,
    productName,
  ]);

  return (
    <>
      <MainLayout style={styles.layout}>
        <View style={styles.container}>
          <AppHeader
            label={getLabel('product')}
            onBack={() => navigation.goBack()}
            rightButton={
              <View style={[styles.flex, {columnGap: 16}]}>
                <TouchableOpacity
                  onPress={() =>
                    bottomSheetRef.current &&
                    bottomSheetRef.current.snapToIndex(0)
                  }>
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.IonIcon}
                    name={'filter'}
                    size={24}
                    color={colors.text_secondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowSearch(true);
                    animatedStyle();
                  }}>
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.Feather}
                    name={'search'}
                    size={22}
                    color={colors.text_secondary}
                  />
                </TouchableOpacity>
              </View>
            }
          />

          {isSearch && (
            <Animated.View
              style={[
                styles.containerSearh,
                styles.flex as any,
                {
                  marginTop: 16,
                  columnGap: 8,
                  transform: [{translateX: animatedValue}],
                },
              ]}>
              <Searchbar
                style={styles.searchStyle}
                placeholder={getLabel('searchProduct')}
                placeholderTextColor={colors.text_disable}
                icon={ImageAssets.SearchIcon}
                value={textSearch}
                autoFocus
                onChangeText={(txt: string) => setTextSearch(txt)}
                inputStyle={{color: colors.text_primary}}
              />
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Text
                  style={[styles.headerAction as any, {color: colors.action}]}>
                  {getLabel('cancel')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={[styles.flex as any, styles.titleContent]}>
          <TouchableOpacity onPress={() => onSelectAllProduct()}>
            <Text style={[styles.action]}>
              {!isSelectedAll ? getLabel('selectAll') : getLabel('deselectAll')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.filter as any, {color: colors.text_secondary}]}>
            {getLabel('total')} :{' '}
            <Text style={{color: colors.text_primary, fontWeight: '500'}}>
              {totalItem}{' '}
            </Text>
            {getLabel('product').toLowerCase()}
          </Text>
        </View>

        <View style={{flex: 1}}>
          {isLoading ? (
            <FlatList
              data={new Array(3)}
              renderItem={() => <ItemSkeleton />}
              contentContainerStyle={{rowGap: 16}}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{paddingHorizontal: 16, flex: 1}}>
              <FlatList
                data={data}
                renderItem={({item}) => (
                  <Pressable>
                    <ItemProductOrderComponent
                      item={item}
                      onSelectProduct={onSelectProduct}
                      openBottomSheetDataFilter={openBottomSheetDataFilter}
                      onChangeQuantityProduct={onChangeQuantityProduct}
                    />
                  </Pressable>
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={4}
                windowSize={11}
                decelerationRate={'fast'}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{rowGap: 16}}
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
              />
            </View>
          )}

          {countSelect > 0 && (
            <TouchableOpacity
              onPress={onSubmitProductSelect}
              style={[{position: 'absolute', left: 16, bottom: 50, right: 16}]}>
              <View style={[styles.flex, styles.actionSubmit]}>
                <Text style={[styles.action, {color: colors.bg_default}]}>
                  {countSelect} {getLabel('product').toLocaleLowerCase()}
                </Text>
                <View style={[styles.flex, {columnGap: 16}]}>
                  <Text style={[styles.headerAction]}>
                    {getLabel('continue')}
                  </Text>
                  <AppIcons
                    iconType={AppConstant.ICON_TYPE.AntIcon}
                    name="arrowright"
                    color={colors.bg_default}
                    size={18}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </MainLayout>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: 30}}
          onLayout={handleContentLayout}>
          {bottomSheetFilter()}
        </BottomSheetScrollView>
      </AppBottomSheet>
      <AppBottomSheet
        bottomSheetRef={bottomSheetRefData}
        snapPointsCustom={animatedSnapPoints}
        // @ts-ignore
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}>
        <BottomSheetScrollView
          style={{paddingBottom: 30}}
          onLayout={handleContentLayout}>
          <FilterListComponent
            title={getLabel(label)}
            data={dataFilter}
            handleItem={onChangeData}
            onClose={() =>
              bottomSheetRefData.current && bottomSheetRefData.current.close()
            }
          />
        </BottomSheetScrollView>
      </AppBottomSheet>
    </>
  );
};

export default memo(SelectProducts);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    containerSearh: {
      position: 'absolute',
      top: 0,
      left: 16,
      right: 16,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    actionSubmit: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      justifyContent: 'space-between',
      borderRadius: 16,
    } as ViewStyle,
    layout: {
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 0,
    } as ViewStyle,
    container: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    } as ViewStyle,
    headerAction: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      color: theme.colors.bg_default,
    } as TextStyle,
    flex: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    filter: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.text_primary,
    } as TextStyle,
    action: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
      color: theme.colors.action,
    } as TextStyle,
    containerButton: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingTop: 10,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignSelf: 'center',
    } as ViewStyle,
    titleContent: {
      justifyContent: 'space-between',
      marginTop: 24,
      paddingHorizontal: 16,
      marginBottom: 16,
    } as ViewStyle,
    searchStyle: {
      backgroundColor: theme.colors.bg_default,
      borderRadius: 10,
      height: 50,
      flex: 1,
    } as ViewStyle,
    calenderIcon: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 8,
      paddingHorizontal: 5,
    } as ViewStyle,
    containerUnit: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 8,
    } as ViewStyle,
  });
