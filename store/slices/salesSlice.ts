import { Sale } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const salesSlice = createGenericSlice<Sale>('sales', 'sales');

export const { fetchAll: fetchSales, addNew: addSale, updateOne: updateSale, deleteOne: deleteSale } = salesSlice.actions;
export const salesSelectors = salesSlice.selectors;
export default salesSlice.reducer;
