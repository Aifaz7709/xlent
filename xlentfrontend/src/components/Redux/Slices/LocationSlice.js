// locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    selectedLocation: null,
    recentLocations: [],
    isLoading: false,
  },
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
      // Save to localStorage for persistence
      if (action.payload) {
        localStorage.setItem('xlent_selected_location', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('xlent_selected_location');
      }
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
      localStorage.removeItem('xlent_selected_location');
    },
    addRecentLocation: (state, action) => {
      const newLocation = action.payload;
      // Remove if already exists
      const filtered = state.recentLocations.filter(
        loc => loc.id !== newLocation.id
      );
      // Add to beginning and keep only last 5
      state.recentLocations = [newLocation, ...filtered].slice(0, 5);
      localStorage.setItem('xlent_recent_locations', JSON.stringify(state.recentLocations));
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    loadSavedLocation: (state) => {
      const savedLocation = localStorage.getItem('xlent_selected_location');
      if (savedLocation) {
        try {
          state.selectedLocation = JSON.parse(savedLocation);
        } catch (error) {
          console.error('Error loading saved location:', error);
        }
      }
    },
  },
});

export const {
  setSelectedLocation,
  clearSelectedLocation,
  addRecentLocation,
  setLoading,
  loadSavedLocation,
} = locationSlice.actions;

export default locationSlice.reducer;