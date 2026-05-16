import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  metric: "tps" | "gps";
  colorScheme: "light" | "dark";
  includeTestnets: boolean;
  includeSidechains: boolean;
}

const savedMetric = (localStorage.getItem("ui_metric") as "tps" | "gps") ?? "tps";
const savedScheme = (localStorage.getItem("ui_colorScheme") as "light" | "dark") ?? "dark";

const initialState: UiState = {
  metric: savedMetric,
  colorScheme: savedScheme,
  includeTestnets: localStorage.getItem("ui_includeTestnets") === "true",
  includeSidechains: localStorage.getItem("ui_includeSidechains") === "true",
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
    setIncludeTestnets(state, action: PayloadAction<boolean>) {
      state.includeTestnets = action.payload;
      localStorage.setItem("ui_includeTestnets", String(action.payload));
    },
    setIncludeSidechains(state, action: PayloadAction<boolean>) {
      state.includeSidechains = action.payload;
      localStorage.setItem("ui_includeSidechains", String(action.payload));
    },
  },
});

export const { setMetric, setColorScheme, setIncludeTestnets, setIncludeSidechains } = uiSlice.actions;
export default uiSlice.reducer;
