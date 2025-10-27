import { SalesQuotation } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const salesQuotationsSlice = createGenericSlice<SalesQuotation>('salesQuotations', 'salesquotations');

export const { fetchAll: fetchSalesQuotations, addNew: addSalesQuotation, updateOne: updateSalesQuotation, deleteOne: deleteSalesQuotation } = salesQuotationsSlice.actions;
export const salesQuotationsSelectors = salesQuotationsSlice.selectors;
export default salesQuotationsSlice.reducer;