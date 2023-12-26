import {SvgIconTypes} from '../../../assets/svgIcon';
import { ScreenConstant } from '../../../const';
import { ColorDefault } from '../../../layouts/ColorTheme';
import { Colors, MyAppTheme } from '../../../layouts/theme';

export interface IItemCheckIn {
  icon: SvgIconTypes;
  name: string;
  isRequire: boolean;
  isDone: boolean;
  screenName:keyof typeof ScreenConstant,
  backgroundColor:keyof Colors
}
export const item: IItemCheckIn[] = [
  {
    icon: 'OrangeBox',
    isDone: true,
    isRequire: true,
    name: 'Kiểm tồn',
    screenName:'WORK_SHEET',
    backgroundColor:'orangeBackground'
  },
  {
    icon: 'CameraPurple',
    isDone: true,
    isRequire: false,
    name: 'Chụp ảnh',
    screenName:'WORK_SHEET',
    backgroundColor:'purpleBackground'

  },
  {
    icon: 'IconOrder',
    isDone: false,
    isRequire: true,
    name: 'Đặt hàng',
    screenName:'ORDER_SCREEN',
    backgroundColor:'blueBackground'

  },
  {
    icon: 'GreenEdit',
    isDone: false,
    isRequire: false,
    name: 'Ghi chú',
    screenName:'CKECKIN_ORDER',
    backgroundColor:'greenBackground'
  },
  {
    icon: 'RedLocation',
    isDone: true,
    isRequire: false,
    name: 'Vị trí',
    screenName:'LIST_VISIT',
    backgroundColor:'redBackground'
  },
  {
    icon: 'BlueUndo',
    isDone: false,
    isRequire: false,
    name: 'Trả hàng',
    screenName:'ADVANCE',
    backgroundColor:'undoBackground'
  },
];
