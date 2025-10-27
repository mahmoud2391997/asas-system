import { FinancialAccount } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const financialAccountsSlice = createGenericSlice<FinancialAccount>('financialAccounts', 'financialaccounts');

export const { fetchAll: fetchFinancialAccounts, addNew: addFinancialAccount, updateOne: updateFinancialAccount, deleteOne: deleteFinancialAccount } = financialAccountsSlice.actions;
export const financialAccountsSelectors = financialAccountsSlice.selectors;
export default financialAccountsSlice.reducer;