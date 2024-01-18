import { PayloadAction } from "@reduxjs/toolkit";
import { productActions } from "../../redux-store/product-reducer/reducer";
import { call, put } from "typed-redux-saga";
import { ProductService } from "../../services";
import { ApiConstant } from "../../const";


export function* getDataProducts(action:PayloadAction){
    if (productActions.onGetData.match(action)) {
        try {
            const {status , data} = yield call(ProductService.get,action.payload);
            if(status === ApiConstant.STT_OK){
                yield put(productActions.setDataProduct({
                    data : data.result.data,
                    total : data.result.total
                }))
            }
        } catch (error) {
            yield put(productActions.setMessage("Lỗi không lấy được dữ liệu sản phảm"))
        } finally {
            yield put(productActions.setLoading())
        }
    }
}