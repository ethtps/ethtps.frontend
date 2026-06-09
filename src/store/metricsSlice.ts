import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiV1MetricsGlobalHistory, getApiV1MetricsGlobalLive } from "../api/generated/services.gen";

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

interface GlobalHistoryBucket {
  bucket: string;
  chainId: number;
  avgTps: number;
  avgGps: number;
}

interface GlobalHistoryResponse {
  chainId: number;
  resolution: string;
  from: string;
  to: string;
  buckets: GlobalHistoryBucket[];
}

const HISTORY_MS = 60_000;

interface MetricsState {
  live: Record<number, LiveMetricsResponse>;
  global: GlobalMetricsResponse | null;
  globalStatus: "idle" | "loading" | "error";
  wsConnected: boolean;
  history: MetricsSnapshot[];
  preloadedSnapshots: MetricsSnapshot[];
}

const initialState: MetricsState = {
  live: {},
  global: null,
  globalStatus: "idle",
  wsConnected: false,
  history: [],
  preloadedSnapshots: [],
};

export const fetchGlobalMetrics = createAsyncThunk(
  "metrics/fetchGlobal",
  async (params: { includeTestnets: boolean; includeSidechains: boolean }) => {
    const result = await getApiV1MetricsGlobalLive(params);
    return result as GlobalMetricsResponse;
  },
);

export const fetchHistoryPreload = createAsyncThunk(
  "metrics/fetchHistoryPreload",
  async (lookbackMs: number) => {
    const resolution = lookbackMs < 300_000 ? "1s" : "1m";
    const now = new Date();
    const from = new Date(now.getTime() - lookbackMs).toISOString();
    const to = now.toISOString();

    const result = await getApiV1MetricsGlobalHistory({ from, to, resolution });
    const hist = result as GlobalHistoryResponse;
    if (!hist?.buckets) return [];

    // Group per-chain bucket entries by timestamp into unified snapshots
    const byTime = new Map<number, MetricsSnapshot>();
    for (const b of hist.buckets) {
      const ts = new Date(b.bucket).getTime();
      let snap = byTime.get(ts);
      if (!snap) {
        snap = { timestamp: ts, totalTps: 0, totalGps: 0, chains: {} };
        byTime.set(ts, snap);
      }
      snap.chains[String(b.chainId)] = { tps: b.avgTps, gps: b.avgGps };
      snap.totalTps += b.avgTps;
      snap.totalGps += b.avgGps;
    }
    return Array.from(byTime.values()).sort((a, b) => a.timestamp - b.timestamp);
  },
);

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
      // Derive global totals from live websocket data
      let totalTps = 0;
      let totalGps = 0;
      let activeChains = 0;
      for (const m of Object.values(state.live)) {
        if (m.tps != null) { totalTps += m.tps; activeChains++; }
        if (m.gps != null) totalGps += m.gps;
      }
      state.global = { totalTps, totalGps, activeChains, computedAt: new Date().toISOString() };
    },
    setWsConnected(state, action: PayloadAction<boolean>) {
      state.wsConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalMetrics.pending, (state) => {
        state.globalStatus = "loading";
      })
      .addCase(fetchGlobalMetrics.fulfilled, (state, action) => {
        state.globalStatus = "idle";
        if (state.wsConnected) return;
        state.global = action.payload;

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
      })
      .addCase(fetchHistoryPreload.fulfilled, (state, action) => {
        state.preloadedSnapshots = action.payload;
      });
  },
});

export const { applyUpdate, applyBatchUpdate, setWsConnected } = metricsSlice.actions;
export default metricsSlice.reducer;
