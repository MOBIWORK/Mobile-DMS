import React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { AppIcons } from '../common';
import { Text } from 'react-native';
import { ICON_TYPE } from '../../const/app.const';
import { CommonUtils } from '../../utils';
import { useTheme, AppTheme } from '../../layouts/theme';
import { useTranslation } from 'react-i18next';

const ItemProduct = ({ name, dvt, quantity, price, percentage_discount, discount ,totalPrice}: ProductProps) => {
    const {t : getLabel} = useTranslation();
    const { colors } = useTheme();
    const styles = createSheetStyle(useTheme());

    return (
        <View style={styles.container}>
            <View style={styles.flex}>
                <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={24} />
                <Text style={[styles.name, { marginLeft: 4 }]}>{name}</Text>
            </View>
            <View style={styles.contaienrIf}>
                <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                    <Text style={styles.textIf(colors.text_secondary)}>Đơn vị tính</Text>
                    <Text style={styles.textIf(colors.text_primary)}>{dvt}</Text>
                </View>
                <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                    <Text style={styles.textIf(colors.text_secondary)}>Số lượng</Text>
                    <Text style={styles.textIf(colors.text_primary)}>{quantity}</Text>
                </View>
                <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                    <Text style={styles.textIf(colors.text_secondary)}>Đơn giá</Text>
                    <Text style={styles.textIf(colors.text_primary)}>{CommonUtils.formatCash(price.toString())}</Text>
                </View>
                {percentage_discount && (
                    <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                        <Text style={styles.textIf(colors.text_secondary)}>Chiết khấu (%)</Text>
                        <Text style={styles.textIf(colors.text_primary)}>{percentage_discount} %</Text>
                    </View>
                )}
                {discount && (
                    <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                        <Text style={styles.textIf(colors.text_secondary)}>Chiết khấu(VND)</Text>
                        <Text style={styles.textIf(colors.text_primary)}>{CommonUtils.formatCash(discount.toString())}</Text>
                    </View>
                )}
            </View>
            <View style={styles.flexSpace}>
                <Text style={styles.textIf(colors.text_primary)}>{getLabel("intoMoney")}</Text>
                <Text style={styles.name}>{CommonUtils.formatCash(totalPrice.toString())}</Text>
            </View>
        </View>
    )
}

interface ProductProps {
    name: string,
    dvt: string,
    quantity: number,
    price: number,
    percentage_discount?: number | string,
    discount?: number | string,
    totalPrice : number,
}

export default ItemProduct;

const createSheetStyle = (theme: AppTheme) => StyleSheet.create({
    flex: {
        flexDirection: "row",
        alignItems: "center",
    } as ViewStyle,
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    } as ViewStyle,
    name: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "500",
        color: theme.colors.text_primary
    } as TextStyle,
    container: {
        rowGap: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.bg_default,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border
    } as ViewStyle,
    textIf: (color: string) => ({
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
        color: color
    } as TextStyle),
    contaienrIf: {
        paddingVertical: 4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.divider
    } as ViewStyle
})