import React from 'react'
import { Text, View, TextStyle, ViewStyle } from 'react-native'
import { BarChart } from 'react-native-gifted-charts';
import { AppConstant } from '../../const';
import { StyleSheet } from 'react-native';
import { AppTheme, useTheme } from '../../layouts/theme';

const BarChartStatistical = ({ color }: PropTypes) => {
    const { colors } = useTheme();
    const styles = rootStyles(useTheme())

    const data = [
        { value: 200, label: '06' },
        { value: 300, label: '07' },
        { value: 500, label: '08' },
        { value: 400, label: '09' },
        { value: 300, label: '10' },
        { value: 300, label: '11' },
    ];
    return (
        <View style={{ padding: 16, backgroundColor: colors.bg_default, borderRadius: 16 }}>
            <View>
                <Text style={[styles.title]} >Tổng doanh số tháng đến thời điểm hiện tại</Text>
                <Text style={[styles.description]} >105.035.984 đ
                    <Text style={[styles.desSub, { color: color }]}>{`  `}(Đạt 50.2%)</Text>
                </Text>
            </View>
            <View style={[styles.containerBar]}>
                <BarChart
                    barWidth={10} data={data}
                    frontColor={color}
                    noOfSections={6}
                    stepValue={10}
                    initialSpacing={37}
                    yAxisIndicesHeight={20}
                    spacing={37}
                    maxValue={600}
                    stepHeight={20}
                    xAxisColor={colors.border}
                    yAxisColor={colors.border}
                />
            </View>
        </View>

    )
}

interface PropTypes {
    color: string,

}

export default BarChartStatistical;

const rootStyles = (theme: AppTheme) => StyleSheet.create({
    title: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "400",
        marginBottom: 5,
        color :theme.colors.text_secondary
    } as TextStyle,
    description: {
        marginTop :5,
        fontSize: 20,
        lineHeight: 30,
        fontWeight: "500",
        color :theme.colors.text_primary
    } as TextStyle,
    desSub: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
    } as TextStyle,
    containerBar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    } as ViewStyle
})