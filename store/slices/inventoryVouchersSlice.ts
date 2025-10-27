import { InventoryVoucher } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const inventoryVouchersSlice = createGenericSlice<InventoryVoucher>('inventoryVouchers', 'inventoryvouchers');

export const { fetchAll: fetchInventoryVouchers, addNew: addInventoryVoucher, updateOne: updateInventoryVoucher, deleteOne: deleteInventoryVoucher } = inventoryVouchersSlice.actions;
export const inventoryVouchersSelectors = inventoryVouchersSlice.selectors;
export default inventoryVouchersSlice.reducer;