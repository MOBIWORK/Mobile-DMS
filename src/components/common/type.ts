import {ViewStyle, StyleProp,ImageStyle} from 'react-native';
import { ImageType } from '../../assets';


type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center';

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
