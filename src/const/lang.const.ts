// Common language
import {LanguageItemType} from '../models/types';
import {ImageAssets} from '../assets';

export const DEFAULT_LANG_CODE = 'vi';

// Namespace Key
export const NS_COMMON = 'common';

//Language Array
export const LANG_LIST: LanguageItemType[] = [
  {
    id: '1',
    label: 'Tiếng Việt',
    code: 'vi',
    image: ImageAssets.VNFLag,
    isSelected: true,
  },
  {
    id: '2',
    label: 'English',
    code: 'en',
    image: ImageAssets.ENFlag,
    isSelected: false,
  },
];
