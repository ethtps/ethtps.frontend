import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TpsAlert {
  id: string;
  chainId: number;
  chainName: string;
  threshold: number;
  persist: boolean;
}

const STORAGE_KEY = "tps_alerts";

function load(): TpsAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.alerts) ? parsed.alerts : [];
  } catch {
    return [];
  }
}

function save(alerts: TpsAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ alerts }));
}

const alertsSlice = createSlice({
  name: "alerts",
  initialState: { alerts: load() },
  reducers: {
    addAlert(state, action: PayloadAction<Omit<TpsAlert, "id">>) {
      state.alerts.push({ ...action.payload, id: `${Date.now()}-${Math.random()}` });
      save(state.alerts);
    },
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
      save(state.alerts);
    },
  },
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
