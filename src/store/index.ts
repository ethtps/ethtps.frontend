import { configureStore } from "@reduxjs/toolkit";
import networksReducer from "./networksSlice";
import metricsReducer from "./metricsSlice";
import uiReducer from "./uiSlice";
import watchlistReducer from "./watchlistSlice";
import alertsReducer from "./alertsSlice";

export const store = configureStore({
  reducer: {
    networks: networksReducer,
    metrics: metricsReducer,
    ui: uiReducer,
    watchlist: watchlistReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
