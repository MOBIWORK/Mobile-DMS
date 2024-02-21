import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { SkeletonLoading } from '../../../components/common'
import { AppTheme, useTheme } from '../../../layouts/theme'

const ItemSkeleton = () => {
    
    const {colors} = useTheme();
    const styles = createStyles(useTheme());

    return (
        <View style={styles.container}>
            <SkeletonLoading width={24} height={24} borderRadius={6}/>
            <View style={{flex :1}}>
                <View style={styles.row}>
                    <SkeletonLoading width={100} height={20} borderRadius={6}/>
                    <SkeletonLoading width={120} height={20} borderRadius={6}/>
                </View>
                <View style={styles.row}>
                    <SkeletonLoading width={70} height={20} borderRadius={6}/>
                    <SkeletonLoading width={80} height={30} borderRadius={6}/>
                </View>
                <View style={styles.row}>
                    <SkeletonLoading width={90} height={20} borderRadius={6}/>
                    <SkeletonLoading width={150} height={35} borderRadius={6}/>
                </View>
                <View style={[styles.row,{borderColor : colors.bg_default}]}>
                    <SkeletonLoading width={60} height={20} borderRadius={6}/>
                    <SkeletonLoading width={130} height={35} borderRadius={6}/>
                </View>
            </View>
        </View>
    )
}

export default ItemSkeleton;

const createStyles = (theme : AppTheme)=> StyleSheet.create({
    container :{
        paddingHorizontal : 16 ,
        paddingVertical:12,
        backgroundColor : theme.colors.bg_default ,
        flexDirection:"row" ,
        columnGap : 8
    }as ViewStyle,
    row :{
        flex :1,
        height :"auto",
        flexDirection :"row",
        alignItems :"center",
        justifyContent :"space-between",
        paddingVertical : 12,
        borderBottomWidth :1,
        borderColor : theme.colors.border
    }as ViewStyle
})