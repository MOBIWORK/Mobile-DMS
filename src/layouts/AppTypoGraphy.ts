import { Platform } from "react-native";


export const FontDefault = {
    primary: Platform.select({
        ios:'SF-Pro-Display-Medium',
        android:'SF-Pro-Display-Medium'
    }),
    bold:Platform.select({
        ios:'SF-Pro-Display-Bold',
        android:'SF-Pro-Display-Bold'
    }),
    heavy:Platform.select({
        ios:'SF-Pro-Display-Heavy',
        android:'SF-Pro-Display-Heavy'
    }),
    light:Platform.select({
        ios:'SF-Pro-Display-Light',
        android:'SF-Pro-Display-Light'
    }),
    regular:Platform.select({
        ios:'SF-Pro-Display-Regular',
        android:'SF-Pro-Display-Regular'
    }),
    secondary: Platform.select({
        ios:'SF-Pro-Display-Black',
        android:'SF-Pro-Display-Black'
    }),
}
export type FontFamily = keyof typeof FontDefault