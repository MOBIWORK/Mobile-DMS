
import * as Saga from './saga'
import { customerActions } from '../../redux-store/customer-reducer/reducer'
import { takeLatest } from '../../utils/typed-redux-saga';

export function* customerSaga(){
    yield takeLatest(customerActions.onGetCustomer.type, Saga.onGetCustomer)
    yield takeLatest(customerActions.getCustomerType.type,Saga.onGetCustomerType);
    yield takeLatest(customerActions.onGetCustomerVisit.type,Saga.getCustomerVisitSaga)    
}
