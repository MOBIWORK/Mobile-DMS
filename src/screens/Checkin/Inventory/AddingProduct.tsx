import React, { useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { AppBottomSheet, AppButton, AppContainer, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { AppConstant } from '../../../const'
import { useNavigation, useTheme } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, TextInput as Input, TextStyle, View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { ImageAssets } from '../../../assets'
import { Checkbox } from 'react-native-paper'
import { ICON_TYPE } from '../../../const/app.const'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import FilterListComponent, { IFilterType } from '../../../components/common/FilterListComponent'
import { NavigationProp } from '../../../navigation'

const AddingProduct = () => {

    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>()
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefData = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['85%'], []);

    const [dataCategoryProduct, setdDtaCategoryProduct] = useState<IFilterType[]>([
        {
            label: 'Tất cả',
            isSelected: true,
        },
        {
            label: 'Laptop',
            isSelected: false,
        },
        {
            label: 'Thực phẩm sạch',
            isSelected: false,
        },
        {
            label: 'Sữa tươi',
            isSelected: false,
        },
    ]);
    const [dataBrandProduct, setDataBrandProduct] = useState<IFilterType[]>([
        {
            label: 'Tất cả',
            isSelected: true,
        },
        {
            label: 'Mikenco',
            isSelected: false,
        },
        {
            label: 'Dell',
            isSelected: false,
        },
        {
            label: 'Hà Nội',
            isSelected: false,
        },
        {
            label: 'Vlakdak',
            isSelected: false,
        },
    ]);
    const [dataIndustry, setDataIndustry] = useState<IFilterType[]>([
        {
            label: 'Tất cả',
            isSelected: true,
        },
        {
            label: 'Hàng không vũ trụ',
            isSelected: false,
        },
    ]);

    const [dataFilter, setDataFilter] = useState<IFilterType[]>([]);
    const [label, setLabel] = useState<string>('');
    const [category, setCategory] = useState<string>('Tất cả');
    const [brand, setBrand] = useState<string>('Tất cả');
    const [industry, setIndustry] = useState<string>('Tất cả');

    const openBottomSheetDataFilter = (type: string) => {
        switch (type) {
            case 'category':
                setLabel('Nhóm sản phẩm');
                setDataFilter(dataCategoryProduct);
                break;
            case 'brand':
                setLabel('Nhãn hiệu');
                setDataFilter(dataBrandProduct);
                break;
            case 'industry':
                setLabel('Ngành hàng');
                setDataFilter(dataIndustry);
                break;
            default:
                setDataFilter([]);
                break;
        }
        if (bottomSheetRefData.current) {
            bottomSheetRefData.current.snapToIndex(0);
        }
    };

    const renderUiItem = () => {

        const [checked, setChecked] = useState<boolean>(false);
        const [quantity, setQuantity] = useState<string>("1")

        return (
            <View style={[styles.itemProduct, { backgroundColor: checked ? "rgba(196, 22, 28, 0.08)" : colors.bg_default }]}>
                <View style={[styles.flex as any, { alignItems: "flex-start" }]}>
                    <View style={{ paddingTop: 12, marginRight: 4 }}>
                        <Checkbox
                            color={colors.primary}
                            uncheckedColor={colors.text_secondary}
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>

                        <View style={[styles.flex as any, styles.itemRowIf, styles.itemRowIf, { borderColor: colors.border }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>Mã sp</Text>
                            <View style={[styles.flex as any]}>
                                <AppIcons
                                    iconType={ICON_TYPE.IonIcon}
                                    name="barcode-outline"
                                    size={18}
                                    color={colors.text_primary}
                                />
                                <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_primary, marginLeft: 4 }]}>SP-123554</Text>
                            </View>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>ĐVT</Text>
                            <TouchableOpacity activeOpacity={0.6}>
                                <View style={[styles.flex as any, { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingVertical: 8 }]}>
                                    <Text style={[styles.filter as TextStyle, { color: colors.text_primary, marginHorizontal: 20 }]}>Cái</Text>
                                    <AppIcons
                                        iconType={ICON_TYPE.Feather}
                                        name="chevron-down"
                                        size={18}
                                        color={colors.text_primary}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.flex as any, styles.itemRowIf, { borderColor: colors.border }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>Số lượng</Text>
                            <View style={[styles.flex as any]}>
                                <TouchableOpacity
                                    onPress={() => setQuantity((parseInt(quantity) - 1).toString())}
                                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                                >
                                    <AppIcons
                                        iconType={ICON_TYPE.AntIcon}
                                        name="minus"
                                        size={22}
                                        color={colors.text_primary}
                                    />
                                </TouchableOpacity>

                                <Input
                                    onChangeText={(txt: string) => setQuantity(txt)}
                                    value={quantity.toString()}
                                    keyboardType='numeric'
                                    style={[styles.labelIfPrd as any, { width: 50, textAlign: "center" }]}
                                />

                                <TouchableOpacity
                                    onPress={() => setQuantity((parseInt(quantity) + 1).toString())}
                                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
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

                        <View style={[styles.flex as any, styles.itemRowIf, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.labelIfPrd as TextStyle, { color: colors.text_disable }]}>HSD</Text>
                            <TouchableOpacity activeOpacity={0.6}>
                                <View style={[styles.flex as any, { borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingVertical: 8, paddingHorizontal: 5 }]}>
                                    <Text style={[styles.filter as TextStyle, { color: colors.text_primary, marginHorizontal: 5 }]}>20/10/2024</Text>
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

    }

    const bottomSheetFilter = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%' ,marginTop : -25}}>
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
                <View style={{ marginTop: 32, rowGap: 24 }}>
                    <AppInput
                        label={'Nhóm sản phẩm'}
                        value={category}
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
                        label={'Nhãn hiệu'}
                        value={brand}
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
                        label={'Ngành hàng'}
                        value={industry}
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
                        style={{ width: '45%', backgroundColor: colors.bg_neutral }}
                        label={'Bỏ qua'}
                        styleLabel={{ color: colors.text_secondary }}
                        onPress={() =>
                            bottomSheetRef.current && bottomSheetRef.current.close()
                        }
                    />
                    <AppButton
                        style={{ width: '45%' }}
                        label={'Áp dụng'}
                        onPress={() => onSubmitFilter()}
                    />
                </View>
            </View>
        );
    };

    const onChangeData = (item: IFilterType) => {
        switch (label) {
            case 'Nhóm sản phẩm': {
                const newData = dataCategoryProduct.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setCategory(item.label);
                setdDtaCategoryProduct(newData);
                break;
            }
            case 'Nhãn hiệu': {
                const newData = dataBrandProduct.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setBrand(item.label);
                setDataBrandProduct(newData);
                break;
            }
            case 'Ngành hàng': {
                const newData = dataIndustry.map(itemRes => {
                    if (item.label === itemRes.label) {
                        return { ...itemRes, isSelected: true };
                    } else {
                        return { ...itemRes, isSelected: false };
                    }
                });
                setIndustry(item.label);
                setDataIndustry(newData);
                break;
            }

            default:
                break;
        }

        if (bottomSheetRefData.current) {
            bottomSheetRefData.current.close();
        }
    };

    return (
        <>
            <MainLayout style={{ backgroundColor: colors.bg_neutral, paddingHorizontal: 0 }}>
                <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 16, paddingBottom: 16 }}>
                    <AppHeader
                        label={'Chọn sản phẩm'}
                        onBack={()=> navigation.goBack()}
                        backButtonIcon={
                            <AppIcons
                                iconType={AppConstant.ICON_TYPE.IonIcon}
                                name={'close'}
                                size={24}
                                color={colors.text_primary}
                            />
                        }
                        rightButton={
                            <TouchableOpacity>
                                <Text style={[styles.headerAction as any, { color: colors.action }]}>Tiếp tục</Text>
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
                            placeholder={"Tìm kiếm sản phẩm ..."}
                            placeholderTextColor={colors.text_disable}
                            icon={ImageAssets.SearchIcon}
                            value={""}
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
                                <Text style={[styles.filter as any, { color: colors.text_primary, marginLeft: 4 }]}>Lọc</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={[styles.flex as any, { justifyContent: "space-between", marginTop: 24, paddingHorizontal: 16, marginBottom: 16 }]}>
                    <TouchableOpacity>
                        <Text style={[styles.action as any, { color: colors.action }]}>Chọn tất cả</Text>
                    </TouchableOpacity>
                    <Text style={[styles.filter as any, { color: colors.text_secondary }]}>Tổng : <Text style={{ color: colors.text_primary, fontWeight: "500" }}>120</Text> sản phẩm</Text>
                </View>
                <AppContainer>
                    <View style={{ paddingHorizontal: 16 }}>
                        {renderUiItem()}
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
                    title={label}
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

export default AddingProduct;

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
    }
})