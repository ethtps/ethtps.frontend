import { createSlice, PayloadAction } from "@reduxjs/toolkit";

function load(): number[] {
  try {
    return JSON.parse(localStorage.getItem("watchlist") ?? "[]");
  } catch {
    return [];
  }
}

interface WatchlistState {
  chainIds: number[];
}

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: { chainIds: load() } as WatchlistState,
  reducers: {
    toggleWatchlist(state, action: PayloadAction<number>) {
      const id = action.payload;
      const idx = state.chainIds.indexOf(id);
      if (idx === -1) {
        state.chainIds.push(id);
      } else {
        state.chainIds.splice(idx, 1);
      }
      localStorage.setItem("watchlist", JSON.stringify(state.chainIds));
    },
  },
});

export const { toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
