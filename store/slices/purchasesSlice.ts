import { PurchaseInvoice } from '../../types';
import { createGenericSlice } from '../sliceFactory';

// Endpoint follows existing pattern in App: 'purchaseinvoices'
const purchasesSlice = createGenericSlice<PurchaseInvoice>('purchases', 'purchaseinvoices');

export const { fetchAll: fetchPurchases, addNew: addPurchaseInvoice, updateOne: updatePurchaseInvoice, deleteOne: deletePurchaseInvoice } = purchasesSlice.actions;
export const purchasesSelectors = purchasesSlice.selectors;
export default purchasesSlice.reducer;