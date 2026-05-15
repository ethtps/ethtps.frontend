import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "../config";

export interface NetworkResponse {
  chainId: number;
  name: string;
  rpcUrls: string[];
  enabled: boolean;
}

interface NetworksState {
  networks: NetworkResponse[];
  status: "idle" | "loading" | "error";
}

const initialState: NetworksState = {
  networks: [],
  status: "idle",
};

export const fetchNetworks = createAsyncThunk("networks/fetch", async () => {
  const res = await fetch(`${config.apiBaseUrl}/api/v1/networks`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as NetworkResponse[];
});

const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.networks = action.payload;
        state.status = "idle";
      })
      .addCase(fetchNetworks.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default networksSlice.reducer;
