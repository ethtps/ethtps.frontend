import * as signalR from "@microsoft/signalr";
import { config } from "../config";
import { store } from "../store";
import { applyUpdate, MetricsUpdate } from "../store/metricsSlice";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.signalrHubUrl)
  .withAutomaticReconnect()
  .build();

connection.on("MetricsUpdate", (update: MetricsUpdate) => {
  store.dispatch(applyUpdate(update));
});

export async function startSignalR(chainIds: number[]): Promise<void> {
  await connection.start();
  await connection.invoke("Subscribe", chainIds);
}

export async function stopSignalR(chainIds: number[]): Promise<void> {
  await connection.invoke("Unsubscribe", chainIds);
  await connection.stop();
}
