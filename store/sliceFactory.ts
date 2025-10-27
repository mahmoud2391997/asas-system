import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, transformResponse } from './api';

export interface EntityState<T> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export function createGenericSlice<T extends { id: any }>(
  sliceName: string,
  endpoint: string,
  transform?: (item: any) => T
) {
  const transformer = transform || ((item: any) => transformResponse(item) as T);
  const adapter = createEntityAdapter<T>({
    selectId: (entity) => entity.id,
  });

  // Thunks
  const fetchAll = createAsyncThunk<T[], void>(
    `${sliceName}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        const data = await apiClient.get(endpoint);
        return data.map(transformer);
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  const addNew = createAsyncThunk<T, Partial<T>>(
    `${sliceName}/addNew`,
    async (newItem, { rejectWithValue }) => {
      try {
        const { id, ...itemToSend } = newItem as any;
        const data = await apiClient.post(endpoint, itemToSend);
        return transformer(data);
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  const updateOne = createAsyncThunk<T, T>(
    `${sliceName}/updateOne`,
    async (itemToUpdate, { rejectWithValue }) => {
      try {
        const { id, ...itemToSend } = itemToUpdate as any;
        const data = await apiClient.put(endpoint, id, itemToSend);
        return transformer(data);
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  const deleteOne = createAsyncThunk<string, string>(
    `${sliceName}/deleteOne`,
    async (id, { rejectWithValue }) => {
      try {
        return await apiClient.delete(endpoint, id);
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  // Slice
  const slice = createSlice({
    name: sliceName,
    initialState: adapter.getInitialState<EntityState<T>>({
      status: 'idle',
      error: null,
    }),
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch All
        .addCase(fetchAll.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.status = 'succeeded';
          adapter.setAll(state, action.payload);
        })
        .addCase(fetchAll.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string || null;
        })
        // Add New
        .addCase(addNew.fulfilled, adapter.addOne)
        // Update One
        .addCase(updateOne.fulfilled, (state, action) => {
          adapter.upsertOne(state, action.payload);
        })
        // Delete One
        .addCase(deleteOne.fulfilled, adapter.removeOne);
    },
  });

  return {
    reducer: slice.reducer,
    actions: {
      fetchAll,
      addNew,
      updateOne,
      deleteOne,
    },
    selectors: adapter.getSelectors(),
  };
}
