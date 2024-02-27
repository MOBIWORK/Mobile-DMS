import React from 'react'
import { View } from 'react-native'
import { SkeletonLoading } from '../../components/common';
import { useTheme } from '../../layouts/theme';

const ItemSekeleton = () => {

    const {colors} = useTheme();

    return (
        <View style={{backgroundColor :colors.bg_default ,paddingHorizontal : 16 ,paddingVertical : 12, borderRadius :16}}>
            <View style={{flexDirection :"row" , columnGap :8}}>
                <SkeletonLoading width={64} height={82}/>
                <View style={{rowGap :8}}>
                    <SkeletonLoading width={200} height={20} borderRadius={8}/>
                    <SkeletonLoading width={130} height={20} borderRadius={8}/>
                    <SkeletonLoading width={100} height={20} borderRadius={8}/>
                </View>
            </View>
        </View>
    )
}

export default ItemSekeleton;