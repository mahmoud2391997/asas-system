import { PurchaseOrder } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const purchaseOrdersSlice = createGenericSlice<PurchaseOrder>('purchaseOrders', 'purchaseorders');

export const { fetchAll: fetchPurchaseOrders, addNew: addPurchaseOrder, updateOne: updatePurchaseOrder, deleteOne: deletePurchaseOrder } = purchaseOrdersSlice.actions;
export const purchaseOrdersSelectors = purchaseOrdersSlice.selectors;
export default purchaseOrdersSlice.reducer;