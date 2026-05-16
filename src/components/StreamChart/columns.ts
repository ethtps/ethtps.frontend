import { LiveMetricsResponse, MetricsSnapshot } from "../../store/metricsSlice";
import { NetworkResponse } from "../../store/networksSlice";
import { OTHER_COLOR, THRESHOLD } from "./constants";
import { ColumnData, Segment } from "./types";
import { chainColor } from "./utils";

export function collectColumn(
  live: Record<number, LiveMetricsResponse>,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
): ColumnData {
  const segments: Segment[] = [];
  let other = 0;
  let total = 0;
  for (const n of networks) {
    const v = live[n.chainId]?.[metric] ?? 0;
    if (v >= THRESHOLD) {
      segments.push({ color: chainColor(String(n.chainId)), value: v });
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
      segments.push({ color: chainColor(String(n.chainId)), value: v });
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
) {
  if (snapshots.length === 0 || streamW === 0) return;
  history.length = 0;
  const cols = snapshots.map((s) => snapshotToColumnData(s, networks, metric));
  const pxPerCol = streamW / cols.length;
  let carry = 0;
  for (const col of cols) {
    carry += pxPerCol;
    const px = Math.round(carry);
    carry -= px;
    for (let i = 0; i < px; i++) history.push(col);
  }
  if (history.length > streamW) history.splice(0, history.length - streamW);
}
