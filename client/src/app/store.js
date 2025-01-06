import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const appStore = configureStore({
  reducer: rootReducer
});
