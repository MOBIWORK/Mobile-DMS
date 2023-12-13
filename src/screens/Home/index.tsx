import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { AppAvatar, AppIcons } from '../../components/common'
import { useTheme } from '@react-navigation/native'
import { IconButton } from 'react-native-paper';
import { ImageAssets } from '../../assets';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AppConstant } from '../../const';
import ItemuWidget from '../../components/Widget/ItemWidget';
import ProgressCircle from 'react-native-progress-circle'
import BarChartStatistical from './BarChart';
import { PieChart } from 'react-native-gifted-charts';
import ItemNotification from '../../components/Notification/ItemNotification';

const HomeScreen = () => {
    const { colors } = useTheme();

    const [notificaitons ,setNotifications] = useState([
        {
            id:1,
            name :"Thông báo nghỉ lễ Quốc Khánh 02/09",
            description : "Quyết định có hiệu lực kể từ ngày ký",
            time :"17:00 - 20/09/2023"
        },
        {
            id:1,
            name :"Khen thưởng nhân viên xuất sắc tháng",
            description : "Căn cứ vào chức năng, quyền hạn của Chủ tịch HĐQT Công ty được quy định tại Điều lệ Công ty Cổ phần Công nghệ MobiWork Việt Nam được thông qua bởi các thành viên sáng lập;",
            time :"17:00 - 20/09/2023"
        },
        {
            id:1,
            name :"Khen thưởng KD xuất sắc",
            description : "Phòng KT-TC, phòng HCNS và nhân viên/trưởng nhóm có tên trong danh sách có trách nhiệm thi hành theo quyết định này.",
            time :"17:00 - 20/09/2023"
        }
    ])

    const renderUiWidget = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Tiện ích</Text>
                    <TouchableOpacity>
                        <Text style={[styles.tilteSection, { color: colors.action }]}>Tuỳ chỉnh</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <View
                        style={[
                            styles.shadow,
                            {
                                backgroundColor: colors.bg_default,
                                borderRadius: 16,
                            },
                        ]}
                    >
                        <View
                            style={{
                                marginLeft: -16,
                                flexDirection: "row",
                                flexWrap: "wrap",
                                paddingTop: 8,
                            }}
                        >
                            {/*  */}
                            <View
                                style={{ marginBottom: 16, marginLeft: 16, width: (AppConstant.WIDTH - 80) / 4 }}
                            >
                                <ItemuWidget
                                    name={"Thông báo nội bộ"}
                                    source={ImageAssets.InitLogo}
                                    navigate={""}
                                />
                            </View>

                            <View
                                style={{ marginBottom: 16, marginLeft: 16, width: (AppConstant.WIDTH - 80) / 4 }}
                            >
                                <ItemuWidget
                                    name={"Hồ sơ"}
                                    source={ImageAssets.ErrorApiIcon}
                                    navigate={""}
                                />
                            </View>

                            {/*  */}
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    const renderUiStatistical = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Thống kê</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>

                    <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 16, width: (AppConstant.WIDTH - 64) / 3, marginBottom: 16 }}>
                        <Text style={{ fontSize: 12, fontWeight: "500", lineHeight: 18, color: colors.text_primary }}>Doanh thu</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 4 }}>
                            <ProgressCircle
                                percent={18}
                                radius={16}
                                borderWidth={5}
                                color={colors.action}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}
                            >
                            </ProgressCircle>
                            <Text style={{ fontSize: 18, lineHeight: 27, fontWeight: "500", marginLeft: 8, color: colors.action }}>
                                15 %
                            </Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 16, width: (AppConstant.WIDTH - 64) / 3, marginBottom: 16, marginHorizontal: 15 }}>
                        <Text style={{ fontSize: 12, fontWeight: "500", lineHeight: 18, color: colors.text_primary }}>Doanh số</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 4 }}>
                            <ProgressCircle
                                percent={18}
                                radius={16}
                                borderWidth={5}
                                color={colors.success}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}
                            >
                            </ProgressCircle>
                            <Text style={{ fontSize: 18, lineHeight: 27, fontWeight: "500", marginLeft: 8, color: colors.success }}>
                                15 %
                            </Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 16, width: (AppConstant.WIDTH - 64) / 3, marginBottom: 16 }}>
                        <Text style={{ fontSize: 12, fontWeight: "500", lineHeight: 18, color: colors.text_primary }}>Đơn hàng</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 4 }}>
                            <ProgressCircle
                                percent={65}
                                radius={16}
                                borderWidth={5}
                                color={colors.info}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}
                            >
                            </ProgressCircle>
                            <Text style={{ fontSize: 18, lineHeight: 27, fontWeight: "500", marginLeft: 8, color: colors.info }}>
                                65 %
                            </Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 16, width: (AppConstant.WIDTH - 48) / 2, marginBottom: 16, marginRight: 16 }}>
                        <Text style={{ fontSize: 12, fontWeight: "500", lineHeight: 18, color: colors.text_primary }}>Viếng thăm</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 4 }}>
                            <ProgressCircle
                                percent={18}
                                radius={16}
                                borderWidth={5}
                                color={colors.primary}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}
                            >
                            </ProgressCircle>
                            <Text style={{ fontSize: 18, lineHeight: 27, fontWeight: "500", marginLeft: 8, color: colors.primary }}>
                                15 %
                            </Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.bg_default, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 16, width: (AppConstant.WIDTH - 48) / 2, marginBottom: 16 }}>
                        <Text style={{ fontSize: 12, fontWeight: "500", lineHeight: 18, color: colors.text_primary }}>Khách hàng mới</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 4 }}>
                            <ProgressCircle
                                percent={18}
                                radius={16}
                                borderWidth={5}
                                color={colors.secondary}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}
                            >
                            </ProgressCircle>
                            <Text style={{ fontSize: 18, lineHeight: 27, fontWeight: "500", marginLeft: 8, color: colors.secondary }}>
                                15 %
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_neutral }}>
            <View style={[styles.shadow, { backgroundColor: colors.bg_default, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 16 }]}>
                <View style={{ flexDirection: "row" }}>
                    <AppAvatar name='Long' size={48} />
                    <View style={{ marginTop: -3, marginLeft: 8 }}>
                        <Text style={{ fontSize: 20, lineHeight: 30, fontWeight: "500", color: colors.text_primary }} >Xin chào ,</Text>
                        <Text style={{ fontSize: 20, lineHeight: 30, fontWeight: "500", color: colors.text_primary }}>Khuất Thanh Long</Text>
                    </View>
                </View>
                <View>
                    <IconButton
                        icon="bell-outline"
                        iconColor={colors.text_primary}
                        size={20}
                        mode='contained'
                        containerColor={colors.border}
                        onPress={() => console.log('Pressed')}
                    />
                </View>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 16, marginTop: 20 }}>

                    <View style={[styles.shadow, { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: colors.bg_default, borderRadius: 16 }]}>
                        <View>
                            <Text style={{ fontSize: 20, lineHeight: 30, fontWeight: "500", color: colors.text_primary }}>Chấm công vào</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                                <AppIcons
                                    iconType="AntIcon"
                                    name="clockcircleo"
                                    size={12}
                                    color={colors.text_secondary}
                                />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontSize: 16,
                                        color: colors.text_secondary,
                                    }}
                                >
                                    08:00 - 12:00
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: 48, height: 48, backgroundColor: colors.success, justifyContent: "center", alignItems: "center", borderRadius: 12 }}>
                            <Image
                                source={ImageAssets.Usercheckin}
                                resizeMode={"cover"}
                                style={{
                                    width: 32,
                                    height: 32,
                                    tintColor: colors.bg_default,
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {renderUiWidget()}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {renderUiStatistical()}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Doanh số</Text>
                        </View>
                        <View style={{ marginBottom: 8 }}>
                            <BarChartStatistical color={colors.action} />
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Doanh thu</Text>
                        </View>
                        <View style={{ marginBottom: 8 }}>
                            <BarChartStatistical color={colors.main} />
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Viếng thăm</Text>
                        </View>
                        <View style={{ marginBottom: 8, flex: 1, alignItems: "center", padding: 16, backgroundColor: colors.bg_default, borderRadius: 16 }}>
                            <ProgressCircle
                                percent={18}
                                radius={80}
                                borderWidth={30}
                                color={colors.action}
                                shadowColor={colors.bg_disable}
                                bgColor={colors.bg_default}

                            >
                                <View>
                                    <Text style={{ fontSize: 24, lineHeight: 28, fontWeight: "700", color: colors.text_primary }}>3/50</Text>
                                    <Text style={{ fontSize: 12, lineHeight: 21, fontWeight: "400", color: colors.main }}> {`(Đạt 6 %)`} </Text>
                                </View>
                            </ProgressCircle>
                            <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: "500", marginTop: 12, color: colors.text_secondary }}>
                                Số lượt viếng thăm khách hàng/tháng
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Bản đồ viếng thăm</Text>
                        </View>
                        <View style={{ marginBottom: 8, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: colors.bg_default, borderRadius: 16, minHeight: 360 }}>
                            <Text>Map</Text>
                        </View>
                    </View>


                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text style={[styles.tilteSection, { color: colors.text_disable }]}>Thông báo nội bộ</Text>
                            <TouchableOpacity>
                                <Text style={[styles.tilteSection, { color: colors.action }]}>Tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginBottom: 8,paddingVertical :16, backgroundColor: colors.bg_default, borderRadius: 16, minHeight: 360 }}>
                            { notificaitons?.map((item,i) =>(
                                <View key={i}>
                                    <ItemNotification isSend={true} title={item.name} time={item.time} description={item.description} avatar={"https://picture.vn/wp-content/uploads/2015/12/da-lat.png"} />
                                </View>
                            ))}
                        </View>
                    </View>

                </View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({

    tilteSection: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500"
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
})