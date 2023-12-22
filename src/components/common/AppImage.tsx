import { Image, StyleSheet, Text, View,ImageStyle } from 'react-native'
import { ImageAssets } from '../../assets'
import React from 'react'
import { ImageProps } from './type'

const AppImage = (props: ImageProps) => {
    const {containerStyle,style:styleOverride,resizeMode,source,size} = props
  return (
    <View style={containerStyle}>
      <Image
        style={[styles.img(size), styleOverride]}
        resizeMode={resizeMode}
        source={ImageAssets[source ?? 'default']}
      />
    </View>
  )
}

export default AppImage

const styles = StyleSheet.create({
    img:(size?:number) =>({
        width: size ? size*2 :'100%',
        height: size ? size*2 :'100%'
    }) as ImageStyle
})