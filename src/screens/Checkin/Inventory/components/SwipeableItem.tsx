import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AppIcons } from "../../../../components/common";
import { ICON_TYPE } from "../../../../const/app.const";
import { StyleSheet } from "react-native";

const SwipeableItem = ({
    children,
    handlerClick
}: SwipeableItemProps) => {

    const { colors } = useTheme();
    const { t: getLabel } = useTranslation();

    const rigtSwipe = () => {
        return (
            <View>
                <View style={{ height: "100%", flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={handlerClick}
                        style={[styles.containerBt as any,{backgroundColor: colors.error}]}
                    >
                        <View style={{ alignItems: "center" }}>
                            <AppIcons
                                iconType={ICON_TYPE.IonIcon}
                                size={24}
                                name="trash"
                                color={colors.bg_default}
                            />
                            <Text style={[styles.textDl as any,{color: colors.bg_default}]}>
                                {getLabel("Xoá")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ borderRadius: 16, overflow: "hidden" }}>
            <Swipeable renderRightActions={rigtSwipe} overshootRight={false}>{children}</Swipeable>
        </View>
    );
};

interface SwipeableItemProps {
    children?: React.ReactNode;
    handlerClick?: () => void
}

export default SwipeableItem;

const styles = StyleSheet.create({
    containerBt :{
        height: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textDl :{
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "500",
        marginTop: 4,
    }
})