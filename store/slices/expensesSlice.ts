import { Expense } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const expensesSlice = createGenericSlice<Expense>('expenses', 'expenses');

export const { fetchAll: fetchExpenses, addNew: addExpense, updateOne: updateExpense, deleteOne: deleteExpense } = expensesSlice.actions;
export const expensesSelectors = expensesSlice.selectors;
export default expensesSlice.reducer;