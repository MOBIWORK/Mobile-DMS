import React, { useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle, FlatList } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import { AppAvatar, AppHeader, AppIcons } from '../../../components/common'
import { ICON_TYPE } from '../../../const/app.const'
import { AppTheme, useTheme } from '../../../layouts/theme'
import { StaffType } from '../../../models/types'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'

const SelectedEmployee = ({ data, onClose, onSubmitSelected }: PropsType) => {

    const { colors } = useTheme();
    const styles = createStyle(useTheme());
    const { t: getLabel } = useTranslation();
    const [personals, setPersonals] = useState<StaffType[]>([])
    const [selectPersonal, setSelectPersonal] = useState<any[]>([])

    console.log('====================================');
    console.log(1);
    console.log('====================================');
    const onCheckStaff = (staff: any, isCheck: boolean) => {
        if (!isCheck) {
            const newArr = personals.map(item => {
                if (item.name == staff.name) {
                    item.isCheck = true
                }
                return item;
            })
            setPersonals(newArr);
        } else {
            const newArr = personals.map(item => {
                if (item.name == staff.name) {
                    item.isCheck = false
                }
                return item;
            })
            setPersonals(newArr);
        }
        const arrStf = personals.filter(item => item.isCheck == true);
        setSelectPersonal(arrStf);
    }

    const renderItem = (item: StaffType) => {
        return (
            <View style={styles.viewItem}>
                <View style={styles.flex}>
                    <AppAvatar size={48} url={item.image} name={item.first_name} />
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.codeEmploye}>{item.first_name}</Text>
                        <Text style={styles.nameEmploye}>{item.user_id}</Text>
                    </View>
                </View>
                <View style={{ paddingRight: 8 }}>
                    <Checkbox.Android color={colors.primary} style={{ borderRadius: 10 }} status={item.isCheck ? "checked" : "unchecked"} onPress={() => onCheckStaff(item, item.isCheck ? item.isCheck : false)} />
                </View>
            </View>
        )
    }

    const close = () => {
        setSelectPersonal([]);
        onClose()
    }

    useEffect(() => {
        setPersonals(data)
    }, [data])

    return (
        <View style={{ paddingHorizontal: 16 }}>
            <AppHeader style={{ marginTop: -5 }} label={getLabel("staff")}
                backButtonIcon={
                    <AppIcons
                        onPress={() => close()}
                        iconType='IonIcon'
                        name='close'
                        size={30}
                        color={colors.text_secondary} />}
                rightButton={
                    <Text onPress={() => onSubmitSelected()}
                        style={styles.textBt}>{getLabel("confirm")}
                    </Text>}
            />
            <View style={{ marginTop: 24 }}>
                <View style={styles.containerSearch}>
                    <AppIcons iconType={ICON_TYPE.IonIcon} name='search' size={20} color={colors.text_secondary} />
                    <TextInput placeholder={`${getLabel("search")} ...`} style={{ marginLeft: 8, flex: 1 }} />
                </View>

                <View style={{ marginTop: 20 }}>
                    {selectPersonal.length > 0 && (
                        <View style={{ marginBottom: 16, flexDirection: "row" }}>
                            {selectPersonal.map(item => (
                                <View key={item.employee} style={{ flexDirection: "row", marginRight: 12 }}>
                                    <AppAvatar size={48} url={item.image} />
                                    <Pressable
                                        onPress={() => onCheckStaff(item, true)}
                                        style={styles.deleteBt}>
                                        <View style={styles.viewBtt}>
                                            <AppIcons iconType={ICON_TYPE.IonIcon} name='close' size={14} color={colors.text_secondary} />
                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}


                        <FlatList
                            data={personals}
                            renderItem={(({ item }) => renderItem(item))}
                            initialNumToRender={10}

                        />
                        {/* {personals.map((item, i) => (
                        <View key={i}>
                            {renderItem(item)}
                        </View>
                    ))} */}
                </View>
            </View>
        </View>
    )
}

interface PropsType {
    onClose: () => void,
    onSubmitSelected: () => void
    data: StaffType[],
}

export default SelectedEmployee;

const createStyle = (theme: AppTheme) => StyleSheet.create({
    flex: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    viewItem: {
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    } as ViewStyle,
    codeEmploye: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
        color: theme.colors.text_primary
    } as TextStyle,
    nameEmploye: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 21,
        color: theme.colors.text_secondary
    } as TextStyle,
    textBt: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
        color: theme.colors.action
    } as TextStyle,
    deleteBt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.bg_default,
        width: 20,
        height: 20,
        borderRadius: 10,
        padding: 4,
        position: "absolute", top: -4, right: -4
    } as ViewStyle,
    viewBtt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.bg_neutral,
        width: 16, height: 16,
        borderRadius: 8
    } as ViewStyle,
    containerSearch: {
        height: 50,
        backgroundColor: theme.colors.bg_neutral,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 12,
        borderRadius: 4
    } as ViewStyle
})