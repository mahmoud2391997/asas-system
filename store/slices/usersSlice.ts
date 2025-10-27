import { User } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const usersSlice = createGenericSlice<User>('users', 'users');

export const { fetchAll: fetchUsers, addNew: addUser, updateOne: updateUser, deleteOne: deleteUser } = usersSlice.actions;
export const usersSelectors = usersSlice.selectors;
export default usersSlice.reducer;