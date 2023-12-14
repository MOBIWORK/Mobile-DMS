import React, { useMemo, useRef } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MainLayout } from '../../../layouts'
import { useTheme } from '@react-navigation/native'
import AppContainer from '../../../components/AppContainer'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AppBottomSheet, AppButton, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { ICON_TYPE } from '../../../const/app.const'
import { TextInput } from 'react-native-paper'
import { AppConstant } from '../../../const'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'


const TabOverview = () => {
    
    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['75%'], []);


    const renderUiBottomSheet = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%',marginTop :-20 }}>
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
                        styles={{
                            backgroundColor :colors.bg_neutral
                        }}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={'Đơn vị tính'}
                        value={"Thùng"}
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
                        label={'Đơn giá'}
                        value={"1.000.000"}
                        editable={false}
                        styles={{
                            backgroundColor :colors.bg_neutral
                        }}
                        rightIcon={
                            <TextInput.Affix text="VND"  textStyle={{fontSize :12}} />
                        }
                    />
                    <AppInput
                        label={'Số lượng'}
                        value={"3"}
                        hiddenRightIcon
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
        <MainLayout style={{ flex: 1, backgroundColor: colors.bg_neutral, paddingHorizontal: 0 }} >
            <AppContainer style={{ paddingTop: 16 }}>

                <View style={{ paddingHorizontal: 16, rowGap: 24 }}>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel, { color: colors.text_secondary }]}>Khách hàng</Text>
                            <TouchableOpacity>
                                <Text style={[styles.textLabel, { color: colors.action }]}>Chi tiét</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.divCustomer, styles.shadow, { backgroundColor: colors.bg_default }]}>
                            <Text style={[styles.inforCustomer, { color: colors.text_primary }]}>Vinamilk - KH1234</Text>
                            <View style={{ marginTop: 8, paddingTop: 8, borderColor: colors.border, borderTopWidth: 1 }}>
                                <View style={[styles.flex]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='clock' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>08:00, 20/11/2023</Text>
                                </View>
                                <View style={[styles.flex, { marginTop: 4 }]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='map-pin' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>101 Tôn Dật Tiên, Tân Phú, Quận 7, Thành phố Hồ Chí Minh</Text>
                                </View>
                                <View style={[styles.flex, { marginTop: 4 }]}>
                                    <AppIcons iconType={ICON_TYPE.Feather} name='phone' size={18} color={colors.text_primary} />
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>+84 667 778 889</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel, { color: colors.text_secondary }]}>Thông tin đơn hàng</Text>
                            <TouchableOpacity>
                                <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 8, rowGap: 16 }}>

                            <View style={[{ backgroundColor: colors.bg_default, paddingVertical: 8, paddingHorizontal: 16 }]}>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Ngày giao</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>28/11/2023</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Gợi ý tổng tiền</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>28/11/2023</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Tiền khách trả</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>28/11/2023</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Ghi công nợ</Text>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.AntIcon} name='checkcircle' size={14} color={colors.success} />
                                        <Text style={[styles.textInforO, { color: colors.text_primary, marginLeft: 8 }]}>Có</Text>
                                    </View>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.bg_default }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Ghi chú đơn hàng</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>28/11/2023</Text>
                                </View>
                            </View>

                            <View style={[{ backgroundColor: colors.bg_default, paddingVertical: 8, paddingHorizontal: 16 }]}>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Loại đơn hàng</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>Đặt hàng</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Kho xuất</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>Kho HN_TEST</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.border }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Nhóm</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>Bắc Từ</Text>
                                </View>
                                <View style={[styles.orderInforE, { borderColor: colors.bg_default }]}>
                                    <Text style={[styles.textInforO, { color: colors.text_disable, marginBottom: 4 }]}>Chiết khấu</Text>
                                    <Text style={[styles.textInforO, { color: colors.text_primary }]}>100.000</Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View>
                        <View style={[styles.flexSpace]}>
                            <Text style={[styles.textLabel, { color: colors.text_secondary }]}>Sản phẩm</Text>
                            <TouchableOpacity>
                                <AppIcons iconType={ICON_TYPE.Feather} name='chevron-down' size={18} color={colors.text_primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={[{backgroundColor :colors.bg_default,marginTop :8}]}>

                            <Pressable
                                onPress={()=> bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                                style={[styles.flexSpace,{paddingVertical :12 ,paddingHorizontal :16,alignItems :"flex-start"}]}
                            >
                                <View>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>SP-123554</Text>
                                    </View>
                                    <Text style={[styles.inforDesc,{color :colors.text_secondary}]}>ĐVT: <Text style={{color :colors.text_primary}}>Cái</Text> </Text>
                                </View>
                                <View style={{alignItems :"flex-end"}}>
                                    <Text>x10</Text>
                                    <Text style={[styles.textInforO,{marginTop :10,color :colors.text_primary}]}>7.000.000</Text>
                                </View>
                            </Pressable>

                            <Pressable 
                                onPress={()=> bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                                style={[styles.flexSpace,{paddingVertical :12 ,paddingHorizontal :16,alignItems :"flex-start"}]}>
                                <View>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>SP-123554</Text>
                                    </View>
                                    <Text style={[styles.inforDesc,{color :colors.text_secondary}]}>ĐVT: <Text style={{color :colors.text_primary}}>Cái</Text> </Text>
                                </View>
                                <View style={{alignItems :"flex-end"}}>
                                    <Text>x10</Text>
                                    <Text style={[styles.textInforO,{marginTop :10,color :colors.text_primary}]}>7.000.000</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={()=> bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)}
                                style={[styles.flexSpace,{paddingVertical :12 ,paddingHorizontal :16,alignItems :"flex-start"}]}>
                                <View>
                                    <View style={[styles.flex]}>
                                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={18} color={colors.text_primary} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.inforDesc, { marginLeft: 6, color: colors.text_primary }]}>SP-123554</Text>
                                    </View>
                                    <Text style={[styles.inforDesc,{color :colors.text_secondary}]}>ĐVT: <Text style={{color :colors.text_primary}}>Cái</Text> </Text>
                                </View>
                                <View style={{alignItems :"flex-end"}}>
                                    <Text>x10</Text>
                                    <Text style={[styles.textInforO,{marginTop :10,color :colors.text_primary}]}>7.000.000</Text>
                                </View>
                            </Pressable>

                        </View>
                    </View>

                </View>

            </AppContainer>

            <View style={{paddingVertical :16,backgroundColor :colors.bg_default,borderColor :colors.border, borderTopWidth :1}}>
                <View style={[styles.flexSpace,{alignItems :"flex-end",paddingHorizontal :16}]}>
                    <Text style={[styles.textLabel,{color :colors.text_secondary}]}>Tổng tiền</Text>
                    <Text style={[styles.totalPrice,{color :colors.text_primary}]}>4.000.000</Text>
                </View>
            </View>

            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPointsCustom={snapPoints}>
                {renderUiBottomSheet()}
            </AppBottomSheet>
        </MainLayout>
    )
}

export default TabOverview;

const styles = StyleSheet.create({
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    flex: {
        flexDirection: "row",
        alignItems: "center"
    },
    textLabel: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
    },
    divCustomer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 8,
        borderRadius: 16
    },
    inforCustomer: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500"
    },
    inforDesc: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    },
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
        paddingVertical: 12,
        borderBottomWidth: 1
    },
    textInforO: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    },
    totalPrice :{
        fontSize: 20,
        lineHeight: 30,
        fontWeight: "500"
    },
})