import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeMenu: "Pharmacy",
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
  },
});

export const { setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;
