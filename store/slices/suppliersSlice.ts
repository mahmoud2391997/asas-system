import { Supplier } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const suppliersSlice = createGenericSlice<Supplier>('suppliers', 'suppliers');

export const { fetchAll: fetchSuppliers, addNew: addSupplier, updateOne: updateSupplier, deleteOne: deleteSupplier } = suppliersSlice.actions;
export const suppliersSelectors = suppliersSlice.selectors;
export default suppliersSlice.reducer;