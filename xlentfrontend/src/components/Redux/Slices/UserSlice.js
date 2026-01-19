import { createSlice } from '@reduxjs/toolkit';

// 1. Define initial state
const initialState = {
  key1: defaultValue1,
  key2: defaultValue2,
  // ... more initial values
};

// 2. Create slice
const sliceNameSlice = createSlice({
  // Required properties:
  name: 'sliceName', // unique name for the slice
  initialState,      // initial state
  reducers: {        // reducer functions
    
    // 3. Define reducers (synchronous actions)
    actionName1: (state) => {
      // You can directly mutate state (Immer handles immutability)
      state.key1 = newValue;
    },
    
    actionName2: (state, action) => {
      // Access payload: action.payload
      state.key2 = action.payload;
    },
    
    actionName3: (state, action) => {
      // More complex update
      const { id, data } = action.payload;
      state.items = state.items.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
    },
    
    resetState: () => initialState,
  },
  
  // Optional: For async actions (using createAsyncThunk)
  extraReducers: (builder) => {
    builder
      .addCase(asyncAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(asyncAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// 4. Export actions
export const { actionName1, actionName2, actionName3, resetState } = sliceNameSlice.actions;

// 5. Export reducer
export default sliceNameSlice.reducer;