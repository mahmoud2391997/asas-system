import { Branch } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const branchesSlice = createGenericSlice<Branch>('branches', 'branches');

export const { fetchAll: fetchBranches, addNew: addBranch, updateOne: updateBranch, deleteOne: deleteBranch } = branchesSlice.actions;
export const branchesSelectors = branchesSlice.selectors;
export default branchesSlice.reducer;