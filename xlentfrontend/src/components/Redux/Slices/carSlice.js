import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  cars: [],
  loading: false,
  error: null,
};

// Create slice
const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set cars from API/fetch
    setCars: (state, action) => {
      state.cars = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new car
    addCar: (state, action) => {
      state.cars = [action.payload, ...state.cars];
      state.loading = false;
      state.error = null;
    },

    // Remove a car
    removeCar: (state, action) => {
      state.cars = state.cars.filter(car => car.id !== action.payload);
      state.loading = false;
      state.error = null;
    },

    // Update a car
    updateCar: (state, action) => {
      const { id, data } = action.payload;
      state.cars = state.cars.map(car =>
        car.id === id ? { ...car, ...data } : car
      );
      state.loading = false;
      state.error = null;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Reset state
    resetCars: () => initialState,
  },
});

// Export actions
export const {
  setLoading,
  setCars,
  addCar,
  removeCar,
  updateCar,
  setError,
  resetCars,
} = carSlice.actions;

// Export reducer
export default carSlice.reducer;
