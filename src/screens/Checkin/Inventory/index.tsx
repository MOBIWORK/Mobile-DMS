import React, { useMemo, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { AppBottomSheet, AppButton, AppContainer, AppHeader, AppIcons, AppInput } from '../../../components/common'
import { useNavigation, useTheme } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native'
import { ImageAssets } from '../../../assets'
import { Button, IconButton, TextInput } from 'react-native-paper';
import { NavigationProp } from '../../../navigation'
import { ICON_TYPE } from '../../../const/app.const'
import SwipeableItem from './components/SwipeableItem'
import { AppConstant, ScreenConstant } from '../../../const'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CheckinInventory = () => {

    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefDetail = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['75%'], []);
    const snapPointsDetailPr = useMemo(() => ['60%'], []);
    const [detailProduct,setDetailProduct] = useState<any>();

    const [prodcuctSelected,setProductSelectec] = useState<any[]>([{}])

    const onSubmit = () => { }

    const removeItem = (item : any)=>{
        
    }

    const openBottonSheetDetail = (item : any)=>{
        setDetailProduct(item);
        if(bottomSheetRefDetail.current){
            bottomSheetRefDetail.current.snapToIndex(0)
        }
    }

    const renderUiBottomSheetDetailProduct = () => {
        return (
            <View style={{ padding: 16, paddingTop: 0, height: '100%',marginTop :-20 }}>
                <AppHeader
                    label={'Sản phẩm'}
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
                        label={'Số lượng'}
                        value={"3"}
                        hiddenRightIcon
                    />
                    <AppInput
                        label={'Hạn sử dụng'}
                        value={"27/12/2024"}
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
        <MainLayout style={{ backgroundColor: colors.bg_neutral }}>

            <AppHeader label='Kiểm tồn' onBack={() => navigation.goBack()} />

                {prodcuctSelected.length > 0 && (

                        <View style={[styles.flexSpace as any, { marginTop: 40 ,marginBottom :8}]}>
                            <Text style={[styles.titile as any, { color: colors.text_secondary }]}>Danh sách sản phẩm</Text>
                            <View style={{ flexDirection: "row" }}>
                                <IconButton
                                    style={{ borderColor: colors.action,marginRight :8 }}
                                    mode='outlined'
                                    icon="plus"
                                    iconColor={colors.action}
                                    size={16}
                                    onPress={() => navigation.navigate(ScreenConstant.INVENTORY_ADD_PRODUCT)}
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

                {prodcuctSelected.length > 0 && (
                    <View style={{ rowGap: 16 }}>
                        {prodcuctSelected.map((item,index) =>(
                            
                            <TouchableOpacity key={index} onPress={()=>openBottonSheetDetail(item)} activeOpacity={0.5}>
                                <SwipeableItem  handlerClick={()=> removeItem(item)}>
                                    <View style={[styles.flexSpace as any, styles.item, { alignItems: "flex-start", backgroundColor: colors.bg_default, }]}>
                                        <View>
                                            <View style={[styles.flex as any, { columnGap: 5 }]}>
                                                <AppIcons
                                                    iconType={ICON_TYPE.IonIcon}
                                                    name="barcode-outline"
                                                    size={20}
                                                    color={colors.text_primary}
                                                />
                                                <Text style={[styles.nameProduct as any, { color: colors.text_primary }]}>SP-123554</Text>
                                            </View>
                                            <Text style={[styles.dateProduct as any, { color: colors.text_secondary }]}>HSD: 20/10/2024</Text>
                                        </View>
                                        <View style={{ alignItems: "flex-end" }}>
                                            <Text style={[styles.dateProduct as any, {}]}>
                                                ĐVT: <Text style={{ color: colors.text_primary, fontWeight: "500" }}>Cái</Text>
                                            </Text>
                                            <Text style={[styles.dateProduct as any, { marginTop: 8 }]} >
                                                SL: <Text style={{ color: colors.text_primary, fontWeight: "500" }}>02</Text>
                                            </Text  >
                                        </View>
                                    </View>
                                </SwipeableItem>
                            </TouchableOpacity>

                        ))}

                    </View>

                )}
                
                {prodcuctSelected.length == 0 && (
                    <View style={[styles.containerNodata as any]}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={[styles.iconImage]} source={ImageAssets.IconBill} resizeMode='cover' />
                            <Text style={[styles.textInventory as any, { color: colors.text_disable, marginTop: 8 }]}>Chọn sản phẩm cần kiểm tồn</Text>
                        </View>
                        <View style={[styles.flexSpace as any, { marginTop: 24 }]}>
                            <Button
                                style={{ width: "45%", marginRight: 16, borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textInventory as any, { fontWeight: "500" }]}
                                icon="plus" mode="outlined" onPress={() => console.log('Pressed')} >
                                Chọn sản phẩm
                            </Button>
                            <Button
                                style={{ width: "45%", borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textInventory as any, { fontWeight: "500" }]}
                                icon="barcode-scan" mode="outlined" onPress={() => console.log('Pressed')}>
                                Quét mã
                            </Button>
                        </View>
                    </View>
                )}

            </AppContainer>

            <AppButton label='Hoàn thành' style={{ width: "100%", marginBottom: 20 }} onPress={onSubmit} />
            <AppBottomSheet bottomSheetRef={bottomSheetRefDetail} snapPointsCustom={snapPointsDetailPr}>
                {renderUiBottomSheetDetailProduct()}
            </AppBottomSheet>
        </MainLayout>
    )
}

export default CheckinInventory;

const styles = StyleSheet.create({
    containerNodata :{
        height: "100%",
        justifyContent: "center",
        alignItems: "center" 
    },
    flex :{
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
    dateProduct :{
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400"
    },
    item :{
        paddingHorizontal :16,
        paddingVertical :12
    }
})