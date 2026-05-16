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
    // reuse the same exponential backoff for transport-level reconnects
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

let activeChainIds: number[] = [];

// Re-subscribe after the transport layer reconnects (server loses subscription state on disconnect)
connection.onreconnected(() => {
  if (activeChainIds.length > 0) {
    connection.invoke("Subscribe", activeChainIds).catch(console.error);
  }
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

export async function startSignalR(chainIds: number[]): Promise<void> {
  stopped.value = false;
  activeChainIds = chainIds;
  await connectWithBackoff(stopped);
  await connection.invoke("Subscribe", chainIds);
}

export async function updateSubscription(chainIds: number[]): Promise<void> {
  const toUnsub = activeChainIds.filter((id) => !chainIds.includes(id));
  const toSub = chainIds.filter((id) => !activeChainIds.includes(id));
  activeChainIds = chainIds;
  if (toUnsub.length > 0) await connection.invoke("Unsubscribe", toUnsub).catch(console.error);
  if (toSub.length > 0) await connection.invoke("Subscribe", toSub).catch(console.error);
}

export async function stopSignalR(): Promise<void> {
  stopped.value = true;
  if (activeChainIds.length > 0) {
    await connection.invoke("Unsubscribe", activeChainIds).catch(() => undefined);
  }
  activeChainIds = [];
  await connection.stop();
}
