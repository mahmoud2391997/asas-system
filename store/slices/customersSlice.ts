import { Customer } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const customersSlice = createGenericSlice<Customer>('customers', 'customers');

export const { fetchAll: fetchCustomers, addNew: addCustomer, updateOne: updateCustomer, deleteOne: deleteCustomer } = customersSlice.actions;
export const customersSelectors = customersSlice.selectors;
export default customersSlice.reducer;