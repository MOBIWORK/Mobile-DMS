import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { AppBottomSheet, AppButton, AppContainer, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { ApiConstant, AppConstant } from '../../../const'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Text, TextInput as Input, TextStyle, View, ViewStyle, Pressable,TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'

import { StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { ImageAssets } from '../../../assets'
import { Checkbox } from 'react-native-paper'
import { ICON_TYPE } from '../../../const/app.const'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import FilterListComponent, { IFilterType } from '../../../components/common/FilterListComponent'
import { NavigationProp } from '../../../navigation'
import { useSelector } from '../../../config/function'
import { dispatch } from '../../../utils/redux'
import { productActions } from '../../../redux-store/product-reducer/reducer'
import { IProduct, KeyAbleProps } from '../../../models/types'
import { ProductService } from '../../../services'
import { useTranslation } from 'react-i18next'
import { CommonUtils } from '../../../utils'

const initFilterValue = {
    label: "",
    value: "",
    isSelected: false
}

const SelectProducts = () => {

    const { colors } = useTheme();
    const { t: getLabel } = useTranslation();
    const navigation = useNavigation<NavigationProp>()
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefData = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['85%'], []);

    const [dataCategoryProduct, setdDtaCategoryProduct] = useState<IFilterType[]>([]);
    const [dataBrandProduct, setDataBrandProduct] = useState<IFilterType[]>([]);
    const [dataIndustry, setDataIndustry] = useState<IFilterType[]>([]);
    const { totalItem, data: products } = useSelector(state => state.product);
    const [data, setData] = useState<IProduct[]>([]);
    const [dataFilter, setDataFilter] = useState<IFilterType[]>([]);
    const [label, setLabel] = useState<string>('');
    const [category, setCategory] = useState<IFilterType>(initFilterValue);
    const [brand, setBrand] = useState<IFilterType>(initFilterValue);
    const [industry, setIndustry] = useState<IFilterType>(initFilterValue);

    const [filterProduct, setFilterProduct] = useState({
        brand: "",
        group: "",
        industry: ""
    })
    const [textSearch, setTextSearch] = useState<string>("");

    const openBottomSheetDataFilter = (type: string, item?: IProduct) => {
        setDataFilter([]);
        const defautItem = { label: "all", value: "", isSelected: false }
        switch (type) {
            case 'category':
                setLabel("groupProduct");
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
                    const units = item.details;
                    const newData = units.map(item1 => {
                        return item.stock_uom === item1.uom ? { label: item1.uom, value: item.item_code, isSelected: true } : { label: item1.uom, value: item.item_code, isSelected: false }
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
    };

    const renderUiItem = (item: IProduct) => {
        return (
            <View style={[styles.itemProduct, { backgroundColor: item.isSelected ? "rgba(196, 22, 28, 0.08)" : colors.bg_default }]}>
                <View style={[styles.flex as any, { alignItems: "flex-start" }]}>
                    <View style={{ paddingTop: 12, marginRight: 4 }}>
                        <Checkbox
                            color={colors.primary}
                            onPress={() => onSelectProduct(item.item_code, item.isSelected ? item.isSelected : false)}
                            uncheckedColor={colors.text_secondary}
                            status={item.isSelected ? 'checked' : 'unchecked'}
                        />
                    </View>

                    <View style={{ flex: 1 }}>

                        <View style={[styles.flex as any, styles.itemRowIf, styles.itemRowIf, { borderColor: colors.border }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>{getLabel("productCode")}</Text>
                            <View style={[styles.flex as any]}>
                                <AppIcons
                                    iconType={ICON_TYPE.IonIcon}
                                    name="barcode-outline"
                                    size={18}
                                    color={colors.text_primary}
                                />
                                <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_primary, marginLeft: 4 }]}>{item.item_code}</Text>
                            </View>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>{getLabel("unt")}</Text>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => openBottomSheetDataFilter("unit",item)}>
                                <View style={[styles.flex as any, { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingVertical: 8 }]}>
                                    <Text style={[styles.filter as TextStyle, { color: colors.text_primary, marginHorizontal: 20 }]}>{item.stock_uom}</Text>
                                    <AppIcons
                                        iconType={ICON_TYPE.Feather}
                                        name="chevron-down"
                                        size={18}
                                        color={colors.text_primary}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border,paddingVertical : 4}]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>{getLabel("quantity")}</Text>
                            <View style={[styles.flex as any]}>
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 10}}
                                    onPress={() => onChangeQuantityProduct(item.item_code, item.quantity && item.quantity > item.min_order_qty ? item.quantity - 1 : item.min_order_qty)}
                                >
                                    <AppIcons
                                        iconType={ICON_TYPE.AntIcon}
                                        name="minus"
                                        size={22}
                                        color={colors.text_primary}
                                    />
                                </TouchableOpacity>

                                <Input
                                    value={item.quantity ? item.quantity.toString() : ""}
                                    onChangeText={(qty: string) => onChangeQuantityProduct(item.item_code, parseInt(qty))}
                                    keyboardType='numeric'
                                    style={[styles.labelIfPrd as any, { width: 50, textAlign: "center" }]}
                                />

                                <TouchableOpacity
                                    style={{ paddingHorizontal: 10}}
                                    onPress={() => onChangeQuantityProduct(item.item_code, item.quantity ? item.quantity + 1 : 2)}

                                >
                                    <AppIcons
                                        iconType={ICON_TYPE.IonIcon}
                                        name="add"
                                        size={22}
                                        color={colors.text_primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border}]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>{getLabel("unitPrice")}</Text>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_primary, marginLeft: 4 }]}>{CommonUtils.formatCash(item.price.toString())}</Text>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border,borderBottomWidth : 0  }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>{getLabel("expired")}</Text>
                            <TouchableOpacity activeOpacity={0.6}>
                                <View style={[styles.flex as any, { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingVertical: 8, paddingHorizontal: 5 }]}>
                                    <Text style={[styles.filter as TextStyle, { color: colors.text_primary, marginHorizontal: 5 }]}>{CommonUtils.convertDate(item.end_of_life)}</Text>
                                    <AppIcons
                                        iconType={ICON_TYPE.MaterialCommunity}
                                        name="calendar-month-outline"
                                        size={18}
                                        color={colors.text_secondary}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    const onSubmitFilter = () => {
        setFilterProduct({
            brand: brand.value?.toString() || "",
            industry: industry.value?.toString() || "",
            group: category.value?.toString() || ""
        })
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close()
        }
    }

    const resetFilter = () => {
        setCategory(initFilterValue);
        setBrand(initFilterValue);
        setIndustry(initFilterValue);
    }

    const bottomSheetFilter = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%', marginTop: -25 }}>
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
                        value={category?.label || getLabel("all")}
                        editable={false}
                        onPress={() => openBottomSheetDataFilter("category")}
                        rightIcon={
                            <TextInput.Icon
                                onPress={() => openBottomSheetDataFilter("category")}
                                icon={'chevron-down'}
                                style={{ width: 24, height: 24 }}
                                color={colors.text_secondary}
                            />
                        }
                    />
                    <AppInput
                        label={getLabel("brand")}
                        value={brand?.label || getLabel("all")}
                        editable={false}
                        onPress={() => openBottomSheetDataFilter("brand")}
                        rightIcon={
                            <TextInput.Icon
                                onPress={() => openBottomSheetDataFilter("brand")}
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
                        onPress={() => openBottomSheetDataFilter("industry")}
                        rightIcon={
                            <TextInput.Icon
                                onPress={() => openBottomSheetDataFilter("industry")}
                                icon={'chevron-down'}
                                style={{ width: 24, height: 24 }}
                                color={colors.text_secondary}
                            />
                        }
                    />
                </View>
                <View
                    style={styles.containerButton}>
                    <AppButton
                        style={{ width: '45%', backgroundColor: colors.bg_neutral }}
                        label={getLabel("reset")}
                        styleLabel={{ color: colors.text_secondary }}
                        onPress={() => resetFilter()}
                    />
                    <AppButton
                        style={{ width: '45%' }}
                        label={getLabel("apply")}
                        onPress={() => onSubmitFilter()}
                    />
                </View>
            </View>
        );
    };

    const onChangeData = (item: IFilterType) => {
        switch (label) {
            case 'groupProduct': {
                const newData = dataCategoryProduct.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setCategory(item);
                setdDtaCategoryProduct(newData);
                break;
            }
            case 'trademark': {
                const newData = dataBrandProduct.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setBrand(item);
                setDataBrandProduct(newData);
                break;
            }
            case 'industry': {
                const newData = dataIndustry.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setIndustry(item);
                setDataIndustry(newData);
                break;
            }
            case 'unit': {
                const newProducts = data.map(item1 => {
                    let priceUom = item1.details.find(item2 => item2.uom === item.label);
                    return item1.item_code === item.value ? ({ ...item1, stock_uom: item.label ,price : priceUom ? priceUom.price_list_rate : 0 }) : item1
                });
                setData(newProducts);
                break;
            }
            default:
                break;
        }

        if (bottomSheetRefData.current) {
            bottomSheetRefData.current.close();
        }
    };

    const onSelectProduct = (id: string, isSelected: boolean) => {
        const newData = data.map(item => {
            return item.item_code === id ? { ...item, isSelected: !isSelected} : item
        });
        setData(newData);
    }
    
    const isSelected = useMemo(()=>{
        const dataSelect = data.filter(item => item.isSelected);
        return dataSelect.length > 0 ? false : true
    },[data])

    const onSelectAllProduct = ()=>{
        const newData = data.map(item => ({...item , isSelected : isSelected}));
        setData(newData);
    }

    const onChangeQuantityProduct = (idItem: string, qty: number) => {
        const newData = data.map(item => item.item_code === idItem ? { ...item, quantity: qty } : item);
        setData(newData);
    }

    const onSubmitProductSelect = async () => {
        const dataSelect = data.filter(item => item.isSelected);
        dispatch(productActions.setProductSelected(dataSelect));
        navigation.goBack();
    }

    const fetchBrandProduct = async () => {
        const { status, data }: KeyAbleProps = await ProductService.getBrand();
        if (status === ApiConstant.STT_OK) {
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
            setDataBrandProduct(newData)
        }
    }

    const fetchIndustryProduct = async () => {
        const { data, status }: KeyAbleProps = await ProductService.getIndustry();
        if (status === ApiConstant.STT_OK) {
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
        if (status === ApiConstant.STT_OK) {
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
            setdDtaCategoryProduct(newData)
        }
    }

    useEffect(() => {
        fetchBrandProduct();
        fetchGroupProduct();
        fetchIndustryProduct();
    }, [])

    useEffect(() => {
        const newDaata = products.map(item => {
            let priceUom = item.details.find(item2 => item2.uom === item.stock_uom);
            let neItem = {...item,price : priceUom ? priceUom.price_list_rate : 0}
            return item.min_order_qty === 0 ? {...neItem , quantity : 1 , discount : 0} : {...neItem , quantity : item.min_order_qty ,discount :0}
        })
        setData(newDaata)
    }, [products])

    useEffect(() => {
        dispatch(productActions.onGetData({
            item_group: filterProduct.group,
            brand: filterProduct.brand,
            industry: filterProduct.industry
        }))
    }, [filterProduct.brand, filterProduct.group, filterProduct.industry])

    return (
        <>
            <MainLayout style={{ backgroundColor: colors.bg_neutral, paddingHorizontal: 0 }}>
                <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 16, paddingBottom: 16 }}>
                    <AppHeader
                        label={getLabel("product")}
                        onBack={() => navigation.goBack()}
                        backButtonIcon={
                            <AppIcons
                                iconType={AppConstant.ICON_TYPE.IonIcon}
                                name={'close'}
                                size={24}
                                color={colors.text_primary}
                            />
                        }
                        rightButton={
                            <TouchableOpacity
                                onPress={onSubmitProductSelect}
                            >
                                <Text style={[styles.headerAction as any, { color: colors.action }]}>{getLabel("continue")}</Text>
                            </TouchableOpacity>}
                    />
                    <View style={[styles.flex as any, { marginTop: 16 }]}>
                        <Searchbar
                            style={{
                                backgroundColor: colors.bg_neutral,
                                borderRadius: 10,
                                height: 50,
                                flex: 1
                            }}
                            placeholder={getLabel("searchProduct")}
                            placeholderTextColor={colors.text_disable}
                            icon={ImageAssets.SearchIcon}
                            value={textSearch}
                            onChangeText={(txt: string) => setTextSearch(txt)}
                            inputStyle={{ color: colors.text_primary }}
                        />
                        <TouchableOpacity onPress={() => bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}>
                            <View style={[styles.flex as any, { paddingHorizontal: 10 }]}>
                                <AppIcons
                                    iconType={AppConstant.ICON_TYPE.IonIcon}
                                    name={'filter'}
                                    size={24}
                                    color={colors.text_secondary}
                                />
                                <Text style={[styles.filter as any, { color: colors.text_primary, marginLeft: 4 }]}>{getLabel("fill")}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={[styles.flex as any, { justifyContent: "space-between", marginTop: 24, paddingHorizontal: 16, marginBottom: 16 }]}>
                    <TouchableOpacity onPress={() => onSelectAllProduct()}>
                        <Text style={[styles.action as any, { color: colors.action }]}>
                            {isSelected ?  getLabel("selectAll") : getLabel("deselectAll")}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.filter as any, { color: colors.text_secondary }]}>{getLabel("total")} : <Text style={{ color: colors.text_primary, fontWeight: "500" }}>{totalItem} {` `}</Text>
                        {getLabel("product").toLowerCase()}
                    </Text>
                </View>
                <AppContainer>
                    <View style={{ paddingHorizontal: 16, rowGap: 16 }}>
                        {data.map(item => (
                            <Pressable key={item.item_code}>
                                {renderUiItem(item)}
                            </Pressable>
                        ))}

                    </View>
                </AppContainer>
            </MainLayout>
            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoints}>
                {bottomSheetFilter()}
            </AppBottomSheet>
            <AppBottomSheet
                bottomSheetRef={bottomSheetRefData}
                snapPointsCustom={snapPoints}>
                <FilterListComponent
                    title={getLabel(label)}
                    data={dataFilter}
                    handleItem={onChangeData}
                    onClose={() =>
                        bottomSheetRefData.current && bottomSheetRefData.current.close()
                    }
                />
            </AppBottomSheet>
        </>

    )
}

export default SelectProducts;

const styles = StyleSheet.create({
    headerAction: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    },
    flex: {
        flexDirection: "row",
        alignItems: "center"
    },
    filter: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    },
    action: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    },
    labelIfPrd: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    },
    itemProduct: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16
    },
    itemRowIf: {
        paddingVertical: 12,
        justifyContent: "space-between",
        borderBottomWidth: 1
    },
    containerButton: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
    } as ViewStyle
})