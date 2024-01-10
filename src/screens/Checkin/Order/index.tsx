import React from 'react'
import { MainLayout } from '../../../layouts'
import { AppButton, AppContainer, AppHeader } from '../../../components/common'
import { ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Text } from 'react-native'
import { Button } from 'react-native-paper'
import { AppTheme, useTheme } from '../../../layouts/theme'
import { ImageAssets } from '../../../assets'
import { Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProp, RouterProp } from '../../../navigation'
import { ScreenConstant } from '../../../const'

const CheckinOrder = () => {

    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const styles = createSheetStyle(useTheme());
    const router = useRoute<RouterProp<"CKECKIN_ORDER">>()
    const type = router.params.type;

    return (
        <MainLayout style={styles.layout} >

            <AppHeader label={type === "ORDER" ? "Đặt hàng" :"Trả hàng"} onBack={()=> navigation.goBack()} />

            <AppContainer>
                <View>
                    <View style={[styles.containerNodata as any]}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={styles.iconImage} source={ImageAssets.IconOrder} resizeMode='cover' />
                            <Text style={[styles.lableNoOr]}>{type=="ORDER" ? "Chưa có đơn đặt hàng" :"Chưa có đơn trả hàng"}</Text>
                        </View>
                        <View style={{marginTop : 16}}>
                            <Button
                                style={{borderColor: colors.action }}
                                textColor={colors.action}
                                labelStyle={[styles.textBt]}
                                icon="plus" mode="outlined" onPress={() => navigation.navigate(ScreenConstant.CKECKIN_ORDER_CREATE,{type : type})} >
                                Tạo đơn
                            </Button>
                        </View>
                    </View>

                </View>
            </AppContainer>
            <AppButton label='Hoàn thành' style={styles.footerBt} onPress={()=> console.log("123")} />
        </MainLayout>
    )
}

export default CheckinOrder;

const createSheetStyle =(theme :AppTheme)=>  StyleSheet.create({
    layout :{
        backgroundColor :theme.colors.bg_neutral
    }as ViewStyle,
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
        width: 68,
        height: 76,
    } as ImageStyle,
    lableNoOr: {
        marginTop :8,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400",
        color : theme.colors.text_disable
    }as TextStyle,
    textBt :{
        marginTop :8,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
    }as TextStyle,
    footerBt :{
        width: "100%",
        marginBottom: 20
    }as ViewStyle
})