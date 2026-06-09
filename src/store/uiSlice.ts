import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  metric: "tps" | "gps";
  colorScheme: "light" | "dark";
  includeTestnets: boolean;
  includeSidechains: boolean;
  excludeLowThroughputChains: boolean;
  smoothGraph: boolean;
}

const savedMetric = (localStorage.getItem("ui_metric") as "tps" | "gps") ?? "tps";
const savedScheme = (localStorage.getItem("ui_colorScheme") as "light" | "dark") ?? "dark";

const initialState: UiState = {
  metric: savedMetric,
  colorScheme: savedScheme,
  includeTestnets: localStorage.getItem("ui_includeTestnets") === "true",
  includeSidechains: localStorage.getItem("ui_includeSidechains") === "true",
  excludeLowThroughputChains: localStorage.getItem("ui_excludeLowThroughputChains") !== "false",
  smoothGraph: localStorage.getItem("ui_smoothGraph") === "true",
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
    setExcludeLowThroughputChains(state, action: PayloadAction<boolean>) {
      state.excludeLowThroughputChains = action.payload;
      localStorage.setItem("ui_excludeLowThroughputChains", String(action.payload));
    },
    setSmoothGraph(state, action: PayloadAction<boolean>) {
      state.smoothGraph = action.payload;
      localStorage.setItem("ui_smoothGraph", String(action.payload));
    },
  },
});

export const { setMetric, setColorScheme, setIncludeTestnets, setIncludeSidechains, setExcludeLowThroughputChains, setSmoothGraph } = uiSlice.actions;
export default uiSlice.reducer;
