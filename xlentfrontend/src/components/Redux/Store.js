import { configureStore } from '@reduxjs/toolkit';
import carReducer from './Slices/carSlice';

const store = configureStore({
  reducer: {
    cars: carReducer,
  },
});

export default store;
