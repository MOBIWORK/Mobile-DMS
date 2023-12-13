import React from 'react'
import { ViewStyle } from 'react-native'
import { Avatar } from 'react-native-paper'

const AppAvatar = ({ size , name ,url}: AvatarProps) => {
    if(url) {
        return (
            <Avatar.Image size={size || 50} source={{
                uri :url
            }} />
        )
    } else {
        return (
            <Avatar.Text size={size || 50} label={name || ""} />
        )
    }
}

interface AvatarProps {
    size?: number,
    name?: string
    url?: string,
    styles? :ViewStyle
}

export default AppAvatar