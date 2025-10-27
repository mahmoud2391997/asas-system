const API_BASE_URL = 'https://perfume-commerce.vercel.app/api';

export const transformResponse = (item: any) => {
  const { _id, ...rest } = item;
  return { ...rest, id: _id };
};

export const transformInventoryResponse = (item: any) => {
  const { _id, branch, product, ...rest } = item;
  return { ...rest, id: _id, branchId: branch, productId: product };
};

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message || `API error fetching ${endpoint}`);
    console.log(result.data);
    
    return result.data;
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to add ${endpoint}`);
    }
    const result = await response.json();
    if (!result.success) throw new Error(result.message || `API error adding ${endpoint}`);
    return result.data;
  },

  async put(endpoint: string, id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update ${endpoint}`);
    }
    const result = await response.json();
    if (!result.success) throw new Error(result.message || `API error updating ${endpoint}`);
    return result.data;
  },

  async delete(endpoint: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete ${endpoint}`);
    }
    const result = await response.json();
    if (!result.success) throw new Error(result.message || `API error deleting ${endpoint}`);
    return id;
  },
};
