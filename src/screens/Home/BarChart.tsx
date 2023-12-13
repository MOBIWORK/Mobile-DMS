import React from 'react'
import { Text, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '@react-navigation/native'
import { AppConstant } from '../../const';

const BarChartStatistical = ({color}:PropTypes) => {
    const { colors } = useTheme();


    const data = [
        { value: 200, label: '06' },
        { value: 300, label: '07' },
        {
            value: 500,
            label: '08',
            topLabelComponent: () => (
                <Text style={{ color: 'blue', fontSize: 18, marginBottom: 6 }}>50</Text>
            ),
        },
        { value: 400, label: '09' },
        { value: 300, label: '10' },
        { value: 300, label: '11' },
    ];
    return (
        <View style={{padding :16, backgroundColor: colors.bg_default ,borderRadius :16}}>
            <View>
                <Text style={{fontSize :12 ,lineHeight :18 ,fontWeight :"400",marginBottom :5,color :colors.text_secondary}} >Tổng doanh số tháng đến thời điểm hiện tại</Text>
                <Text style={{fontSize :20 ,lineHeight :30 ,fontWeight :"500", marginBottom :5, color :colors.text_primary}} >105.035.984 đ 
                    <Text style={{fontSize :14 ,lineHeight :21 ,fontWeight :"400", color :color}}>(Đạt 50.2%)</Text>
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,marginTop :8}}>
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
    color :string,

}

export default BarChartStatistical