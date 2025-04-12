import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPharmacyMenu: "Medicine Dispense", // Default selection
  selectedEnquiry: null, // New state for storing selected enquiry
};

const pharmacyMenuSlice = createSlice({
  name: "pharmacyMenu",
  initialState,
  reducers: {
    setSelectedPharmacyMenu: (state, action) => {
      state.selectedPharmacyMenu = action.payload;
    },
    setSelectedEnquiry: (state, action) => { 
      state.selectedEnquiry = action.payload;
    },
  },
});

export const { setSelectedPharmacyMenu, setSelectedEnquiry  } = pharmacyMenuSlice.actions;
export default pharmacyMenuSlice.reducer;
