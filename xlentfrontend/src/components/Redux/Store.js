import { configureStore } from '@reduxjs/toolkit';
import carReducer from './Slices/carSlice';
import locationReducer from './Slices/LocationSlice';
import customerInfo from './Slices/customerInfoSlice';

const store = configureStore({
  reducer: {
    cars: carReducer,
    location: locationReducer,
    customerInfo: customerInfo,
  },
});

export default store;
