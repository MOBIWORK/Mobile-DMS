
import * as Saga from './saga'
import { customerActions } from '../../redux-store/customer-reducer/reducer'
import { takeLatest } from 'typed-redux-saga';


export function* customerSaga(){
    yield* takeLatest(customerActions.onGetCustomer.type.toString(), Saga.onGetCustomer)
    yield* takeLatest(customerActions.getCustomerType.type.toString(),Saga.onGetCustomerType);
    yield* takeLatest(customerActions.onGetCustomerVisit.type.toString(),Saga.getCustomerVisitSaga)    
    yield* takeLatest(customerActions.addingCustomer.type.toString(),Saga.addingNewCustomer)
}
