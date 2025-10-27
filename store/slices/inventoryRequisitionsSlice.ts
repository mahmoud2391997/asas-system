import { InventoryRequisition } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const inventoryRequisitionsSlice = createGenericSlice<InventoryRequisition>('inventoryRequisitions', 'inventoryrequisitions');

export const { fetchAll: fetchInventoryRequisitions, addNew: addInventoryRequisition, updateOne: updateInventoryRequisition, deleteOne: deleteInventoryRequisition } = inventoryRequisitionsSlice.actions;
export const inventoryRequisitionsSelectors = inventoryRequisitionsSlice.selectors;
export default inventoryRequisitionsSlice.reducer;