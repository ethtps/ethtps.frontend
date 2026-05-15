import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "../config";

export interface LiveMetricsResponse {
  chainId: number;
  tps: number | null;
  gps: number | null;
  blockNumber: number;
  timestamp: string;
}

export interface GlobalMetricsResponse {
  totalTps: number;
  totalGps: number;
  activeChains: number;
  computedAt: string;
}

export interface MetricsUpdate {
  chainId: number;
  tps: number | null;
  gps: number | null;
  blockNumber: number;
  timestamp: string;
}

export interface MetricsSnapshot {
  timestamp: number;
  totalTps: number;
  totalGps: number;
  // keyed by string chainId (JS object keys are always strings)
  chains: Record<string, { tps: number | null; gps: number | null }>;
}

const HISTORY_MS = 60_000;

interface MetricsState {
  live: Record<number, LiveMetricsResponse>;
  global: GlobalMetricsResponse | null;
  globalStatus: "idle" | "loading" | "error";
  history: MetricsSnapshot[];
}

const initialState: MetricsState = {
  live: {},
  global: null,
  globalStatus: "idle",
  history: [],
};

export const fetchGlobalMetrics = createAsyncThunk("metrics/fetchGlobal", async () => {
  const res = await fetch(`${config.apiBaseUrl}/api/v1/metrics/global/live`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as GlobalMetricsResponse;
});

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    applyUpdate(state, action: PayloadAction<MetricsUpdate>) {
      const u = action.payload;
      state.live[u.chainId] = {
        chainId: u.chainId,
        tps: u.tps,
        gps: u.gps,
        blockNumber: u.blockNumber,
        timestamp: u.timestamp,
      };
    },
    applyBatchUpdate(state, action: PayloadAction<MetricsUpdate[]>) {
      for (const u of action.payload) {
        state.live[u.chainId] = {
          chainId: u.chainId,
          tps: u.tps,
          gps: u.gps,
          blockNumber: u.blockNumber,
          timestamp: u.timestamp,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalMetrics.pending, (state) => {
        state.globalStatus = "loading";
      })
      .addCase(fetchGlobalMetrics.fulfilled, (state, action) => {
        state.global = action.payload;
        state.globalStatus = "idle";

        const now = Date.now();
        const chains: MetricsSnapshot["chains"] = {};
        for (const [id, m] of Object.entries(state.live)) {
          chains[id] = { tps: m.tps, gps: m.gps };
        }
        state.history.push({
          timestamp: now,
          totalTps: action.payload.totalTps,
          totalGps: action.payload.totalGps,
          chains,
        });
        const cutoff = now - HISTORY_MS;
        state.history = state.history.filter((s) => s.timestamp >= cutoff);
      })
      .addCase(fetchGlobalMetrics.rejected, (state) => {
        state.globalStatus = "error";
      });
  },
});

export const { applyUpdate, applyBatchUpdate } = metricsSlice.actions;
export default metricsSlice.reducer;
