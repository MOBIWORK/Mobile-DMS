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
