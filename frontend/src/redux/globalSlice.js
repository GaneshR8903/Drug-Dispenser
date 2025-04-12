import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  backendUrl: "http://localhost:5000", // Set your backend URL globally
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
});

export default globalSlice.reducer;
