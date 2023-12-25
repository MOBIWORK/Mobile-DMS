import { SvgIconTypes } from "../../../assets/svgIcon"

export type ProfileContent = PressAbleContent | UnPressAbleContent


export type PressAbleContent = {
    id:string | number,
    name:string,
    icon:SvgIconTypes,
    leftSide:true,
    
    // onPress:() => void
}
export type UnPressAbleContent = {
    id:string | number,
    name:string,
    icon:SvgIconTypes,
    leftSide:false,
    onPress:() => void
}




export const ContentProfile:ProfileContent[] = [
    {
        id:'infor',
        name:'infor',
        icon:'IconUser',
        leftSide:false,
        onPress:() => {}
    },
    {
        id:'language',
        name:'language',
        icon:'Language',
        leftSide:true,
        
    },
    {
        id:'setting',
        name:'accountSetting',
        icon:'Setting',
        leftSide:false,
        onPress:() => {}
    },
    {
        id:'theme',
        name:'theme',
        icon:'IconDarkMode',
        leftSide:true,
        
    },
    {
        id:'sync',
        name:'syncData',
        icon:'IconUser',
        leftSide:false,
        onPress:() => {}
    },

]