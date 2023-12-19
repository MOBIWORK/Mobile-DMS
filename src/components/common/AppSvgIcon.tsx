import React, {createElement, memo} from 'react'
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgComponent } from "../../assets/svgIcon";
import { useTheme } from "../../layouts/theme";
import { SvgIconProps } from './type';



const SvgIconComponent = ({
    source,
    color = '#000',
    size = 24,
    colorTheme,
    onPress,
    style,
  }: SvgIconProps) => {
    // state
    const theme = useTheme();
    // render
    return onPress ? (
      <TouchableOpacity
        style={style}
        disabled={typeof onPress !== 'function'}
        onPress={onPress}>
        {createElement(SvgComponent[source], {
          width: size,
          height: size,
          fill: colorTheme ? colorTheme : color,
          color: colorTheme ? colorTheme : color,
        })}
      </TouchableOpacity>
    ) : (
      <View style={style}>
        {createElement(SvgComponent[source], {
          width: size,
          height: size,
          fill: colorTheme ? colorTheme : color,
          color: colorTheme ? colorTheme : color,
        })}
      </View>
    );
  };
  
  export const SvgIcon = memo(SvgIconComponent);