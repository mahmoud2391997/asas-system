#!/bin/bash

# Array of slice configurations: name|Type|endpoint
slices=(
  "users|User|users"
  "purchases|PurchaseInvoice|purchaseinvoices"
  "employees|EmployeeData|employees"
  "customers|Customer|customers"
  "suppliers|Supplier|suppliers"
  "branches|Branch|branches"
  "expenses|Expense|expenses"
  "financialAccounts|FinancialAccount|financialaccounts"
  "manufacturingOrders|ManufacturingOrder|manufacturing_orders"
  "stockAdjustments|InventoryAdjustmentLog|stockadjustments"
  "salesQuotations|SalesQuotation|salesquotations"
  "salesReturns|SalesReturn|salesreturns"
  "creditNotes|CreditNote|creditnotes"
  "recurringInvoices|RecurringInvoice|recurringinvoices"
  "customerPayments|CustomerPayment|customerpayments"
  "inventoryVouchers|InventoryVoucher|inventoryvouchers"
  "inventoryRequisitions|InventoryRequisition|inventoryrequisitions"
  "communications|WhatsappLog|communications"
  "purchaseOrders|PurchaseOrder|purchaseorders"
)

for config in "${slices[@]}"; do
  IFS='|' read -r name type endpoint <<< "$config"
  filename="${name}Slice.ts"
  
  cat > "$filename" << EOF
import { ${type} } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const ${name}Slice = createGenericSlice<${type}>('${name}', '${endpoint}');

export const { fetchAll: fetch${type^}, addNew: add${type}, updateOne: update${type}, deleteOne: delete${type} } = ${name}Slice.actions;
export const ${name}Selectors = ${name}Slice.selectors;
export default ${name}Slice.reducer;
EOF
done

# Create inventory slice (special case with transform)
cat > inventorySlice.ts << 'EOF'
import { InventoryItem } from '../../types';
import { createGenericSlice } from '../sliceFactory';
import { transformInventoryResponse } from '../api';

const inventorySlice = createGenericSlice<InventoryItem>('inventory', 'inventory', transformInventoryResponse);

export const { fetchAll: fetchInventory, addNew: addInventoryItem, updateOne: updateInventoryItem, deleteOne: deleteInventoryItem } = inventorySlice.actions;
export const inventorySelectors = inventorySlice.selectors;
export default inventorySlice.reducer;
EOF

echo "All slice files created successfully!"
