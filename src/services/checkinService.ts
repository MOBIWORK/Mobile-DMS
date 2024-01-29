import { createApi } from '../api';
import { ApiConstant } from '../const';

export type IUpdateAddress = {
    customer: string;
    long: number;
    lat: number;
    address_line1: string;
    state: string;
    county: string;
    city: string;
    country: 'Việt Nam';
};


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
    inventory_items: checkinItemProduct[]
}


export const checkinInventory = (data: POST_DATA) => createApi().post(ApiConstant.POST_CHECKIN_INVENTORY, data);
export const updateCustomerAddress = (data: IUpdateAddress) =>
    createApi().patch(ApiConstant.UPDATE_CUSTOMER_ADDRESS, data);
