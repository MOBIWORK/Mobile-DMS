import {PayloadAction} from '@reduxjs/toolkit';
import {productActions} from '../../redux-store/product-reducer/reducer';
import {call, put} from 'typed-redux-saga';
import {ProductService} from '../../services';
import {ApiConstant} from '../../const';

export function* getDataProducts(action: PayloadAction) {
  console.log('run data product saga')
  if (productActions.onGetData.match(action)) {
    try {
      yield put(productActions.setLoading(true));
      // console.log('13333', action.payload);
      const {status, data} = yield call(ProductService.get, action.payload);
      if (status === ApiConstant.STT_OK) {
        // console.log(data.result, 'data product');
        yield put(
          productActions.setDataProduct({
            data: data.result.data,
            total: data.result.total,
          }),
        );
      }
    } catch (error) {
      yield put(productActions.setLoading(false));
      yield put(
        productActions.setMessage('Lỗi không lấy được dữ liệu sản phảm'),
      );
    }
  }
}
