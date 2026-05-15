export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  signalrHubUrl: import.meta.env.VITE_SIGNALR_HUB_URL as string,
  openApiUrl: import.meta.env.VITE_OPENAPI_URL as string,
  globalPollIntervalMs: Number(import.meta.env.VITE_GLOBAL_POLL_INTERVAL_MS ?? 5000),
  staleThresholdMs: Number(import.meta.env.VITE_STALE_THRESHOLD_MS ?? 30000),
} as const;
