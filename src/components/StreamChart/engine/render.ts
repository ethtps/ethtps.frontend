import { SMOOTH_RADIUS, TIME_AXIS_H } from "../constants";
import { redrawAll } from "../paint";
import { EngineCtx } from "./types";

export function redrawLive(eg: EngineCtx): void {
  const { ctx: c, history, streamW, canvasW, H, max, lastMax, lookbackMs, smoothGraph } = eg;
  const sw = streamW.current;
  const slice = history.length > sw ? history.slice(-sw) : history;
  const m = slice.reduce((acc, col) => Math.max(acc, col.total), 1);
  max.current = m;
  lastMax.current = m;
  redrawAll(c, canvasW.current, H.current, slice, m, lookbackMs.current, smoothGraph.current, SMOOTH_RADIUS);
}

export function redrawPanned(eg: EngineCtx): void {
  const { ctx: c, overlayCtx: oc, history, streamW, canvasW, H, max, lastMax, lookbackMs, smoothGraph, panOffset } = eg;
  const pan = panOffset.current;
  const sw = streamW.current;
  const W = canvasW.current;
  const h = H.current;
  const displayStart = Math.max(0, history.length - sw - pan);
  const displayEnd = Math.max(sw, history.length - pan);
  const slice = history.slice(displayStart, displayEnd);
  const m = slice.reduce((acc, col) => Math.max(acc, col.total), 1);
  max.current = m;
  lastMax.current = m;
  redrawAll(c, W, h, slice, m, lookbackMs.current, smoothGraph.current, SMOOTH_RADIUS, pan * (lookbackMs.current / sw));
  oc.clearRect(0, 0, W, h + TIME_AXIS_H);
}
