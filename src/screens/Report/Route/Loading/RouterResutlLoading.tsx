import React from 'react'
import { View } from 'react-native';
import { SkeletonLoading } from '../../../../components/common';
import { AppConstant } from '../../../../const';
import { useTheme } from '../../../../layouts/theme';

const RouterResutlLoading = () => {
    const {colors} = useTheme();
    const data = [1,2,3,4,5,6,7]
    return (
        <View style={{rowGap :12 ,marginTop :24}}>
            <View style={{rowGap :8,alignItems :'center',paddingHorizontal :24 , paddingVertical :16 ,borderRadius :16 ,backgroundColor : colors.bg_default}}>
                <SkeletonLoading height={100} borderRadius={8} width={AppConstant.WIDTH - (32 +48)}/>
                <SkeletonLoading height={20} borderRadius={8} width={AppConstant.WIDTH - (64 +48)}/>
            </View>
            <View style={{padding :24 , borderRadius :16 , rowGap :8 ,backgroundColor :colors.bg_default}}>
                <SkeletonLoading height={20} borderRadius={8} width={100}/>
                <SkeletonLoading height={20} borderRadius={8} width={130}/>
            </View>
            <View style={{flexDirection :"row" ,columnGap :8 ,flexWrap :"wrap" ,rowGap :8}}>
                    {data.map(item =>(
                        <View key={item} style={{width : (AppConstant.WIDTH - 40) / 2,backgroundColor :colors.bg_default ,paddingHorizontal :20 , paddingVertical :24 ,borderRadius :16 ,rowGap :8}}>
                            <SkeletonLoading height={20} borderRadius={8} width={40}/>
                            <SkeletonLoading height={20} borderRadius={8} width={120}/>
                        </View>
                    ))}
            </View>
        </View>

    )
}

export default RouterResutlLoading;