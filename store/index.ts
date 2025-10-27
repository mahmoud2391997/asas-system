import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import productsReducer from './slices/productsSlice';
import salesReducer from './slices/salesSlice';
import purchasesReducer from './slices/purchasesSlice';
import employeesReducer from './slices/employeesSlice';
import customersReducer from './slices/customersSlice';
import suppliersReducer from './slices/suppliersSlice';
import branchesReducer from './slices/branchesSlice';
import inventoryReducer from './slices/inventorySlice';
import expensesReducer from './slices/expensesSlice';
import financialAccountsReducer from './slices/financialAccountsSlice';
import manufacturingOrdersReducer from './slices/manufacturingOrdersSlice';
import stockAdjustmentsReducer from './slices/stockAdjustmentsSlice';
import salesQuotationsReducer from './slices/salesQuotationsSlice';
import salesReturnsReducer from './slices/salesReturnsSlice';
import creditNotesReducer from './slices/creditNotesSlice';
import recurringInvoicesReducer from './slices/recurringInvoicesSlice';
import customerPaymentsReducer from './slices/customerPaymentsSlice';
import inventoryVouchersReducer from './slices/inventoryVouchersSlice';
import inventoryRequisitionsReducer from './slices/inventoryRequisitionsSlice';
import communicationsReducer from './slices/communicationsSlice';
import purchaseOrdersReducer from './slices/purchaseOrdersSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    sales: salesReducer,
    purchases: purchasesReducer,
    employees: employeesReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    branches: branchesReducer,
    inventory: inventoryReducer,
    expenses: expensesReducer,
    financialAccounts: financialAccountsReducer,
    manufacturingOrders: manufacturingOrdersReducer,
    stockAdjustments: stockAdjustmentsReducer,
    salesQuotations: salesQuotationsReducer,
    salesReturns: salesReturnsReducer,
    creditNotes: creditNotesReducer,
    recurringInvoices: recurringInvoicesReducer,
    customerPayments: customerPaymentsReducer,
    inventoryVouchers: inventoryVouchersReducer,
    inventoryRequisitions: inventoryRequisitionsReducer,
    communications: communicationsReducer,
    purchaseOrders: purchaseOrdersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
