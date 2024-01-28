import { createApi } from "../api"
import { ApiConstant } from "../const"

export interface checkinItemProduct {
    item_code: string
    item_unit: string
    quantity?: number
    exp_time: number
}

export type POST_DATA = {
    customer_code: string
    customer_id: string
    customer_name: string
    customer_address: string
    inventory_items : checkinItemProduct[]
}


export const checkinInventory = (data: POST_DATA) => createApi().post(ApiConstant.POST_CHECKIN_INVENTORY, data)