import React, { } from 'react'
import { Text, View, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'
import { AppTheme, useTheme } from '../../../../layouts/theme';
import { IStaff, StaffType } from '../../../../models/types';


const InputViewCompoment = ({ oulineColor, label, backgroundColor, data, onPress }: InputViewProps) => {

    const { colors } = useTheme();
    const styles = createStyles(useTheme());

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.contairAvatar,{ backgroundColor: backgroundColor || colors.bg_neutral, borderColor: oulineColor || colors.border}]}>
                {data && data.map(item => (
                    <View key={item.user_id} style={styles.containerAv}>
                        <Avatar.Image source={{ uri: item.image }} size={24} style={{ marginRight: 5 }} />
                        <Text style={styles.name}>{item.first_name}</Text>
                    </View>
                ))}
            </View>
            <Text style={[styles.textLabel]}>{label}</Text>
            <Text style={{ position: "absolute", zIndex: 99, top: -1, left: 16, color: backgroundColor || colors.bg_neutral, backgroundColor: backgroundColor || colors.bg_neutral }}>{label}</Text>
        </Pressable>
    )
}

interface InputViewProps {
    label: string,
    oulineColor?: string,
    backgroundColor?: string,
    data: StaffType[],
    onPress?: () => void
}

export default InputViewCompoment;

const createStyles = (theme : AppTheme)=> StyleSheet.create({
    textLabel :{
        fontSize: 12,
        lineHeight: 12,
        fontWeight: "600",
        position: "absolute",
        zIndex: 100,
        top: -6,
        left: 16,
        paddingHorizontal: 5,
        color: theme.colors.text_secondary 
    } as TextStyle,
    containerAv :{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
        backgroundColor: theme.colors.bg_default,
        padding: 5,
        paddingRight: 10,
        borderRadius: 8,
        maxWidth: "47%",
        marginBottom: 8
    } as ViewStyle,
    name :{
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "500",
        color: theme.colors.text_primary 
    }as TextStyle,
    contairAvatar :{
        minHeight: 70,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        paddingTop: 20,
        flexDirection: "row",
        flexWrap: "wrap"
    }as ViewStyle
})