export type ListCampaignScore = {
    name: string
  creation: string
  modified: string
  modified_by: string
  owner: string
  docstatus: number
  idx: number
  campaign_name: string
  campaign_description: any
  start_date: string
  end_date: string
  campaign_status: string
  products: any
  employees: string
  retails: string
  _user_tags: any
  _comments: any
  _assign: any
  _liked_by: any
  categories: string
  setting_score_audit: any
}
export type ParamsList ={
    checkin_dochinhxac: number
    checkin_donhang: string
    checkin_giora: string
    checkin_giovao: string
    checkin_hinhanh: any[]
    checkin_id: string
    checkin_khoangcach: number
    checkin_lat: number
    checkin_long: number
    checkin_pinra: number
    checkin_pinvao: number
    checkin_timegps: string
    checkin_trangthaicuahang: boolean
    checkinvalidate_khoangcachcheckin: number
    checkinvalidate_khoangcachcheckout: number
    checkout_khoangcach: number
    createByName: string
    createdByEmail: string
    createdDate: number
    item: ItemParams
    kh_diachi: string
    kh_lat: number
    kh_long: number
    kh_ma: string
    kh_ten: string
}
export interface ItemParams {
    birthday: any
    customer_code: string
    customer_location_primary: string
    customer_name: string
    customer_primary_address: string
    is_checkin: boolean
    mobile_no: string
    name: string
  }