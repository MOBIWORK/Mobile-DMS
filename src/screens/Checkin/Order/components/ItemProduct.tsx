import React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { AppTheme, useTheme } from '../../../../layouts/theme';
import { AppIcons } from '../../../../components/common';
import { Text } from 'react-native';
import { ICON_TYPE } from '../../../../const/app.const';
import { CommonUtils } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

const ItemProduct = ({ name,code, dvt, quantity, price, percentage_discount, onRemove }: ProductProps) => {

    const { t: getLabel } = useTranslation();
    const { colors } = useTheme();
    const styles = createSheetStyle(useTheme());
    let priceP = price || 0
    let totalPrice = (priceP * quantity);
    let discount: number = 0;
    if (percentage_discount && percentage_discount > 0) {
        discount = (totalPrice * percentage_discount / 100);
        totalPrice = totalPrice - discount
    }
    return (
        <View style={styles.container}>
            <View style={[styles.flexSpace]}>
                <View>
                    <View style={styles.flex} >
                        <AppIcons iconType={ICON_TYPE.IonIcon} name='barcode-outline' size={24} color={colors.text_secondary} />
                        <Text style={[styles.code, { marginLeft: 4 }]}>{code}</Text>
                    </View>
                    <Text style={[styles.name, { marginLeft: 4 }]}>{name}</Text>

                </View>
                <View>
                    {onRemove && (
                        <TouchableOpacity onPress={() => onRemove && onRemove(name)} style={{paddingTop :3}}>
                            <AppIcons iconType={ICON_TYPE.IonIcon} name='trash-outline' size={18} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.contaienrIf}>
                <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                    <Text style={styles.textIf(colors.text_secondary)}>{getLabel("unit")}</Text>
                    <Text style={styles.textIf(colors.text_primary)}>{dvt}</Text>
                </View>
                <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                    <Text style={styles.textIf(colors.text_secondary)}>{getLabel("quantity")}</Text>
                    <Text style={styles.textIf(colors.text_primary)}>{quantity}</Text>
                </View>
                {price?.toString() && (
                    <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                        <Text style={styles.textIf(colors.text_secondary)}>{getLabel("unitPrice")}</Text>
                        <Text style={styles.textIf(colors.text_primary)}>{CommonUtils.formatCash(price.toString())}</Text>
                    </View>
                )}
                {percentage_discount?.toString() && (
                    <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                        <Text style={styles.textIf(colors.text_secondary)}>{getLabel("discount")} (%)</Text>
                        <Text style={styles.textIf(colors.text_primary)}>{percentage_discount?.toString()} %</Text>
                    </View>
                )}
                {percentage_discount?.toString() && (
                    <View style={[styles.flexSpace, { paddingVertical: 4 }]}>
                        <Text style={styles.textIf(colors.text_secondary)}>{getLabel("discount")}(VND)</Text>
                        <Text style={styles.textIf(colors.text_primary)}>
                            {CommonUtils.formatCash(discount.toString())}
                        </Text>
                    </View>
                )}
            </View>
            {price?.toString() && (
                <View style={styles.flexSpace}>
                    <Text style={styles.textIf(colors.text_primary)}>{getLabel("intoMoney")}</Text>
                    <Text style={styles.name}>{CommonUtils.formatCash(totalPrice.toString())}</Text>
                </View>
            )}
        </View>
    )
}

interface ProductProps {
    code : string
    name: string,
    dvt: string,
    quantity: number,
    price?: number,
    percentage_discount?: number
    discount?: number | string
    onRemove?: (item_code: string) => void
}

export default ItemProduct;

const createSheetStyle = (theme: AppTheme) => StyleSheet.create({
    code :{
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
        color: theme.colors.text_secondary
    }as TextStyle,
    flex: {
        flexDirection: "row",
        alignItems: "center",
    } as ViewStyle,
    flexSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
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