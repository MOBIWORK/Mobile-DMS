import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "react-native";
import { AppAvatar, AppIcons } from "../common"; 
import { useTheme } from "@react-navigation/native";
import { AppConstant } from "../../const";


const ItemNotification = ({title,description,time,isSend ,avatar}: PropTypes) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.flex,
                {
                    paddingVertical: 12,
                    backgroundColor: isSend
                        ? colors.bg_default
                        : "rgba(0, 184, 217, 0.08)",
                },
            ]}
        >
            <View style={{ marginRight: 16, paddingLeft: 16 }}>
                <AppAvatar size={40} url={avatar} />
            </View>
            <View style={{ width: AppConstant.WIDTH - 120, overflow: "hidden" }}>
                <Text
                    style={[styles.title, { color: colors.text_primary }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <Text
                    style={[styles.description, { color: colors.text_primary }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {description}
                </Text>
                <View
                    style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
                >
                    <AppIcons
                        size={12}
                        name="clockcircleo"
                        iconType="AntIcon"
                        color={colors.text_secondary}
                    />
                    <Text
                        style={[
                            styles.time,
                            { marginLeft: 5, color: colors.text_secondary },
                        ]}
                    >
                        {time}
                    </Text>
                </View>
            </View>
        </View>
    );
};

interface PropTypes {
    title :string,
    description :string,
    avatar :string,
    time :string
    isSend :boolean
}

export default ItemNotification;

const styles = StyleSheet.create({
    flex: {
        flexDirection: "row",
    } as ViewStyle,
    title: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
    } as TextStyle,
    description: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
    } as TextStyle,
    time: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
    } as TextStyle,
});
