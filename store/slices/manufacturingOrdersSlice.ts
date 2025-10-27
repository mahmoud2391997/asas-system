import { ManufacturingOrder } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const manufacturingOrdersSlice = createGenericSlice<ManufacturingOrder>('manufacturingOrders', 'manufacturing_orders');

export const { fetchAll: fetchManufacturingOrders, addNew: addManufacturingOrder, updateOne: updateManufacturingOrder, deleteOne: deleteManufacturingOrder } = manufacturingOrdersSlice.actions;
export const manufacturingOrdersSelectors = manufacturingOrdersSlice.selectors;
export default manufacturingOrdersSlice.reducer;