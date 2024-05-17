import {PayloadAction, createAction, createSlice} from '@reduxjs/toolkit';
import {DataType, StateType} from './type';
import * as Actions from './type';
import {PramsTypeProduct} from '../../services/productService';
import {IProduct, KeyAbleProps} from '../../models/types';

const SLICE_NAME = 'PRODUCT_SLICE';

const initState: StateType = {
  data: [],
  totalItem: 0,
  dataSelected: [],
  isLoading: true,
  message: '',
  listProductSelect: [],
};

// function mergeArraysSelectProduct(arr1: IProduct[], arr2: IProduct[]) {
//   const productMap: any = {};
//   arr1 = arr1.filter(product => product?.quantity! > 0);
//   arr2 = arr2.filter(product => product?.quantity! > 0);
//   arr1.forEach(product => {
//     if (product.item_code in productMap) {
//       productMap[product.item_code].quantity += product.quantity;
//     } else {
//       productMap[product.item_code] = {...product};
//     }
//   });
//   arr2.forEach(product => {
//     if (product.item_code in productMap) {
//       productMap[product.item_code].quantity += product.quantity;
//     } else {
//       productMap[product.item_code] = {...product};
//     }
//   });
//
//   return Object.values(productMap);
// }

const productSlice = createSlice({
  name: SLICE_NAME,
  initialState: initState,
  reducers: {
    setDataProduct: (state, action: PayloadAction<DataType>) => {
      state.totalItem = action.payload.total;
      state.data = action.payload.data.map(item => {
        let priceUom = item.details.find(
          itemDetails => itemDetails.uom === item.stock_uom,
        );
        let neItem = {
          ...item,
          price: priceUom ? priceUom.price_list_rate : 0,
          price_default: priceUom ? priceUom.price_list_rate : 0,
        };
        return item.min_order_qty === 0
          ? {...neItem, quantity: 1}
          : {...neItem, quantity: item.min_order_qty};
      });
    },
    resetDataProduct: (state, action: PayloadAction) => {
      state.data = [];
    },
    setProductSelected: (state, action: PayloadAction<IProduct[]>) => {
      const newData = state.dataSelected.concat(action.payload); //push item sản phẩm vào sau cùng, tách ra
      state.dataSelected = newData as any;
    },
    updateProductSelect: (state, action: PayloadAction<IProduct[]>) => {
      state.dataSelected = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.isLoading = action.payload;
    },
    setLogoutData: (state: any) => void (state = undefined),
    setListProductSelect: (state, action: PayloadAction<any>) => {
      state.listProductSelect = [...state.listProductSelect, action.payload];
    },
  },
});

const onGetData = createAction(
  Actions.GET_PRODUCTS,
  (params?: PramsTypeProduct) => ({payload: params}),
);

export const productActions = {
  ...productSlice.actions,
  onGetData,
};

export const productReducer = productSlice.reducer;
