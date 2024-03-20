import React, { useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { MainLayout } from '../../../layouts'
import AppContainer from '../../../components/AppContainer'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AppBottomSheet, AppButton, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { ICON_TYPE } from '../../../const/app.const'
import { TextInput } from 'react-native-paper'
import { AppConstant } from '../../../const'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { AppTheme, useTheme } from '../../../layouts/theme'
import { IOrderDetail, ItemProductOrder } from '../../../models/types'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from '../../../layouts/ErrorBoundary'
import { CommonUtils } from '../../../utils'
import ItemProduct from '../../../components/Order/ItemProduct'


const TabOverview = ({ data }: PropsType) => {

    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);
    const styles = createStyles(useTheme())
    const { t: getLabel } = useTranslation();

    const [productSelect, setProductSelect] = useState<ItemProductOrder>();
    const [discountProduct, setDiscountProduct] = useState<number>(0);
    const [totalPriceProduct, setTotalPriceProduct] = useState<number>(0);
    const status = CommonUtils.getStatusColor(data?.status ,colors)

    const onOpenBottomSheetProduct = (item: ItemProductOrder) => {
        setProductSelect(item);
        discountCalculation(item);
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(0);
        }
    }

    const discountCalculation = (item: ItemProductOrder) => {
        const isDiscount = item.discount_percentage / 100
        const priceDiscount = item.amount * isDiscount * item.qty
        setDiscountProduct(priceDiscount);
        setTotalPriceProduct((item.amount * item.qty) - priceDiscount)
    }

    const renderUiBottomSheet = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%', marginTop: -20 }}>
                <AppHeader
                    label={getLabel("product")}
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
                        label={getLabel("productCode")}
                        value={productSelect?.item_code || ""}
                        editable={false}
                        styles={{ backgroundColor: colors.bg_neutral }}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={getLabel("unit")}
                        value={productSelect?.uom || ""}
                        editable={false}
                        rightIcon={
                            <TextInput.Icon
                                icon={'chevron-down'}
                                style={styles.iconInput}
                                color={colors.text_secondary}
                            />
                        }
                    />
                    <AppInput
                        label={getLabel("unitPrice")}
                        value={productSelect?.amount ? CommonUtils.formatCash(productSelect.amount.toString()) : ""}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                        }
                    />
                    <AppInput
                        label={getLabel("quantity")}
                        value={productSelect?.qty.toString() || ""}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={`${getLabel("discount")} (%)`}
                        value={productSelect?.discount_percentage.toString() || ""}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="%" textStyle={{ fontSize: 20 }} />
                        }
                    />
                    <AppInput
                        label={getLabel("discount")}
                        value={CommonUtils.formatCash(discountProduct.toString())}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                        }
                    />
                    <AppInput
                        label={getLabel("intoMoney")}
                        value={CommonUtils.formatCash(totalPriceProduct.toString())}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                        }
                    />
                </View>
                <View style={styles.footerBttSheet}>
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
        <ErrorBoundary fallbackRender={ErrorFallback}>
            <MainLayout style={styles.layout} >
                <AppContainer>
                    <View style={{ paddingHorizontal: 16, rowGap: 24 ,marginTop: 10}}>
                        <View>
                            <View style={[styles.flexSpace]}>
                                <Text style={[styles.textLabel]}>{getLabel("customer")}</Text>
                                <TouchableOpacity>
                                    <Text style={[styles.textLabel, { color: colors.action }]}>{getLabel("detail")}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.divCustomer, styles.shadow, { backgroundColor: colors.bg_default }]}>
                                <Text style={[styles.inforCustomer]}>{data?.customer_name} - {data?.customer}</Text>
                                <View style={{ marginTop: 8, paddingTop: 8, borderColor: colors.border, borderTopWidth: 1 }}>
                                    <View style={[styles.flex, { marginTop: 4 }]}>
                                        <AppIcons iconType={ICON_TYPE.Feather} name='map-pin' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.KHinforDesc,{width :"90%"}]}>{data?.address_display}</Text>
                                    </View>
                                    <View style={[styles.flex, { marginTop: 4 }]}>
                                        <AppIcons iconType={ICON_TYPE.Feather} name='phone' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.KHinforDesc]}>{data?.contact_person}</Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                        <View>
                            <View style={[styles.flexSpace]}>
                                <Text style={[styles.textLabel]}>{getLabel("orderInfor")}</Text>
                                <TouchableOpacity>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 8, rowGap: 16 }}>

                                <View style={[styles.containerIfOd]}>

                                    <View style={[styles.orderInforE, styles.flexSpace]}>
                                        <Text style={[styles.labelDetail]}>{getLabel("status")}</Text>
                                        <Text style={[styles.textInforO]}>{getLabel(status.text) || "- - -"}</Text>
                                    </View>
                                    <View style={[styles.orderInforE, styles.flexSpace]}>
                                        <Text style={[styles.labelDetail]}>{getLabel("deliveryDate")}</Text>
                                        <Text style={[styles.textInforO]}>{data?.delivery_date ? CommonUtils.convertDate(data.delivery_date * 1000) : "- - -"}</Text>
                                    </View>
                                    <View style={[styles.orderInforE, styles.flexSpace, { borderColor: colors.bg_default }]}>
                                        <Text style={[styles.labelDetail]}>{getLabel("eXwarehouse")}</Text>
                                        <Text style={[styles.textInforO]}>{data?.set_warehouse}</Text>
                                    </View>

                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={[styles.flexSpace]}>
                                <Text style={[styles.textLabel]}>{getLabel("product")}</Text>
                                <TouchableOpacity>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerOrder]}>
                                {data?.list_items && data.list_items.map((item:ItemProductOrder,index : any) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => onOpenBottomSheetProduct(item)}
                                    >
                                        <ItemProduct
                                            dvt={item.uom}
                                            name={item.item_code}
                                            quantity={item.qty}
                                            price={item.amount}
                                            totalPrice={item.amount * item.qty}
                                            percentage_discount={item.discount_percentage.toString()}
                                            discount={(item.amount * (item.discount_percentage / 100)).toString()}
                                        />
                                    </Pressable>
                                ))}


                            </View>
                        </View>

                        <View>
                            <View style={[styles.flexSpace, { marginBottom: 8 }]}>
                                <Text style={[styles.textLabel]}>{getLabel("VAT")}</Text>
                                <TouchableOpacity>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerIfOd, { rowGap: 12, paddingVertical: 16 }]}>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("formVat")}</Text>
                                    <Text style={[styles.textInforO]}>{data?.taxes_and_charges}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("VAT")} (%) </Text>
                                    <Text style={[styles.textInforO]}>{data?.rate}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("VAT")} (VND)</Text>
                                    <Text style={[styles.textInforO]}>{CommonUtils.formatCash(data?.total_taxes_and_charges?.toString())}</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={[styles.flexSpace, { marginBottom: 8 }]}>
                                <Text style={[styles.textLabel]}>{getLabel("discount")}</Text>
                                <TouchableOpacity>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerIfOd, { rowGap: 12, paddingVertical: 16 }]}>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("typeDiscount")}</Text>
                                    <Text style={[styles.textInforO]}>{data?.apply_discount_on}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("discount")} (%) </Text>
                                    <Text style={[styles.textInforO]}>{data?.additional_discount_percentage}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("discount")} (VND)</Text>
                                    <Text style={[styles.textInforO]}>{CommonUtils.formatCash(data?.discount_amount?.toString())}</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={[styles.flexSpace, { marginBottom: 8 }]}>
                                <Text style={[styles.textLabel]}>{getLabel("detailPay")}</Text>
                                <TouchableOpacity>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerIfOd, { rowGap: 12, paddingVertical: 16 }]}>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("intoMoney")}</Text>
                                    <Text style={[styles.textInforO]}>{CommonUtils.formatCash(data?.total?.toString())}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("discount")}</Text>
                                    <Text style={[styles.textInforO]}>{CommonUtils.formatCash(data?.discount_amount?.toString())}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("VAT")} </Text>
                                    <Text style={[styles.textInforO]}>{CommonUtils.formatCash(data?.total_taxes_and_charges?.toString())}</Text>
                                </View>
                                <View style={[styles.flexSpace]}>
                                    <Text style={[styles.labelDetail]}>{getLabel("totalPrice")} </Text>
                                    <Text style={[styles.totalPrice]}>{CommonUtils.formatCash(data?.rounded_total?.toString())}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </AppContainer>

                <View style={styles.footerDetail}>
                    <View style={[styles.flexSpace, { alignItems: "flex-end", paddingHorizontal: 16 }]}>
                        <Text style={[styles.textLabel]}>{getLabel("totalPrice")} :</Text>
                        <Text style={[styles.totalPrice]}>{CommonUtils.formatCash(data?.grand_total ? data.grand_total.toString() : "")}</Text>
                    </View>
                </View>

                <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoints}>
                    {renderUiBottomSheet()}
                </AppBottomSheet>
            </MainLayout>
        </ErrorBoundary>
    )
}

