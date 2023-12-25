import { SvgIconTypes } from "../../../assets/svgIcon"

export type ProfileContent = PressAbleContent | UnPressAbleContent


export type PressAbleContent = {
    id:string | number,
    name:string,
    icon:SvgIconTypes,
    rightSide:true,
    
    // onPress:() => void
}
export type UnPressAbleContent = {
    id:string | number,
    name:string,
    icon:SvgIconTypes,
    rightSide:false,
    onPress:() => void
}




export const ContentProfile:ProfileContent[] = [
    {
        id:'infor',
        name:'infor',
        icon:'IconUser',
       rightSide:false,
        onPress:() => {console.log('a')}
    },
    {
        id:'language',
        name:'language',
        icon:'Language',
       rightSide:true,
        
    },
    {
        id:'setting',
        name:'accountSetting',
        icon:'Setting',
       rightSide:false,
        onPress:() => {console.log('v')}
    },
    {
        id:'theme',
        name:'theme',
        icon:'IconDarkMode',
       rightSide:true,
        
    },
    {
        id:'sync',
        name:'syncData',
        icon:'IconUser',
       rightSide:false,
        onPress:() => {console.log('c')}
    },

]