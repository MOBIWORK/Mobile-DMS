import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { MainLayout } from '../../../layouts'
import AppContainer from '../../../components/AppContainer'
import { useTheme } from '@react-navigation/native'
import { AppAvatar, AppIcons } from '../../../components/common'
import { Text } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ICON_TYPE } from '../../../const/app.const'

const TabComment = () => {

    const { colors } = useTheme()

    return (
        <MainLayout style={{ backgroundColor: colors.bg_neutral ,paddingHorizontal :0}}>
            <AppContainer style={{marginTop :16,paddingHorizontal :16}}>
                <View style={{padding :16,backgroundColor :colors.bg_default ,borderRadius :16}}>
                    <View style={[{ paddingVertical: 4, flexDirection: "row", marginBottom: 10 }]}>
                        <AppAvatar size={40} url={"https://picture.vn/wp-content/uploads/2015/12/da-lat.png"} />
                        <View style={{ marginLeft: 8 }}>
                            <View>
                                <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: "400", color: colors.text_primary }}>
                                    <Text style={[styles.userComment,{color :colors.text_primary}]}>Đỗ Toàn</Text>
                                </Text>
                                <Text style={[styles.commentCt]}>Đơn này đã bị huỷ</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.commentCt,{  color: colors.text_secondary }]}>10 phút trước</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </AppContainer>
            <View style={{ backgroundColor: colors.bg_default, borderTopWidth: 1, borderColor: colors.border, padding: 16 }}>
                <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ flex: 1, backgroundColor: colors.bg_neutral, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 100 }}>
                        <TextInput placeholderTextColor={colors.text_secondary}
                            placeholder="Nhập nội dung"
                            value={""}
                            style={[styles.inputStyle,{color: colors.text_secondary}]}
                        />
                    </View>
                    <TouchableOpacity style={{ marginLeft: 12 }}>
                        <AppIcons iconType={ICON_TYPE.MaterialCommunity} name='send' size={28} color={colors.text_secondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </MainLayout>

    )
}

export default TabComment;

const styles = StyleSheet.create({
    userComment :{
        fontSize :16,
        lineHeight :24,
        fontWeight :"500"
    },
    commentCt :{
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400"
    },
    timeCmt :{
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
    },
    inputStyle :{
        height: 36,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "400", 
        paddingRight: 60,
        paddingTop :8
    }
})