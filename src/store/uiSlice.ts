import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  metric: "tps" | "gps";
  colorScheme: "light" | "dark";
}

const savedMetric = (localStorage.getItem("ui_metric") as "tps" | "gps") ?? "tps";
const savedScheme = (localStorage.getItem("ui_colorScheme") as "light" | "dark") ?? "dark";

const initialState: UiState = {
  metric: savedMetric,
  colorScheme: savedScheme,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMetric(state, action: PayloadAction<"tps" | "gps">) {
      state.metric = action.payload;
      localStorage.setItem("ui_metric", action.payload);
    },
    setColorScheme(state, action: PayloadAction<"light" | "dark">) {
      state.colorScheme = action.payload;
      localStorage.setItem("ui_colorScheme", action.payload);
    },
  },
});

export const { setMetric, setColorScheme } = uiSlice.actions;
export default uiSlice.reducer;
