import { InventoryAdjustmentLog } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const stockAdjustmentsSlice = createGenericSlice<InventoryAdjustmentLog>('stockAdjustments', 'stockadjustments');

export const { fetchAll: fetchStockAdjustments, addNew: addStockAdjustment, updateOne: updateStockAdjustment, deleteOne: deleteStockAdjustment } = stockAdjustmentsSlice.actions;
export const stockAdjustmentsSelectors = stockAdjustmentsSlice.selectors;
export default stockAdjustmentsSlice.reducer;