import { Dimensions, StyleSheet,ViewStyle } from "react-native";
import { AppTheme } from "../../../layouts/theme";

const {height:SCREEN_HEIGHT} = Dimensions.get('window')
export const rootStyles = (theme:AppTheme) =>StyleSheet.create({
    container:{
        height:SCREEN_HEIGHT,
        width:'100%',
        backgroundColor:theme.colors.white,
        position:'absolute',
        top:SCREEN_HEIGHT ,
        borderRadius:25,
        
    } as ViewStyle
})
