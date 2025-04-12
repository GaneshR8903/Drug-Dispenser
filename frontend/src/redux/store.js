import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import menuReducer from "./menuSlice";
import pharmacyMenuReducer from "./pharmacyMenuSlice";

const store = configureStore({
  reducer: {
    global: globalReducer,
    menu: menuReducer,
    pharmacyMenu: pharmacyMenuReducer,
  },
});

export default store; 
