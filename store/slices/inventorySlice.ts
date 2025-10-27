import { InventoryItem } from '../../types';
import { createGenericSlice } from '../sliceFactory';
import { transformInventoryResponse } from '../api';

const inventorySlice = createGenericSlice<InventoryItem>('inventory', 'inventory', transformInventoryResponse);

export const { fetchAll: fetchInventory, addNew: addInventoryItem, updateOne: updateInventoryItem, deleteOne: deleteInventoryItem } = inventorySlice.actions;
export const inventorySelectors = inventorySlice.selectors;
export default inventorySlice.reducer;
