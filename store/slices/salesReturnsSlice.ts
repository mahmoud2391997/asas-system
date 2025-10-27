import { SalesReturn } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const salesReturnsSlice = createGenericSlice<SalesReturn>('salesReturns', 'salesreturns');

export const { fetchAll: fetchSalesReturns, addNew: addSalesReturn, updateOne: updateSalesReturn, deleteOne: deleteSalesReturn } = salesReturnsSlice.actions;
export const salesReturnsSelectors = salesReturnsSlice.selectors;
export default salesReturnsSlice.reducer;