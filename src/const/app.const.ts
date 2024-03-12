import {Dimensions} from 'react-native';
import {IFilterType} from '../components/common/FilterListComponent';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

//MapBox
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94bmdvY3NvbjEiLCJhIjoiY2xneWlsbDVuMDl0dTNocWM5aWM2ODF6dyJ9.tQx_q1DbVfxsaSVQutF1JQ';

export const MAP_TITLE_URL = {
  adminMap:
    'https://api.ekgis.vn/v1/maps/roadmap/{z}/{x}/{y}.png?api_key=oR8BDxoEoVUhPVfUP5fFGZkB5veGbADBwMYeJNYY',
};

//notification
export const CHANNEL_ID = 'ngocson_DMS';
export const CHANNEL_NAME = 'Ngọc Sơn MBW DMS';

//mmkv KEY
export const Theme = 'Theme';
export const Language_Code = 'Language_Code';
export const FCM_TOKEN = 'FCM_TOKEN';
export const OTPTime = 'OTPTime';
export const OPTDateTime = 'OPTDateTime';
export const userNameStore = 'userNameStore';
export const passwordStore = 'passwordStore';
export const biometricObject = 'biometricObject';
export const FirstLogin = 'FirstLogin';
export const HiddenBottomBar = 'HiddenBottomBar';
export const isLogOut = 'LogOut';
export const currentShift = 'CurrentShift';
export const UserInfo = 'UserInfo';
export const Organization = 'organization';
export const ListSearchProductNearly = 'listSearchProductNearly';
export const ListSearchVisitNearly = 'ListSearchVisitNearly';
export const ListSearchCustomerNearly = 'ListSearchCustomerNearly';
export const Widget = 'Widget';

export const Api_key = 'Api_key';
export const Api_secret = 'Api_secret';

//IconsType
export const ICON_TYPE = {
  EntypoIcon: 'EntypoIcon',
  IonIcon: 'IonIcon',
  AweIcons: 'AweIcons',
  AweIcons5: 'AweIcons5',
  AntIcon: 'AntIcon',
  MateriallIcon: 'MateriallIcon',
  MaterialCommunity: 'MaterialCommunity',
  Feather: 'Feather',
};

//const
export const BiometricType = {
  FaceID: 'FaceID',
  TouchID: 'TouchID',
  null: 'null',
};

export const ProductFilterType = {
  nhom_sp: 'nhom_sp',
  thuong_hieu: 'thuong_hieu',
  nghanh_hang: 'nghanh_hang',
};

export const VisitFilterType = {
  channel: 'channel',
  state: 'state',
  distance: 'distance',
  name: 'name',
  birthday: 'birthday',
  customerGroup: 'customerGroup',
  customerType: 'customerType',
};

export enum CustomerFilterType {
  nhom_khach_hang = 'nhom_khach_hang',
  loai_khach_hang = 'loai_khach_hang',
  ngay_sinh_nhat = 'ngay_sinh_nhat',
  dia_chi = 'dia_chi',
  nguoi_lien_he = 'nguoi_lien_he',
  khu_vuc = 'khu_vuc',
  tuyen = 'tuyen',
  tan_suat = 'tan_suat',
}
const DURATION_HIDE = 1000;
const DURATION_ANIMATED = 500;
const BG_SUCCESS = '#2ecc71';
const BG_INFO = '#f6e58d';
const BG_ERROR = '#e74c3c';
const BG_WARN = '#f1c40f';
export {
  DURATION_HIDE,
  DURATION_ANIMATED,
  BG_SUCCESS,
  BG_INFO,
  BG_ERROR,
  BG_WARN,
};
export const SelectedDateFilterData: IFilterType[] = [
  {
    label: 'today',
    value: 1,
    isSelected: true,
  },
  {
    label: 'thisWeek',
    value: 2,
    isSelected: false,
  },
  {
    label: 'thisMonth',
    value: 3,
    isSelected: false,
  },
  {
    label: 'selectDate',
    value: 4,
    isSelected: false,
  },
];

export const ReportFilterData: IFilterType[] = [
  {
    label: 'today',
    value: new Date().getTime(),
    isSelected: true,
  },
  {
    label: 'yesterday',
    value: new Date().setDate(new Date().getDate() - 1),
    isSelected: false,
  },
  {
    label: 'thisMonth',
    value: 'thisMonth',
    isSelected: false,
  },
  {
    label: 'lastMonth',
    value: 'lastMonth',
    isSelected: false,
  },
  {
    label: 'selectDate',
    value: 'selectDate',
    isSelected: false,
  },
];

export const ReportFilterKPIData: IFilterType[] = [
  {
    label: 'thisMonth',
    value: 'thisMonth',
    isSelected: true,
  },
  {
    label: 'lastMonth',
    value: 'lastMonth',
    isSelected: false,
  },
];

export const DistanceFilterData: IFilterType[] = [
  {
    label: 'nearest',
    value: 0,
    isSelected: true,
  },

  {
    label: 'furthest',
    value: 1,
    isSelected: false,
  },
];