interface PropsType {
    data: IOrderDetail | any
}

export default TabOverview;

const createStyles = (theme: AppTheme) => StyleSheet.create({
    layout: {
        backgroundColor: theme.colors.bg_neutral,
        paddingHorizontal: 0,
        marginTop : -35
    } as ViewStyle,
    iconInput: {
        width: 24,
        height: 24
    } as ImageStyle,
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    } as ViewStyle,
    flex: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    containerIfOd: {
        backgroundColor: theme.colors.bg_default,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16
    } as ViewStyle,
    textLabel: {
        color: theme.colors.text_secondary,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    } as TextStyle,
    labelDetail: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400",
        color: theme.colors.text_disable,
        marginBottom: 4
    } as TextStyle,
    divCustomer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 8,
        borderRadius: 16
    },
    inforCustomer: {
        color: theme.colors.text_primary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    } as TextStyle,
    inforDesc: {
        color: theme.colors.text_primary,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    } as TextStyle,
    KHinforDesc: {
        color: theme.colors.text_primary,
        marginLeft: 6,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    } as TextStyle,
    shadow: {
        shadowColor: "#919EAB",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    orderInforE: {
        borderColor: theme.colors.border,
        paddingVertical: 12,
        borderBottomWidth: 1
    },
    textInforO: {
        color: theme.colors.text_primary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    } as TextStyle,
    totalPrice: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: "500",
        color: theme.colors.text_primary
    } as TextStyle,
    footerBttSheet: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
    } as ViewStyle,
    footerDetail: {
        paddingVertical: 16,
        backgroundColor: theme.colors.bg_default,
        borderColor: theme.colors.border,
        borderTopWidth: 1
    } as ViewStyle,
    itemPro: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    } as ViewStyle,
    containerOrder: {
        backgroundColor: theme.colors.bg_default,
        marginTop: 8,
        borderRadius: 16,
        rowGap: 8,
        padding: 16
    } as ViewStyle
})