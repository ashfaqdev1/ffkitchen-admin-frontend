import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/productsSlice";
import ordersReducer from "../features/ordersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
});
