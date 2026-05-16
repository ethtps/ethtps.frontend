import * as signalR from "@microsoft/signalr";
import { config } from "../config";
import { store } from "../store";
import { applyBatchUpdate, MetricsUpdate } from "../store/metricsSlice";

const MAX_BACKOFF_MS = 5_000;

function backoffDelay(attempt: number): number {
  return Math.min(500 * 2 ** attempt, MAX_BACKOFF_MS);
}

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.signalrHubUrl)
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (ctx) => backoffDelay(ctx.previousRetryCount),
  })
  .build();

let batch: MetricsUpdate[] = [];

connection.on("MetricsUpdate", (update: MetricsUpdate) => {
  batch.push(update);
});

setInterval(() => {
  if (batch.length === 0) return;
  store.dispatch(applyBatchUpdate(batch));
  batch = [];
}, config.signalrBatchMs);

let activeFilters = { includeTestnets: true, includeSidechains: true };

// Re-subscribe after transport-level reconnects (server loses subscription state on disconnect)
connection.onreconnected(() => {
  connection
    .invoke("SubscribeAll", activeFilters.includeTestnets, activeFilters.includeSidechains)
    .catch(console.error);
});

async function connectWithBackoff(stopped: { value: boolean }): Promise<void> {
  let attempt = 0;
  while (!stopped.value) {
    try {
      await connection.start();
      return;
    } catch {
      const delay = backoffDelay(attempt++);
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }
}

const stopped = { value: false };

export async function startSignalR(includeTestnets: boolean, includeSidechains: boolean): Promise<void> {
  stopped.value = false;
  activeFilters = { includeTestnets, includeSidechains };
  await connectWithBackoff(stopped);
  await connection.invoke("SubscribeAll", includeTestnets, includeSidechains);
}

export async function updateSubscription(includeTestnets: boolean, includeSidechains: boolean): Promise<void> {
  activeFilters = { includeTestnets, includeSidechains };
  await connection.invoke("SubscribeAll", includeTestnets, includeSidechains).catch(console.error);
}

export async function stopSignalR(): Promise<void> {
  stopped.value = true;
  await connection.stop();
}
