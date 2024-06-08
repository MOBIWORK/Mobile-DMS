import {IProduct} from '../../models/types';

export type StateType = {
  data: IProduct[];
  dataCustomer: IProduct[];
  totalItem: number;
  dataSelected: IProduct[];
  message: string;
  isLoading: boolean;
  productBottomLoading: boolean;
  listProductSelect: any[];
  dataProductDetail: any;
};

export type DataType = {
  data: IProduct[];
  total: number;
};

export const GET_PRODUCTS = 'GET_PRODUCTS';
