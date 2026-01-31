import { configureStore } from '@reduxjs/toolkit';
import carReducer from './Slices/carSlice';
import locationReducer from './Slices/LocationSlice';

const store = configureStore({
  reducer: {
    cars: carReducer,
    location: locationReducer,
  },
});

export default store;
