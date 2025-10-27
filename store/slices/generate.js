const fs = require('fs');

const slices = [
  { name: 'users', type: 'User', endpoint: 'users' },
  { name: 'purchases', type: 'PurchaseInvoice', endpoint: 'purchaseinvoices' },
  { name: 'employees', type: 'EmployeeData', endpoint: 'employees' },
  { name: 'customers', type: 'Customer', endpoint: 'customers' },
  { name: 'suppliers', type: 'Supplier', endpoint: 'suppliers' },
  { name: 'branches', type: 'Branch', endpoint: 'branches' },
  { name: 'expenses', type: 'Expense', endpoint: 'expenses' },
  { name: 'financialAccounts', type: 'FinancialAccount', endpoint: 'financialaccounts' },
  { name: 'manufacturingOrders', type: 'ManufacturingOrder', endpoint: 'manufacturing_orders' },
  { name: 'stockAdjustments', type: 'InventoryAdjustmentLog', endpoint: 'stockadjustments' },
  { name: 'salesQuotations', type: 'SalesQuotation', endpoint: 'salesquotations' },
  { name: 'salesReturns', type: 'SalesReturn', endpoint: 'salesreturns' },
  { name: 'creditNotes', type: 'CreditNote', endpoint: 'creditnotes' },
  { name: 'recurringInvoices', type: 'RecurringInvoice', endpoint: 'recurringinvoices' },
  { name: 'customerPayments', type: 'CustomerPayment', endpoint: 'customerpayments' },
  { name: 'inventoryVouchers', type: 'InventoryVoucher', endpoint: 'inventoryvouchers' },
  { name: 'inventoryRequisitions', type: 'InventoryRequisition', endpoint: 'inventoryrequisitions' },
  { name: 'communications', type: 'WhatsappLog', endpoint: 'communications' },
  { name: 'purchaseOrders', type: 'PurchaseOrder', endpoint: 'purchaseorders' },
];

slices.forEach(({ name, type, endpoint }) => {
  const content = `import { ${type} } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const ${name}Slice = createGenericSlice<${type}>('${name}', '${endpoint}');

export const {
  fetchAll: fetch${type.charAt(0).toUpperCase() + type.slice(1)},
  addNew: add${type},
  updateOne: update${type},
  deleteOne: delete${type}
} = ${name}Slice.actions;

export const ${name}Selectors = ${name}Slice.selectors;
export default ${name}Slice.reducer;
`;
  
  fs.writeFileSync(`${name}Slice.ts`, content);
  console.log(`Created ${name}Slice.ts`);
});

console.log('All slices created successfully!');
