# ETHTPS Frontend — Implementation Prompt

## Tech stack

- React 19 (with `use`, `useOptimistic`, new compiler)
- TypeScript (strict mode)
- Mantine UI latest (v7+) — use `@mantine/core`, `@mantine/hooks`
- Redux Toolkit — slices + `createAsyncThunk`
- `@microsoft/signalr` for live WebSocket updates
- `@hey-api/openapi-ts` to generate a typed API client from the OpenAPI spec

---

## Environment variables

All runtime configuration comes from a `.env` file at the project root. Use Vite's `import.meta.env` — all variables must be prefixed `VITE_`.

### `.env` (committed, safe defaults for local dev)

```env
VITE_API_BASE_URL=http://localhost:8090
VITE_SIGNALR_HUB_URL=http://localhost:8090/hubs/metrics
VITE_OPENAPI_URL=http://localhost:8090/openapi/v1.json
VITE_GLOBAL_POLL_INTERVAL_MS=5000
VITE_STALE_THRESHOLD_MS=30000
```

### `.env.production` (overrides for prod build)

```env
VITE_API_BASE_URL=https://api.ethtps.info
VITE_SIGNALR_HUB_URL=https://api.ethtps.info/hubs/metrics
VITE_OPENAPI_URL=https://api.ethtps.info/openapi/v1.json
VITE_GLOBAL_POLL_INTERVAL_MS=5000
VITE_STALE_THRESHOLD_MS=30000
```

### Typed config module

Create `src/config.ts` — import this everywhere instead of referencing `import.meta.env` directly:

```ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  signalrHubUrl: import.meta.env.VITE_SIGNALR_HUB_URL as string,
  openApiUrl: import.meta.env.VITE_OPENAPI_URL as string,
  globalPollIntervalMs: Number(import.meta.env.VITE_GLOBAL_POLL_INTERVAL_MS ?? 5000),
  staleThresholdMs: Number(import.meta.env.VITE_STALE_THRESHOLD_MS ?? 30000),
} as const;
```

Add `.env.local` and `.env.production.local` to `.gitignore`. Commit only `.env` and `.env.production`.

---

## API client generation

The backend exposes an OpenAPI document at the URL configured in `VITE_OPENAPI_URL` (default `http://localhost:8090/openapi/v1.json`).

Run the following to generate a typed client into `src/api/generated/`:

```bash
npx @hey-api/openapi-ts \
  --input $VITE_OPENAPI_URL \
  --output src/api/generated \
  --client fetch
```

Or hardcode the local URL for codegen (codegen runs at dev time, not runtime):

```bash
npx @hey-api/openapi-ts \
  --input http://localhost:8090/openapi/v1.json \
  --output src/api/generated \
  --client fetch
```

Re-run this command any time the backend changes. Do not hand-write API types — always derive them from the generated output.

The base URL for all API calls comes from `config.apiBaseUrl`.

---

## REST endpoints used

All routes are under `/api/v1/`.

### Networks

```
GET /api/v1/networks
```
Returns `NetworkResponse[]`:
```ts
interface NetworkResponse {
  chainId: number;
  name: string;
  rpcUrls: string[];
  enabled: boolean;
}
```

### Live metrics (per chain)

```
GET /api/v1/metrics/{chainId}/live
```
Returns `LiveMetricsResponse`:
```ts
interface LiveMetricsResponse {
  chainId: number;
  tps: number | null;
  gps: number | null;
  blockNumber: number;
  timestamp: string; // ISO 8601
}
```

### Global live metrics

```
GET /api/v1/metrics/global/live
```
Returns `GlobalMetricsResponse`:
```ts
interface GlobalMetricsResponse {
  totalTps: number;
  totalGps: number;
  activeChains: number;
  computedAt: string; // ISO 8601
}
```

---

## WebSocket — live updates via SignalR

Install the SignalR client:

```bash
npm install @microsoft/signalr
```

Connect to the hub at `http://localhost:8090/hubs/metrics`. After connecting, call `Subscribe` with an array of chain IDs. The server will push `MetricsUpdate` messages whenever a new block arrives for a subscribed chain.

```ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.signalrHubUrl)
  .withAutomaticReconnect()
  .build();

// Incoming message shape
interface MetricsUpdate {
  chainId: number;
  tps: number | null;
  gps: number | null;
  blockNumber: number;
  timestamp: string;
}

connection.on("MetricsUpdate", (update: MetricsUpdate) => {
  // dispatch to Redux
});

await connection.start();

// Subscribe to specific chains after fetching the network list
await connection.invoke("Subscribe", [1, 137, 42161]);

// Unsubscribe when component unmounts
await connection.invoke("Unsubscribe", [1, 137, 42161]);
```

