import {SvgIconTypes} from '../../assets/svgIcon';
import { ScreenConstant } from '../../const';
import {Colors} from '../../layouts/theme';
import {CheckinOrderDetail, NoteType, StaffType} from '../../models/types';

export interface IItemCheckIn {
  icon: SvgIconTypes;
  name: string;
  isRequire: boolean;
  isDone: boolean;
  screenName: any;
  backgroundColor: keyof Colors;
  type?: string;
  key: string;
}

export type TypeState = {
  dataNote: NoteType[];
  dataStaff: StaffType[];
  dataTypeNote: any[];
  orderDetail: CheckinOrderDetail | null;
  categoriesCheckin: any[];
};

export const categoriesCheckinList: IItemCheckIn[] = [
  {
    icon: 'OrangeBox',
    isDone: false,
    isRequire: true,
    name: 'Kiểm tồn',
    screenName: 'CHECKIN_INVENTORY',
    backgroundColor: 'orangeBackground',
    key: 'inventory',
  },
  {
    icon: 'CameraPurple',
    isDone: false,
    isRequire: false,
    name: 'Chụp ảnh',
    screenName: 'TAKE_PICTURE_VISIT',
    backgroundColor: 'purpleBackground',
    key: 'camera',
  },
  {
    icon: 'IconOrder',
    isDone: false,
    isRequire: true,
    name: 'Đặt hàng',
    screenName: 'CHECKIN_ORDER',
    backgroundColor: 'blueBackground',
    type: 'ORDER',
    key: 'order',
  },
  {
    icon: 'GreenEdit',
    isDone: false,
    isRequire: false,
    name: 'Ghi chú',
    screenName: 'CHECKIN_NOTE_VISIT',
    backgroundColor: 'greenBackground',
    key: 'note',
  },
  {
    icon: 'RedLocation',
    isDone: false,
    isRequire: false,
    name: 'Vị trí',
    screenName: 'CHECKIN_LOCATION',
    backgroundColor: 'redBackground',
    key: 'location',
  },
  {
    icon: 'BlueUndo',
    isDone: false,
    isRequire: false,
    name: 'Trả hàng',
    screenName: 'CHECKIN_ORDER',
    backgroundColor: 'undoBackground',
    type: 'RETURN_ORDER',
    key: 'return_order',
  },
  {
    icon: 'MarkPicture',
    isDone: false,
    isRequire: false,
    name: 'Chấm điểm trưng bày',
    screenName: ScreenConstant.TAKE_PICTURE_SCORE,
    backgroundColor: 'undoBackground',
    key: 'mark_picture',
  },
];

export enum Action {
  GET_NOTE = 'GET_NOTE_',
  GET_STAFF = 'GET_STAFF_',
  GET_NOTE_TYPE = 'GET_NOTE_TYPE_',
}

export const GET_NOTE_ACTIONS = Action.GET_NOTE + 'GET_NOTE';
export const GET_STAFF_ACTIONS = Action.GET_STAFF + 'GET_STAFF';
export const GET_NOTE_TYPE_ACTIONS = Action.GET_NOTE_TYPE + 'GET_NOTE_TYPE';
