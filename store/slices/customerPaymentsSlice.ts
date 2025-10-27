import { CustomerPayment } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const customerPaymentsSlice = createGenericSlice<CustomerPayment>('customerPayments', 'customerpayments');

export const { fetchAll: fetchCustomerPayments, addNew: addCustomerPayment, updateOne: updateCustomerPayment, deleteOne: deleteCustomerPayment } = customerPaymentsSlice.actions;
export const customerPaymentsSelectors = customerPaymentsSlice.selectors;
export default customerPaymentsSlice.reducer;