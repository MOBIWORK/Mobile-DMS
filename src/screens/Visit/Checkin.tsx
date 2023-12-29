import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { AppButton, AppContainer, AppDialog, AppHeader, AppIcons } from '../../components/common'
import { AppTheme, useTheme } from '../../layouts/theme'
import { Image } from 'react-native'
import { ImageAssets } from '../../assets'
import { ICON_TYPE } from '../../const/app.const'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '../../navigation'
import { Switch } from 'react-native-switch';
import { ScreenConstant } from '../../const'

const VisitCheckin = () => {
    const { colors } = useTheme();
    const styles = createStyles(useTheme());
    const navigation = useNavigation<NavigationProp>();
    const [open,setOpen] = useState<boolean>(false);
    const [status,setStatus] = useState<boolean>(true);

    const onCancleVisit =()=>{
        setOpen(false)
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppHeader
                    onBack={()=> setOpen(true)}
                    labelStyle={styles.headerTxt}
                    label='Viếng thăm: 00 :00'
                    rightButton={
                        <View>
                            <Switch
                                value={status}
                                onValueChange={()=>setStatus(!status)}
                                disabled={false}
                                activeText={'Mở cửa'}
                                inActiveText={'Đóng cửa'}
                                circleSize={25}
                                switchWidthMultiplier={5}
                                barHeight={30}
                                circleBorderWidth={0}
                                backgroundActive={colors.success}
                                backgroundInactive={colors.error}
                                circleActiveColor={colors.bg_default}
                                circleInActiveColor={colors.bg_default}
                            />
                        </View>

                    }
                />
                <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                    <View style={styles.flex}>
                        <Image
                            source={ImageAssets.UserGroupIcon}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                            resizeMode={'cover'}
                            tintColor={colors.success}
                        />
                        <Text style={styles.customer}>Nintendo</Text>
                    </View>
                    <View style={styles.hr} />
                    <View>
                        <View style={styles.flex}>
                            <AppIcons name='map-pin' size={14} color={colors.text_primary} iconType={ICON_TYPE.Feather} />
                            <Text style={[styles.customeInfo, { marginLeft: 5 }]} ellipsizeMode='tail' numberOfLines={1}>191 đường Lê Văn Thọ, Phường 8, Gò Vấp, Thành phố Hồ Chí Minh</Text>
                        </View>
                        <View style={styles.flex}>
                            <AppIcons name='phone' size={14} color={colors.text_primary} iconType={ICON_TYPE.Feather} />
                            <Text style={[styles.customeInfo, { marginLeft: 5 }]} ellipsizeMode='tail' numberOfLines={1}>+84 667 435 265</Text>
                        </View>
                    </View>
                </View>

            </View>

            <View style={{ paddingHorizontal: 16 }} >
                <View style={{ marginTop: 32, backgroundColor: colors.bg_default, borderRadius: 16 }}>

                    <TouchableOpacity onPress={()=> navigation.navigate(ScreenConstant.CHECKIN_INVENTORY)} activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(255, 171, 0, 0.08)')}>
                                    <AppIcons name='box' iconType={ICON_TYPE.Feather} size={20} color={colors.warning} />
                                </View>
                                <Text style={styles.labelMn}>Kiểm tồn</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(142, 51, 255, 0.08)')}>
                                    <AppIcons name='camera' iconType={ICON_TYPE.Feather} size={20} color={colors.secondary} />
                                </View>
                                <Text style={styles.labelMn}>Chụp ảnh</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> navigation.navigate(ScreenConstant.CKECKIN_ORDER)} activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(24, 119, 242, 0.08)')}>
                                    <AppIcons name='shop' iconType={ICON_TYPE.EntypoIcon} size={20} color={colors.action} />
                                </View>
                                <Text style={styles.labelMn}>Đặt hàng</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(34, 197, 94, 0.08)')}>
                                    <AppIcons name='square-edit-outline' iconType={ICON_TYPE.MaterialCommunity} size={20} color={colors.main} />
                                </View>
                                <Text style={styles.labelMn}>Ghi chú</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(255, 86, 48, 0.08)')}>
                                    <AppIcons name='map-pin' iconType={ICON_TYPE.Feather} size={20} color={colors.error} />
                                </View>
                                <Text style={styles.labelMn}>Vị trí</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} >
                        <View style={[styles.ctnListMn, styles.flexSpace]}>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View style={styles.bttIcon('rgba(0, 184, 217, 0.08)')}>
                                    <AppIcons name='rotate-ccw' iconType={ICON_TYPE.Feather} size={20} color={colors.info} />
                                </View>
                                <Text style={styles.labelMn}>Trả hàng</Text>
                            </View>
                            <View style={[styles.flex, { columnGap: 8 }]}>
                                <View>
                                    <AppIcons name='checkcircle' iconType={ICON_TYPE.AntIcon} size={14} color={colors.success} />
                                </View>
                                <AppIcons name='chevron-right' iconType={ICON_TYPE.Feather} size={28} color={colors.text_secondary} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <AppButton label='Check out' style={styles.bttFooter}
                    styleLabel={{ color: colors.primary }}
                    onPress={() => console.log("Oke")}
                />
            </View>

            <AppDialog 
                open={open}
                showButton
                errorType
                title='Bạn muốn thoát viếng thăm ?' 
                submitLabel='Thoát'
                closeLabel='Huỷ'
                onClose={()=> setOpen(false)}
                onSubmit={()=>onCancleVisit()}
            />

        </SafeAreaView>
    )
}

export default VisitCheckin;

const createStyles = (theme: AppTheme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.bg_neutral,
        flex: 1
    } as ViewStyle,
    header: {
        paddingHorizontal: 16,
        backgroundColor: theme.colors.bg_default,
        paddingBottom: 12
    } as ViewStyle,
    flex: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    flexSpace: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    } as ViewStyle,
    customer: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
        color: theme.colors.text_primary
    } as TextStyle,
    hr: {
        height: 1,
        width: "100%",
        backgroundColor: theme.colors.divider,
        marginVertical: 8
    } as ViewStyle,
    headerTxt: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 21,
        textAlign: "left",
        marginLeft: 16,
        color: theme.colors.text_primary
    } as TextStyle,
    customeInfo: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 21,
        color: theme.colors.text_primary
    } as TextStyle,
    ctnListMn: {
        paddingVertical: 12,
        paddingHorizontal: 16
    } as ViewStyle,
    bttIcon: (color: string) => ({
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        backgroundColor: color,
        borderRadius: 8
    }) as ViewStyle,
    labelMn: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
        color: theme.colors.text_primary
    } as TextStyle,
    bttFooter: {
        width: "100%",
        backgroundColor: theme.colors.bg_neutral,
        borderWidth: 1,
        borderColor: theme.colors.primary
    } as ViewStyle,
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 20,
        paddingHorizontal: 16
    } as ViewStyle
})