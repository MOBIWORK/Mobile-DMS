
import { takeLatest } from 'typed-redux-saga'
import * as Saga from './saga'
import { customerActions } from '../../redux-store/customer-reducer/reducer'

export function* customerSaga(){
    yield takeLatest(customerActions.onGetCustomer.type, Saga.onGetCustomer)
    yield takeLatest(customerActions.getCustomerType.type,Saga.onGetCustomerType);
    yield takeLatest(customerActions.onGetCustomerVisit.type,Saga.getCustomerVisitSaga)    
}