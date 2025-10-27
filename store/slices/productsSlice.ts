import { Product } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const productsSlice = createGenericSlice<Product>('products', 'products');

export const { fetchAll: fetchProducts, addNew: addProduct, updateOne: updateProduct, deleteOne: deleteProduct } = productsSlice.actions;
export const productsSelectors = productsSlice.selectors;
export default productsSlice.reducer;
