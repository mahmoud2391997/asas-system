import { EmployeeData } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const employeesSlice = createGenericSlice<EmployeeData>('employees', 'employees');

export const { fetchAll: fetchEmployees, addNew: addEmployee, updateOne: updateEmployee, deleteOne: deleteEmployee } = employeesSlice.actions;
export const employeesSelectors = employeesSlice.selectors;
export default employeesSlice.reducer;