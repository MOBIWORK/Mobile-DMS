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

export type VisitListItemType = {
  label: string;
  status: boolean;
  address: string | null;
  phone_number: string | null;
  lat: number;
  long: number;
  distance: number;
};
export type IDataCustomer = {
  nameCompany:string,
  type:string,
  group:string,
  area?:string,
  dob:string,
  gland?:string,
  debtLimit?:number | any,
  description:string,
  websiteURL:string,
  address:{
    address:string,
    phoneNumber:string
  },
  contact:{
    name:string,
    address:string,
    phoneNumber:string
  }


}

export type IDataCustomer = {
  nameCompany:string,
  type:string,
  group:string,
  area?:string,
  dob:string,
  gland?:string,
  debtLimit?:number | any,
  description:string,
  websiteURL:string,
  address:{
    address:string,
    phoneNumber:string
  },
  contact:{
    name:string,
    address:string,
    phoneNumber:string
  }


}