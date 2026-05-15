import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import metricsReducer from "./metricsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    networks: networksReducer,
    metrics: metricsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
