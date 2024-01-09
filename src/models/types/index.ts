import {SvgIconTypes} from '../../assets/svgIcon';

export interface KeyAbleProps {
  [key: string]: any;
}
export interface IApiResponse {
  status: number;
  result: any;
  title: string;
  message: string;
}
export type LanguageItemType = {
  id: string;
  label: string;
  code: string;
  image: any;
  isSelected: boolean;
};

export type IResOrganization = {
  company_name?: string;
  erpnext_url?: string;
  country?: string;
  erpnext_setup?: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  mobile_no?: string;
  status?: string;
};

export type ILoginResponse = {
  key_details: {
    api_key: string;
    api_secret: string;
  };
  user: {
    date_of_birth: string;
    department: string;
    designation: string | null;
    employee: string;
    employee_name: string;
    gender: string;
    image: string | null;
    salutation: string | null;
    shift: {
      shift_status: string;
      shift_type_now: boolean;
    };
    user_id: string;
  };
};

export type IProductList = {
  name: string;
  type: string;
  code: string;
};

export type IProductOverview = {
  name: string;
  code: string;
  unit: string;
  price: number;
  trademark: string | null;
  commodity_industry: string | null;
  note: string | null;
  image: string[];
  file?: {
    file_name: string;
    size: number;
    url: string;
  }[];
};

export type IProductUnit = {};

export type IProductInventory = {
  label: string;
  count: number;
};

export interface RootObjectGeoDecoding {
  plus_code: PlusCode;
  results: ResultDecode[];
  status: string;
}
export interface ResultDecode {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}
export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds?: Viewport;
}
export interface Viewport {
  northeast: Location;
  southwest: Location;
}
export interface Location {
  lat: number;
  lng: number;
}
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface PlusCode {
  compound_code: string;
  global_code: string;
}
export type VisitListItemType = {
  label: string;
  useName: string;
  status: boolean;
  address: string | null;
  phone_number: string | null;
  lat: number;
  long: number;
  distance: number;
};

export interface RootObjectGeoDecoding {
  plus_code: PlusCode;
  results: ResultDecode[];
  status: string;
}
export interface ResultDecode {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}
export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds?: Viewport;
}
export interface Viewport {
  northeast: Location;
  southwest: Location;
}
export interface Location {
  lat: number;
  lng: number;
}
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export interface PlusCode {
  compound_code: string;
  global_code: string;
}
export interface IWidget {
  id: number;
  name: string;
  icon: SvgIconTypes;
  navigate: string | any;
  isUse?: boolean;
}
export type ItemNoteVisitDetail = {
  noteType: string;
  description: string;
  content: string;
  time: string;
  date: string;
};

export interface RootEkMapResponse {
  results: ResultEkMapResponse[];
  status: string;
}

export interface ResultEkMapResponse {
  address_components: AddressEkMapComponent[];
  formatted_address: string;
  geometry: GeometryEkResponse;
}

export interface AddressEkMapComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeometryEkResponse {
  location: LocationEkResponse;
  location_type: string;
  viewport: Viewport;
}

export interface LocationEkResponse {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export type ReportOrderItemType = {
  id: string | number;
  label: string;
  date: string;
  time: string;
  price: number;
};

export type ReportProductOrderType = {
  id: string | number;
  label: string;
  count: number;
  unit: string;
  price: number;
  discount_percent: number | null;
  discount_VND: number | null;
  total: number;
};

export type ReportProductInventoryType = {
  productName: string;
  count: number;
  unit: string;
};

export type ReportInventoryType = {
  dateTime: number | string;
  listProduct: ReportProductInventoryType[];
};

export type ReportDebtListType = {
  dateTime: string | number;
  description: string;
  numberDebt: number;
};

export type ReportDebtType = {
  total: number;
  listDebt: ReportDebtListType[];
};
export type IDataCustomer = {
  nameCompany: string;
  guestCode?:string;
  type: string;
  group: string;
  area?: string;
  dob: string | any;
  gland?: string;
  debtLimit?: number | any;
  description: string;
  websiteURL: string;
  address: {
    address: string;
    isSetAddressGet: boolean;
    isSetAddressTake: boolean;
  };
  contact: {
    name: string;
    address: string;
    phoneNumber: string;
  };
  imageSource: string;
};

export interface RootEkMapResponse {
  results: ResultEkMapResponse[];
  status: string;
}

export interface ResultEkMapResponse {
  address_components: AddressEkMapComponent[];
  formatted_address: string;
  geometry: GeometryEkResponse;
}

export interface AddressEkMapComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeometryEkResponse {
  location: LocationEkResponse;
  location_type: string;
  viewport: Viewport;
}

export interface LocationEkResponse {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

interface Address {
  address: string;
  isSetAddressGet: boolean;
  isSetAddressTake: boolean;
}

interface Contact {
  address: string;
  name: string;
  phoneNumber: string;
}

export interface IDataItem {
  address: Address;
  area: string;
  customerCode?:string;
  contact: Contact;
  debtLimit: number | string; // Assuming it can be a number or a string
  description: string;
  dob: string;
  gland: string;
  group: string;
  nameCompany: string;
  type: string;
  websiteURL: string;
  imageSource: any;

}

export type IAlbumImage = {
  id: number | string;
  label: string;
  image: string[];
};

export type IStaff = {
  id: string | number;
  name: string;
  position: string;
  isSelected: boolean;
};

type UinitProduct = {
  uom : string;
  price_list_rate : number;
  valid_from : string;
  currency : string
}

type DataUnit = {
  uom : string;
  conversion_factor : string;
}

export type IProduct = {
  name : string;
  item_code : string;
  item_name : string;
  item_group : string;
  stock_uom : string;
  min_order_qty : number;
  description : string;
  brand : string;
  country_of_origin : string;
  image : string;
  custom_industry : string;
  detail : UinitProduct;
  unit : DataUnit[]
}