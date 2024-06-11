import React, { useMemo } from 'react'
import { ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'
import { getRandomColor } from '../../layouts/ColorTheme'
import isEqual from 'react-fast-compare'
import { Colors } from '../../assets'




const AppAvatar = ({ size , name ,url}: AvatarProps) => {
        const returnColors = useMemo(() =>{
            return getRandomColor()
        },[])
    
    if(url) {
        return (
            <Avatar.Image size={size || 50} source={{
                uri :url
            }} />
        )
    } else {
        return (
            <Avatar.Text size={size || 50} label={name?.slice(0,2) || ""}    style={{backgroundColor:Colors.gray_400}} />
        )
    }
}

interface AvatarProps {
    size?: number,
    name?: string
    url?: string,
    styles? :ViewStyle
}

export default React.memo(AppAvatar,isEqual)