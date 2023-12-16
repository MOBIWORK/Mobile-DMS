import {ViewStyle, StyleProp,ImageStyle, TextProps as TextProperties, TextStyle} from 'react-native';
import React from 'react'
import { Colors } from '../../layouts/theme';
import { ImageType } from '../../assets';
import { TextPresetNames } from './style';
import { FontDefault, FontFamily } from '../../layouts/AppTypoGraphy';

type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center';
type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';
type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';
export interface ImageProps {
  /**
   * Overwrite image style
   * @default undefined
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Overwrite wrap image style
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Source image(local)
   * @default undefined
   */
  source: ImageType;

  /**
   * Custom resizeMode
   * @default contain
   */
  resizeMode?: ResizeMode;
}

export interface TextProps extends TextProperties {
  fontStyle?: 'normal' | 'italic';

  letterSpacing?: number;

  lineHeight?: number;

  /**
   * Children of text
   * @default undefined
   */
  children?: React.ReactNode;

  /**
   * Text which is looked up via i18n.
   * @default undefined
   */
  tx?: string;

  /**
   * Option of i18n
   * @default undefined
   */
  txOptions?: any;

  /**
   * Using text string instead i18n
   * @default undefined
   */
  text?: string;

  /**
   * Enable to using {flex:1}
   * @default undefined
   */
  flex?: boolean;

  /**
   * Overwrite font size
   * @default 14
   */
  fontSize?: number;

  /**
   * Overwrite font weight
   * @default undefined
   */
  fontWeight?: FontWeight;

  /**
   * Overwrite font family
   * @default undefined
   */
  fontFamily?: FontFamily;

  /**
   * Using color
   * @default undefined
   */
  color?: string;

  /**
   * Overwrite background color with theme
   */
  colorTheme?: keyof Colors;

  /**
   * Set true for using textAlign = 'center'
   * @default undefined
   */
  center?: boolean;

  /**
   * Overwrite textAlign
   * @default undefined
   */
  textAlign?: TextAlign;

  /**
   * Overwrite textTransform
   * @default undefined
   */
  textTransform?: TextTransform;

  /**
   * Overwrite style of text component
   * @default undefined
   */
  style?: StyleProp<TextStyle>;
  /**
   * Preset for text
   * @default default
   */
  preset?: TextPresetNames;
  /*
  * Number of lines 
  */
  numberOfLines?: number | undefined;
}


