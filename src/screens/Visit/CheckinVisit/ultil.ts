import {SvgIconTypes} from '../../../assets/svgIcon';
import {ScreenConstant} from '../../../const';
import {ColorDefault} from '../../../layouts/ColorTheme';
import {Colors, MyAppTheme} from '../../../layouts/theme';
import { getState } from '../../../utils/redux';

export interface IItemCheckIn {
  icon: SvgIconTypes;
  name: string;
  isRequire: boolean;
  isDone: boolean;
  screenName: any;
  backgroundColor: keyof Colors;
  type?: string;
  screenName2?:any
}

// const {selectedProgram} = getState('checkin')
export const item: IItemCheckIn[] = [
  {
    icon: 'OrangeBox',
    isDone: true,
    isRequire: true,
    name: 'Kiểm tồn',
    screenName: 'CHECKIN_INVENTORY',
    backgroundColor: 'orangeBackground',
  },
  {
    icon: 'CameraPurple',
    isDone: true,
    isRequire: false,
    name: 'Chụp ảnh',
    screenName: 'TAKE_PICTURE_VISIT',
    backgroundColor: 'purpleBackground',
  },
  {
    icon: 'IconOrder',
    isDone: false,
    isRequire: true,
    name: 'Đặt hàng',
    screenName: 'CHECKIN_ORDER',
    backgroundColor: 'blueBackground',
    type: 'ORDER',
  },
  {
    icon: 'GreenEdit',
    isDone: false,
    isRequire: false,
    name: 'Ghi chú',
    screenName: 'CHECKIN_NOTE_VISIT',
    backgroundColor: 'greenBackground',
  },
  {
    icon: 'RedLocation',
    isDone: true,
    isRequire: false,
    name: 'Vị trí',
    screenName: 'CHECKIN_LOCATION',
    backgroundColor: 'redBackground',
  },
  {
    icon: 'BlueUndo',
    isDone: false,
    isRequire: false,
    name: 'Trả hàng',
    screenName: 'CHECKIN_ORDER',
    backgroundColor: 'undoBackground',
    type: 'RETURN_ORDER',
  },
  {
    icon: 'MarkPicture',
    isDone: false,
    isRequire: false,
    name: 'Chấm điểm trưng bày',
    screenName:  ScreenConstant.TAKE_PICTURE_SCORE,
    screenName2:ScreenConstant.LIST_ALBUM_SCORE,
    backgroundColor: 'undoBackground',
    type:''
  },
];
