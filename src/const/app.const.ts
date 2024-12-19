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

//version
export const IOS_VERSION = '1.0.15';
export const ANDROID_VERSION = '1.0.15';

//mmkv KEY
export const Theme = 'Theme';
export const Language_Code = 'Language_Code';
export const FCM_TOKEN = 'FCM_TOKEN';
export const userNameStore = 'userNameStore';
export const passwordStore = 'passwordStore';
export const biometricObject = 'biometricObject';
export const FirstLogin = 'FirstLogin';
export const isLogOut = 'LogOut';
export const Organization = 'organization';
export const ListSearchProductNearly = 'listSearchProductNearly';
export const ListSearchOrderNearly = 'listSearchOrderNearly';
export const ListSearchVisitNearly = 'ListSearchVisitNearly';
export const ListSearchCustomerNearly = 'ListSearchCustomerNearly';
export const Widget = 'Widget';
export const NotificationData = 'NotificationData';
export const CheckinTime = 'CheckinTime';
export const Api_key = 'Api_key';
export const Api_secret = 'Api_secret';
export const CateList = 'CateList';
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
export const additional_distance = 150; //sai số checkin/checkOut (m)

export const BiometricType = {
  FaceID: 'FaceID',
  TouchID: 'TouchID',
  null: 'null',
};

export const PROMOTION_TYPE_VALUE = {
  TIEN_SP: 'TIEN_SP', // Tổ tiền hàng đủ khuyến mãi tặng sp
  SP_SL_SP: 'SP_SL_SP', //Trường hợp khuyến mãi tặng sản phẩm
  SP_SL_CKSP: 'SP_SL_CKSP', //Trường hợp khuyến mãi SP_SL_CKSP và SP_ST_CKSP (Chiết khấu item)
  SP_SL_TIEN: 'SP_SL_TIEN', //Trường hợp khuyến mãi SP_SL_TIEN và SP_ST_TIEN (Của item)
  TIEN_CKDH: 'TIEN_CKDH', //Trường hợp TIEN_CKDH (chiết khấu % cả đơn)
  TIEN_TIEN: 'TIEN_TIEN', //Trường hợp TIEN_TIEN (chiết khấu tổng tiền cả đơn)
  SP_ST_SP: 'SP_ST_SP', //Trường hợp mua đủ số tiền tặng SP
  SP_ST_CKSP: 'SP_ST_CKSP', //Trường hợp mua đủ số tiền khuyến mãi SP_SL_CKSP và SP_ST_CKSP (Chiết khấu item)
  SP_ST_TIEN: 'SP_ST_TIEN', //Trường hợp mua đủ số tiền khuyến mãi SP_SL_TIEN và SP_ST_TIEN (Của item)
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
  loai_hinh_khach_hang = 'loai_hinh_khach_hang',
  kenh = 'kenh',
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
    value: 'monthly',
    isSelected: false,
  },
  {
    label: 'lastMonth',
    value: 'last_month',
    isSelected: false,
  },
  {
    label: 'selectDate',
    value: 'selectDate',
    isSelected: false,
  },
];

export const ReportFilterNonCustomerData: IFilterType[] = [
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
    label: 'selectDate',
    value: 'selectDate',
    isSelected: false,
  },
];

export const ReportFilterKPIData: IFilterType[] = [
  {
    label: 'thisMonth',
    value: 'monthly',
    isSelected: true,
  },
  {
    label: 'lastMonth',
    value: 'last_month',
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
