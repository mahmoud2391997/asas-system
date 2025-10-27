import { RecurringInvoice } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const recurringInvoicesSlice = createGenericSlice<RecurringInvoice>('recurringInvoices', 'recurringinvoices');

export const { fetchAll: fetchRecurringInvoices, addNew: addRecurringInvoice, updateOne: updateRecurringInvoice, deleteOne: deleteRecurringInvoice } = recurringInvoicesSlice.actions;
export const recurringInvoicesSelectors = recurringInvoicesSlice.selectors;
export default recurringInvoicesSlice.reducer;