import { LiveMetricsResponse, MetricsSnapshot } from "../../store/metricsSlice";
import { NetworkResponse } from "../../store/networksSlice";
import { OTHER_COLOR, THRESHOLD } from "./constants";
import { ColumnData, Segment } from "./types";
import { chainColor } from "./utils";

export function collectColumn(
  live: Record<number, LiveMetricsResponse>,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
  excludeLowThroughput = true,
): ColumnData {
  const segments: Segment[] = [];
  let other = 0;
  let total = 0;
  for (const n of networks) {
    const v = live[n.chainId]?.[metric] ?? 0;
    if (excludeLowThroughput ? v >= THRESHOLD : v > 0) {
      segments.push({ color: chainColor(n.chainId), value: v });
    } else {
      other += v;
    }
    total += v;
  }
  if (other > 0) segments.push({ color: OTHER_COLOR, value: other });
  return { segments, total };
}

export function snapshotToColumnData(
  snap: MetricsSnapshot,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
): ColumnData {
  if (Object.keys(snap.chains).length === 0) {
    const total = metric === "tps" ? snap.totalTps : snap.totalGps;
    return {
      segments: total > 0 ? [{ color: OTHER_COLOR, value: total }] : [],
      total,
    };
  }
  const segments: Segment[] = [];
  let other = 0;
  let total = 0;
  for (const n of networks) {
    const entry = snap.chains[String(n.chainId)];
    const v = (entry?.[metric] ?? 0) as number;
    if (v >= THRESHOLD) {
      segments.push({ color: chainColor(n.chainId), value: v });
    } else {
      other += v;
    }
    total += v;
  }
  if (other > 0) segments.push({ color: OTHER_COLOR, value: other });
  return { segments, total };
}

export function fillFromSnapshots(
  snapshots: MetricsSnapshot[],
  history: ColumnData[],
  streamW: number,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
  lookbackMs: number,
) {
  if (snapshots.length === 0 || streamW === 0) return;
  history.length = 0;

  // Derive bucket duration from consecutive timestamps; fall back to 1 minute
  const bucketMs =
    snapshots.length >= 2 ? snapshots[1].timestamp - snapshots[0].timestamp : 60_000;

  const now = Date.now();
  const pxPerMs = streamW / lookbackMs;
  const empty: ColumnData = { segments: [], total: 0 };
  const result: ColumnData[] = Array.from({ length: streamW }, () => empty);

  for (const snap of snapshots) {
    const col = snapshotToColumnData(snap, networks, metric);
    // Bucket covers [snap.timestamp, snap.timestamp + bucketMs); map to pixel range
    const leftPx = Math.round(streamW - (now - snap.timestamp) * pxPerMs);
    const rightPx = Math.round(streamW - (now - snap.timestamp - bucketMs) * pxPerMs);
    for (let x = Math.max(0, leftPx); x < Math.min(streamW, rightPx); x++) {
      result[x] = col;
    }
  }

  for (const col of result) history.push(col);
}
