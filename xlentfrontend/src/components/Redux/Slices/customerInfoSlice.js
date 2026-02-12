import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customer_name: "",
  phone_number: "",
  email: "",
  location: "",
  startDate: "",
  endDate: "",
  loading: false,
};

const customerInfoSlice = createSlice({
  name: "customerInfo",
  initialState,
  reducers: {
    setCustomerInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetCustomerInfo: () => initialState,
  },
});

export const { setCustomerInfo, resetCustomerInfo } = customerInfoSlice.actions;
export default customerInfoSlice.reducer;
