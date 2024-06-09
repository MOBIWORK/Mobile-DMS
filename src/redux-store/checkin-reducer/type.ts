import {SvgIconTypes} from '../../assets/svgIcon';
import {ScreenConstant} from '../../const';
import {Colors} from '../../layouts/theme';
import {CheckinOrderDetail, NoteType, StaffType} from '../../models/types';
import {getState} from '../../utils/redux';

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
  orderDetail: CheckinOrderDetail | null | any;
  returnOrderDetail: CheckinOrderDetail | null | any;
  categoriesCheckin: any[];
  listProgramCampaign: any;
  selectedProgram: any;
  listImageSelect: any;
  imageToMark: any;
  listProgramImage: any;
};
export type DataSendMarkScore = {
  customer_code: string;
  e_name: string;
  campaign_code: string;
  category: string;
  images_time: any;
  images: any;
  setting_score_audit: any;
};

const {selectedProgram} = getState('checkin');

export const categoriesCheckinList: IItemCheckIn[] = [
  {
    icon: 'OrangeBox',
    isDone: false,
    isRequire: true,
    name: 'Kiểm tồn',
    screenName: ScreenConstant.CHECKIN_INVENTORY,
    backgroundColor: 'orangeBackground',
    key: 'inventory',
  },
  {
    icon: 'CameraPurple',
    isDone: false,
    isRequire: false,
    name: 'Chụp ảnh',
    screenName: ScreenConstant.TAKE_PICTURE_VISIT,
    backgroundColor: 'purpleBackground',
    key: 'camera',
  },
  {
    icon: 'IconOrder',
    isDone: false,
    isRequire: true,
    name: 'Đặt hàng',
    screenName: ScreenConstant.CHECKIN_ORDER_CREATE,
    backgroundColor: 'blueBackground',
    type: 'ORDER',
    key: 'order',
  },
  {
    icon: 'GreenEdit',
    isDone: false,
    isRequire: false,
    name: 'Ghi chú',
    screenName: ScreenConstant.CHECKIN_NOTE_VISIT,
    backgroundColor: 'greenBackground',
    key: 'note',
  },
  {
    icon: 'RedLocation',
    isDone: false,
    isRequire: false,
    name: 'Vị trí',
    screenName: ScreenConstant.CHECKIN_LOCATION,
    backgroundColor: 'redBackground',
    type: 'CHECKIN',
    key: 'location',
  },
  {
    icon: 'BlueUndo',
    isDone: false,
    isRequire: false,
    name: 'Trả hàng',
    screenName: ScreenConstant.CHECKIN_ORDER_CREATE,
    backgroundColor: 'undoBackground',
    type: 'RETURN_ORDER',
    key: 'return_order',
  },
  {
    icon: 'MarkPicture',
    isDone: false,
    isRequire: false,
    name: 'Chấm điểm trưng bày',
    screenName:
      selectedProgram && selectedProgram.length > 0
        ? ScreenConstant.LIST_ALBUM_SCORE
        : ScreenConstant.TAKE_PICTURE_SCORE,

    backgroundColor: 'undoBackground',
    type: 'take_picture_score',
    key: 'take_picture_score',
  },
];

export enum Action {
  GET_NOTE = 'GET_NOTE_',
  GET_STAFF = 'GET_STAFF_',
  GET_NOTE_TYPE = 'GET_NOTE_TYPE_',
  GET_LIST_PROGRAM_CAMPAIGN = 'GET_LIST_PROGRAM_CAMPAIGN_',
  POST_IMAGE_SCORE = 'POST_IMAGE_SCORE_',
  CREATE_REPORT_MARK_SCORE = 'CREATE_REPORT_MARK_SCORE_',
}

export const GET_NOTE_ACTIONS = Action.GET_NOTE + 'GET_NOTE';
export const GET_STAFF_ACTIONS = Action.GET_STAFF + 'GET_STAFF';
export const GET_NOTE_TYPE_ACTIONS = Action.GET_NOTE_TYPE + 'GET_NOTE_TYPE';
export const GET_LIST_PROGRAM_CAMPAIGN =
  Action.GET_LIST_PROGRAM_CAMPAIGN + 'GET_LIST_PROGRAM_CAMPAIGN';
export const POST_IMAGE_SCORE = Action.POST_IMAGE_SCORE + 'POST_IMAGE_SCORE';
export const CREATE_REPORT_MARK_SCORE = Action.CREATE_REPORT_MARK_SCORE;
