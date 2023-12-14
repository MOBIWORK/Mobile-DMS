import { Image, StyleSheet, Text, View,ImageStyle } from 'react-native'
import { ImageAssets } from '../../assets'
import React from 'react'
import { ImageProps } from './type'

const AppImage = (props: ImageProps) => {
    const {containerStyle,style:styleOverride,resizeMode,source} = props
  return (
    <View style={containerStyle}>
      <Image
        style={[styles.img, styleOverride]}
        resizeMode={resizeMode}
        source={ImageAssets[source ?? 'default']}
      />
    </View>
  )
}

export default AppImage

const styles = StyleSheet.create({
    img:{
        width:'100%',
        height:'100%'
    } as ImageStyle
})