import React, { useMemo, useRef } from 'react'
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


const TabOverview = () => {

    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['75%'], []);
    const styles = createStyles(useTheme())

    const renderUiBottomSheet = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%', marginTop: -20 }}>
                <AppHeader
                    label={'Sản phẩm'}
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
                        label={'Mã sản phẩm'}
                        value={"SP-12345"}
                        editable={false}
                        styles={{backgroundColor: colors.bg_neutral}}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={'Đơn vị tính'}
                        value={"Thùng"}
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
                        label={'Đơn giá'}
                        value={"1.000.000"}
                        editable={false}
                        styles={{
                            backgroundColor: colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="VND" textStyle={{ fontSize: 12 }} />
                        }
                    />
                    <AppInput
                        label={'Số lượng'}
                        value={"3"}
                        hiddenRightIcon
                    />
                </View>
                <View style={styles.footerBttSheet}>
                    <AppButton
                        style={{ width: '45%', backgroundColor: colors.bg_neutral }}
                        label={'Huỷ'}
                        styleLabel={{ color: colors.text_secondary }}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}
                    />
                    <AppButton
                        style={{ width: '45%' }}
                        label={'Cập nhật'}
                        onPress={() => bottomSheetRef.current && bottomSheetRef.current.close()}

                    />
                </View>
            </View>
        );
    };

    return (
        <MainLayout style={styles.layout} >
            <AppContainer style={{ paddingTop: 16 }}>
                <View style={{ paddingHorizontal: 16, rowGap: 24 }}>

                    <View>

                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel]}>Khách hàng</Text>
                            <TouchableOpacity>
                                <Text style={[styles.textLabel, { color: colors.action }]}>Chi tiét</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.divCustomer, styles.shadow, { backgroundColor: colors.bg_default }]}>
                            <Text style={[styles.inforCustomer]}>Vinamilk - KH1234</Text>
                            <View style={{ marginTop: 8, paddingTop: 8, borderColor: colors.border, borderTopWidth: 1 }}>
                                <View style={[styles.flex]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='clock' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.KHinforDesc]}>08:00, 20/11/2023</Text>
                                </View>
                                <View style={[styles.flex, { marginTop: 4 }]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='map-pin' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.KHinforDesc]}>101 Tôn Dật Tiên, Tân Phú, Quận 7, Thành phố Hồ Chí Minh</Text>
                                </View>
                                <View style={[styles.flex, { marginTop: 4 }]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='phone' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.KHinforDesc]}>+84 667 778 889</Text>
                                </View>
                            </View>

                        </View>

                    </View>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel]}>Thông tin đơn hàng</Text>
                            <TouchableOpacity>
                                <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 8, rowGap: 16 }}>

                            <View style={[styles.containerIfOd]}>

                                <View style={[styles.orderInforE]}>
                                    <Text style={[styles.labelDetail]}>Ngày giao</Text>
                                    <Text style={[styles.textInforO]}>28/11/2023</Text>
                                </View>

                                <View style={[styles.orderInforE]}>
                                    <Text style={[styles.labelDetail]}>Gợi ý tổng tiền</Text>
                                    <Text style={[styles.textInforO]}>28/11/2023</Text>
                                </View>

                                <View style={[styles.orderInforE]}>
                                    <Text style={[styles.labelDetail]}>Tiền khách trả</Text>
                                    <Text style={[styles.textInforO]}>28/11/2023</Text>
                                </View>

                                <View style={[styles.orderInforE]}>
                                    <Text style={[styles.labelDetail]}>Ghi công nợ</Text>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.AntIcon} name='checkcircle' size={14} color={colors.success} />
                                        <Text style={[styles.textInforO, { marginLeft: 8 }]}>Có</Text>
                                    </View>
                                </View>

                                <View style={[styles.orderInforE, { borderColor: colors.bg_default }]}>
                                    <Text style={[styles.labelDetail]}>Ghi chú đơn hàng</Text>
                                    <Text style={[styles.textInforO]}>28/11/2023</Text>
                                </View>

                            </View>

                            <View style={[styles.containerIfOd]}>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.labelDetail]}>Loại đơn hàng</Text>
                                    <Text style={[styles.textInforO]}>Đặt hàng</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.labelDetail]}>Kho xuất</Text>
                                    <Text style={[styles.textInforO]}>Kho HN_TEST</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.labelDetail]}>Nhóm</Text>
                                    <Text style={[styles.textInforO]}>Bắc Từ</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.bg_default }]}>
                                    <Text style={[styles.labelDetail]}>Chiết khấu</Text>
                                    <Text style={[styles.textInforO]}>100.000</Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel]}>Sản phẩm</Text>
                            <TouchableOpacity>
                                <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.containerOrder]}>
                            <Pressable
                                onPress={() => bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                                style={[styles.flexSpace,styles.itemPro]}
                            >
                                <View>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6 }]}>SP-123554</Text>
                                    </View>
                                    <Text style={[styles.inforDesc, { color: colors.text_secondary }]}>ĐVT: <Text style={{ color: colors.text_primary }}>Cái</Text> </Text>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text>x10</Text>
                                    <Text style={[styles.textInforO, { marginTop: 10}]}>7.000.000</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={() => bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                                style={[styles.flexSpace,styles.itemPro]}>
                                <View>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6 }]}>SP-123554</Text>
                                    </View>
                                    <Text style={[styles.inforDesc, { color: colors.text_secondary }]}>ĐVT: <Text>Cái</Text> </Text>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text>x10</Text>
                                    <Text style={[styles.textInforO, { marginTop: 10 }]}>7.000.000</Text>
                                </View>
                            </Pressable>

                        </View>
                    </View>

                </View>

            </AppContainer>

            <View style={styles.footerDetail}>
                <View style={[styles.flexSpace, { alignItems: "flex-end", paddingHorizontal: 16 }]}>
                    <Text style={[styles.textLabel]}>Tổng tiền</Text>
                    <Text style={[styles.totalPrice]}>4.000.000</Text>
                </View>
            </View>

            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoints}>
                {renderUiBottomSheet()}
            </AppBottomSheet>
        </MainLayout>
    )
}

export default TabOverview;

const createStyles = (theme: AppTheme) => StyleSheet.create({
    layout :{
        backgroundColor: theme.colors.bg_neutral,
        paddingHorizontal: 0
    }as ViewStyle,
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
    containerIfOd :{
        backgroundColor: theme.colors.bg_default,
        paddingVertical: 8,
        paddingHorizontal: 16
    }as ViewStyle,
    textLabel: {
        color: theme.colors.text_secondary,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    } as TextStyle,
    labelDetail: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
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
        color :theme.colors.text_primary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    } as TextStyle,
    inforDesc: {
        color :theme.colors.text_primary,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    } as TextStyle,
    KHinforDesc: {
        color :theme.colors.text_primary,
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
        color :theme.colors.text_primary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    } as TextStyle,
    totalPrice: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: "500",
        color :theme.colors.text_primary
    } as TextStyle,
    footerBttSheet: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        height: AppConstant.HEIGHT * 0.1,
        width: '100%',
        alignSelf: 'center',
    }as ViewStyle,
    footerDetail :{
        paddingVertical: 16,
        backgroundColor: theme.colors.bg_default, 
        borderColor: theme.colors.border,
        borderTopWidth: 1
    }as ViewStyle,
    itemPro :{
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "flex-start"
    } as ViewStyle,
    containerOrder :{
        backgroundColor: theme.colors.bg_default,
        marginTop: 8 
    }
})