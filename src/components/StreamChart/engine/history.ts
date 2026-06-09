import { getApiV1MetricsGlobalHistory } from "../../../api/generated/services.gen";
import { MetricsSnapshot } from "../../../store/metricsSlice";
import { EMPTY_COL, snapshotToColumnData } from "../columns";
import { ColumnData } from "../types";
import { EngineCtx } from "./types";

export function maxPanExtra(streamW: number): number {
  return Math.min(streamW * 3, 5000);
}

export function trimToLive(eg: EngineCtx): void {
  const { history, streamW, lookbackMs, bufferOldestTs, noMoreHistory } = eg;
  const sw = streamW.current;
  if (history.length > sw) history.splice(0, history.length - sw);
  bufferOldestTs.current = Date.now() - lookbackMs.current;
  noMoreHistory.current = false;
}

export function rescaleHistory(eg: EngineCtx, newLookback: number, oldLookback: number): void {
  const { history, streamW } = eg;
  trimToLive(eg);
  if (history.length === 0) return;
  const sw = streamW.current;
  const rescaled: ColumnData[] = new Array(sw);
  if (newLookback < oldLookback) {
    const keepCount = Math.max(1, Math.round((history.length * newLookback) / oldLookback));
    const slice = history.slice(history.length - keepCount);
    for (let i = 0; i < sw; i++)
      rescaled[i] = slice[Math.min(Math.round((i / sw) * slice.length), slice.length - 1)];
  } else {
    const coveredPx = Math.min(sw, Math.round((sw * oldLookback) / newLookback));
    for (let i = 0; i < sw - coveredPx; i++) rescaled[i] = EMPTY_COL;
    for (let i = 0; i < coveredPx; i++)
      rescaled[sw - coveredPx + i] =
        history[Math.min(Math.round((i / coveredPx) * history.length), history.length - 1)];
  }
  history.length = 0;
  for (const col of rescaled) history.push(col);
}

export async function fetchOlderHistory(eg: EngineCtx): Promise<void> {
  const {
    history, bufferOldestTs, isFetchingHistory, noMoreHistory, setIsLoadingHistory,
    streamW, lookbackMs, networks, metric,
  } = eg;

  if (isFetchingHistory.current || noMoreHistory.current) return;
  const toTs = bufferOldestTs.current;
  if (toTs === 0) return;

  const sw = streamW.current;
  const lbMs = lookbackMs.current;
  const pxPerMs = sw / lbMs;
  const chunkMs = Math.max(lbMs, 60_000);
  const fromTs = toTs - chunkMs;
  const resolution = chunkMs < 300_000 ? "1s" : "1m";

  isFetchingHistory.current = true;
  setIsLoadingHistory.current(true);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hist = (await getApiV1MetricsGlobalHistory({
      from: new Date(fromTs).toISOString(),
      to: new Date(toTs).toISOString(),
      resolution,
    })) as any;

    if (!hist?.buckets || hist.buckets.length === 0) {
      noMoreHistory.current = true;
      return;
    }

    const byTime = new Map<number, MetricsSnapshot>();
    for (const b of hist.buckets) {
      const ts = new Date(b.bucket).getTime();
      let snap = byTime.get(ts);
      if (!snap) {
        snap = { timestamp: ts, totalTps: 0, totalGps: 0, chains: {} };
        byTime.set(ts, snap);
      }
      snap.chains[String(b.chainId)] = { tps: b.avgTps, gps: b.avgGps };
      snap.totalTps += b.avgTps;
      snap.totalGps += b.avgGps;
    }
    const snapshots = Array.from(byTime.values()).sort((a, b) => a.timestamp - b.timestamp);
    if (snapshots.length === 0) { noMoreHistory.current = true; return; }

    const extraPx = Math.max(1, Math.round((toTs - fromTs) * pxPerMs));
    const bucketMs =
      snapshots.length >= 2
        ? snapshots[1].timestamp - snapshots[0].timestamp
        : chunkMs < 300_000 ? 1000 : 60_000;

    const newCols: ColumnData[] = Array.from({ length: extraPx }, () => EMPTY_COL);
    for (const snap of snapshots) {
      const col = snapshotToColumnData(snap, networks.current, metric.current);
      if (col.total === 0) continue;
      const leftPx = Math.round((snap.timestamp - fromTs) * pxPerMs);
      const rightPx = Math.round((snap.timestamp + bucketMs - fromTs) * pxPerMs);
      for (let x = Math.max(0, leftPx); x < Math.min(extraPx, rightPx); x++) {
        if (newCols[x] === EMPTY_COL) newCols[x] = col;
      }
    }

    // Prepend without spread to avoid call-stack overflow on large arrays.
    // Note: do NOT adjust panOffset/dragStartPan here. The view is anchored to the RIGHT edge
    // (live = now), so prepending older data on the left doesn't shift the visible window —
    // displayStart/displayEnd in render.ts compute from (history.length - sw - panOffset), which
    // automatically points to the same old data after the shift. Incrementing panOffset would
    // teleport the view backward by `extraPx` pixels (the bug that caused "jumps all over the place").
    const tail = history.slice();
    history.length = 0;
    for (const col of newCols) history.push(col);
    for (const col of tail) history.push(col);

    bufferOldestTs.current = fromTs;
  } catch (err) {
    console.error("fetchOlderHistory failed:", err);
  } finally {
    isFetchingHistory.current = false;
    setIsLoadingHistory.current(false);
  }
}
