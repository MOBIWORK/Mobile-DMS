import { takeLatest } from "typed-redux-saga";
import * as Saga from "./saga";
import { productActions } from "../../redux-store/product-reducer/reducer";

export function* productSaga(){
    yield takeLatest(productActions.onGetData.type , Saga.getDataProducts)
}