Subscribe to all chain IDs returned by `GET /api/v1/networks` on startup. Keep the connection alive for the lifetime of the app. Use `withAutomaticReconnect()`.

---

## Redux state shape

Use Redux Toolkit. Define the following slices:

### `networksSlice`
```ts
interface NetworksState {
  networks: NetworkResponse[];       // fetched once on startup
  status: "idle" | "loading" | "error";
}
```
Fetch `GET /api/v1/networks` on app load with `createAsyncThunk`. Cache result — do not re-fetch on every render.

### `metricsSlice`
```ts
interface MetricsState {
  // keyed by chainId — updated by SignalR pushes
  live: Record<number, LiveMetricsResponse>;
  global: GlobalMetricsResponse | null;
  globalStatus: "idle" | "loading" | "error";
}
```
- `global` is polled via `GET /api/v1/metrics/global/live` every `config.globalPollIntervalMs` milliseconds.
- `live[chainId]` is updated in real time by each incoming `MetricsUpdate` from SignalR. Do not poll per-chain REST endpoints — use the WebSocket exclusively for live per-chain data.

### `uiSlice`
```ts
interface UiState {
  metric: "tps" | "gps";    // toggled by the top-bar button
  colorScheme: "light" | "dark";
}
```
Persist `colorScheme` and `metric` to `localStorage`.

---

## Layout

### Top bar (`AppShell.Header`)

Left: **ETHTPS.info** logo — display as styled text (`ETHTPS` in a bold accent color, `.info` in muted). No external image required.

Right (in order):
1. **TPS / GPS toggle** — `SegmentedControl` with values `TPS` and `GPS`. Dispatches to `uiSlice.metric`.
2. **Dark mode toggle** — `ActionIcon` with a sun/moon icon. Dispatches to `uiSlice.colorScheme`.

### Main content

#### Global stats banner

A single `Card` or `Group` below the header showing three stats from `metricsSlice.global`:

| Stat | Value |
|---|---|
| Total TPS | `totalTps` formatted to 2 decimal places |
| Total GPS | `totalGps` formatted with SI suffix (e.g. `1.2M`) |
| Active chains | `activeChains` |

Show a `Skeleton` while loading. Update automatically as `global` is re-polled every 5 seconds.

#### Chain list

A scrollable list (use `ScrollArea`) of all networks from `networksSlice.networks`, sorted by the currently selected metric (highest first). Each row is a `Card` or `Table.Tr` containing:

- Chain name
- ChainId (muted, small)
- Current TPS **or** GPS depending on `uiSlice.metric`, formatted to 2 decimal places
- A `Badge` or colored dot: green if data arrived within `config.staleThresholdMs`, grey if stale

When a `MetricsUpdate` arrives via SignalR, the corresponding row updates in real time without re-fetching or re-sorting until the next render cycle. Use `useMemo` to derive the sorted list from `metricsSlice.live` + `uiSlice.metric`.

Show `—` for chains where live data is null or absent.

---

## File structure

```
src/
  config.ts             ← typed wrapper over import.meta.env, single source of truth
  api/
    generated/          ← @hey-api/openapi-ts output, do not edit
    signalr.ts          ← hub connection singleton + typed helpers
  store/
    index.ts            ← configureStore
    networksSlice.ts
    metricsSlice.ts
    uiSlice.ts
  components/
    TopBar.tsx
    GlobalStatsBanner.tsx
    ChainList.tsx
    ChainRow.tsx
  App.tsx
  main.tsx
```

---

## Constraints

- Do not poll `GET /api/v1/metrics/{chainId}/live` for individual chains — the WebSocket covers that.
- Do not store the SignalR connection object in Redux state — keep it as a module-level singleton in `src/api/signalr.ts`.
- The SignalR subscription must be started once, after the network list is loaded, subscribing to all chain IDs in a single `invoke("Subscribe", allChainIds)` call.
- All monetary/rate values displayed to 2 decimal places. GPS values ≥ 1,000,000 use SI suffix (M, B).
- Use Mantine's `useMantineColorScheme` for theme toggling — wire it to `uiSlice.colorScheme`.
- Strict TypeScript — no `any`.
