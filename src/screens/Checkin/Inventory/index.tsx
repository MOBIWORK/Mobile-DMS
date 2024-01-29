import React, { useMemo, useRef, useState } from 'react';
import { MainLayout } from '../../../layouts';
import { AppBottomSheet, AppButton, AppContainer, AppHeader, AppIcons, AppInput } from '../../../components/common';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import { ImageAssets } from '../../../assets';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { NavigationProp } from '../../../navigation';
import { ICON_TYPE } from '../../../const/app.const';
import SwipeableItem from './components/SwipeableItem';
import { ApiConstant, AppConstant, ScreenConstant } from '../../../const';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useSelector } from '../../../config/function';
import { IProduct } from '../../../models/types';
import { CommonUtils } from '../../../utils';
import { dispatch } from '../../../utils/redux';
import { productActions } from '../../../redux-store/product-reducer/reducer';
import { CheckinService } from '../../../services';

const CheckinInventory = () => {

    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { t: getLabel } = useTranslation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefDetail = useRef<BottomSheet>(null);
    const snapPointsDetailPr = useMemo(() => ['60%'], []);
    const [detailProduct, setDetailProduct] = useState<IProduct>();
    const products = useSelector(state => state.product.dataSelected);


    const isDisabled = useMemo(()=> products.length > 0 ? false : true,[products]);

    const onBackScreen = ()=>{
        dispatch(productActions.setProductSelected([]))
        navigation.goBack()
    }

    const onSubmit = async () => { 
        const newItems = products.map(item => ({
            item_code : item.item_code,
            item_unit : item.stock_uom,
            quantity : item.quantity,
            exp_time : new Date(item.end_of_life).getTime() / 1000
        }))
        const objectData = {
            "customer_code": "Anh Hoà",//id khách hàng
            "customer_id": "BH0068106122023",//mã khách hàng
            "customer_name": "Anh Hòa",//tên khách hàng
            "customer_address": "120/62 Ngọc Hà, Ngọc Hà, Ba Đình, Hà Nội",
            "inventory_items":newItems
        }
        const {status ,data} = await CheckinService.checkinInventory(objectData);
        if(status === ApiConstant.STT_OK){
            onBackScreen();
        }
    }

    const removeItem = (id: string) => {
        const newProducts = products.filter(item => item.item_code !== id);
        dispatch(productActions.setProductSelected(newProducts))
    }

    const renderItem = (item: IProduct) => {
        return (
            <SwipeableItem handlerClick={() => removeItem(item.item_code)}>
                <View style={[styles.flexSpace as any, styles.item, { alignItems: "flex-start", backgroundColor: colors.bg_default, }]}>
                    <View>
                        <View style={[styles.flex as any, { columnGap: 5 }]}>
                            <AppIcons
                                iconType={ICON_TYPE.IonIcon}
                                name="barcode-outline"
                                size={20}
                                color={colors.text_primary}
                            />
                            <Text style={[styles.nameProduct as any, { color: colors.text_primary }]}>{item.item_code}</Text>
                        </View>
                        <Text style={[styles.dateProduct as any, { color: colors.text_secondary }]}>
                            {getLabel("expired")} : {CommonUtils.convertDate(item.end_of_life)}
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={[styles.dateProduct as any, {}]}>
                            {getLabel("unt")} : <Text style={{ color: colors.text_primary, fontWeight: "500" }}>{item.stock_uom}</Text>
                        </Text>
                        <Text style={[styles.dateProduct as any, { marginTop: 8 }]} >
                            {getLabel("quantity")} : <Text style={{ color: colors.text_primary, fontWeight: "500" }}>
                                {item.quantity}</Text>
                        </Text >
                    </View>
                </View>
            </SwipeableItem>
        )
    }

    const openBottonSheetDetail = (item: IProduct) => {
        setDetailProduct(item);
        if (bottomSheetRefDetail.current) {
            bottomSheetRefDetail.current.snapToIndex(0)
        }
    }

    const renderUiBottomSheetDetailProduct = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%', marginTop: -20 }}>
                <AppHeader
                    label={getLabel("product")}
                    onBack={() =>
                        bottomSheetRefDetail.current && bottomSheetRefDetail.current.close()
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
                        label={getLabel("productCode")}
                        value={detailProduct?.item_code || ""}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={getLabel("unit")}
                        value={detailProduct?.stock_uom || ""}
                        editable={false}
                        rightIcon={
                            <TextInput.Icon
                                icon={'chevron-down'}
                                style={{ width: 24, height: 24 }}
                                color={colors.text_secondary}
                            />
                        }
                    />
                    <AppInput
                        label={getLabel("quantity")}
                        value={detailProduct?.quantity?.toString() || ""}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={getLabel("expired")}
                        value={detailProduct?.end_of_life ? CommonUtils.convertDate(detailProduct.end_of_life) : ""}
                        editable={false}
                        rightIcon={
                            <TextInput.Icon
                                icon={'calendar-month-outline'}
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
                    }}>
                    <AppButton
                        style={{ width: '45%', backgroundColor: colors.bg_neutral }}
                        label={getLabel("cancel")}
                        styleLabel={{ color: colors.text_secondary }}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}
                    />
                    <AppButton
                        style={{ width: '45%' }}
                        label={getLabel("update")}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}

                    />
                </View>
            </View>
        );
    };

    return (
        <MainLayout style={{ backgroundColor: colors.bg_neutral }}>
            <AppHeader label={getLabel("inventoryControl")} onBack={onBackScreen} />

            {products.length > 0 && (
                <View style={[styles.flexSpace as any, { marginTop: 40, marginBottom: 8 }]}>
                    <Text style={[styles.titile as any, { color: colors.text_secondary }]}>{getLabel("listProduct")}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <IconButton
                            style={{ borderColor: colors.action, marginRight: 8 }}
                            mode='outlined'
                            icon="plus"
                            iconColor={colors.action}
                            size={16}
                            onPress={() => navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)}
                        />
                        <IconButton
                            style={{ borderColor: colors.action }}
                            mode='outlined'
                            icon="barcode-scan"
                            iconColor={colors.action}
                            size={16}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>
                </View>
            )}

            <AppContainer>

                {products.length > 0 && (
                    <View style={{ rowGap: 16 }}>
                        {products.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => openBottonSheetDetail(item)} activeOpacity={0.5}>
                                {renderItem(item)}
                            </TouchableOpacity>

                        ))}

                    </View>

                )}

                {products.length == 0 && (
                    <View style={[styles.containerNodata as any]}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={[styles.iconImage]} source={ImageAssets.IconBill} resizeMode='cover' />
                            <Text style={[styles.textInventory as any, { color: colors.text_disable, marginTop: 8 }]}>
                                {getLabel("selectProductInvetory")}
                            </Text>
                        </View>
                        <View style={[styles.flexSpace as any, { marginTop: 24 }]}>
                            <Button
                                style={{ width: "45%", marginRight: 16, borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textInventory as any, { fontWeight: "500" }]}
                                icon="plus" mode="outlined"
                                onPress={() => navigation.navigate(ScreenConstant.CHECKIN_SELECT_PRODUCT)}
                            >
                                {getLabel("selectProduct")}
                            </Button>
                            <Button
                                style={{ width: "45%", borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textInventory as any, { fontWeight: "500" }]}
                                icon="barcode-scan" mode="outlined" onPress={() => console.log('Pressed')}>
                                {getLabel("scanCode")}
                            </Button>
                        </View>
                    </View>
                )}

            </AppContainer>

            <AppButton 
                disabled={isDisabled} 
                label={getLabel("completed")} 
                style={{ width: "100%", marginBottom: 20 ,backgroundColor : isDisabled ? colors.bg_disable : colors.primary}} 
                onPress={onSubmit} 
            />
            <AppBottomSheet bottomSheetRef={bottomSheetRefDetail} snapPointsCustom={snapPointsDetailPr}>
                {renderUiBottomSheetDetailProduct()}
            </AppBottomSheet>
        </MainLayout>
    )
}

export default CheckinInventory;

const styles = StyleSheet.create({
    containerNodata: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    flex: {
        flexDirection: "row",
        alignItems: "center"
    },
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconImage: {
        width: 67,
        height: 57,
    },
    textInventory: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    },
    titile: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    },
    nameProduct: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    },
    dateProduct: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 12
    }
})