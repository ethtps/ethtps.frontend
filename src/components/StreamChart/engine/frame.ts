import { AXIS_W, MAX_REDRAW_THRESHOLD, SMOOTH_RADIUS } from "../constants";
import { collectColumn } from "../columns";
import { paintAxis, paintColumnData, paintTimeAxis, redrawAll, smoothColumn } from "../paint";
import { maxPanExtra } from "./history";
import { redrawLive, redrawPanned } from "./render";
import { EngineCtx } from "./types";

export function createFrameLoop(eg: EngineCtx): { start: () => void; stop: () => void } {
  const {
    ctx: c, canvas: cvs,
    history, streamW, canvasW, H, lastTs, max, lastMax, panOffset,
    lookbackMs, metric, live, networks, smoothGraph, excludeLowThroughput,
    isPanned, setIsPanned, needsLiveRedraw,
  } = eg;

  let rafId = 0;
  let prevMetric = metric.current;
  let prevSmooth = smoothGraph.current;
  let subPixel = 0;

  function frame(ts: number) {
    const W = canvasW.current;
    const h = H.current;
    const sw = streamW.current;
    const dt = lastTs.current === 0 ? 0 : ts - lastTs.current;
    lastTs.current = ts;

    // Metric change: clear everything and restart
    if (metric.current !== prevMetric) {
      max.current = 1;
      lastMax.current = 1;
      history.length = 0;
      c.clearRect(0, 0, W, h + 20);
      paintAxis(c, h, 1);
      paintTimeAxis(c, W, sw, h, lookbackMs.current);
      prevMetric = metric.current;
      panOffset.current = 0;
      eg.isDragging.current = false;
      eg.dragStartPan.current = 0;
      isPanned.current = false;
      setIsPanned.current(false);
    }

    if (smoothGraph.current !== prevSmooth) {
      prevSmooth = smoothGraph.current;
      panOffset.current > 0 ? redrawPanned(eg) : redrawLive(eg);
    }

    subPixel += dt * (sw / lookbackMs.current);
    const px = Math.floor(subPixel);
    if (px < 1) { rafId = requestAnimationFrame(frame); return; }
    subPixel -= px;

    const col = collectColumn(live.current, networks.current, metric.current, excludeLowThroughput.current);
    for (let i = 0; i < px; i++) history.push(col);

    const cap = sw + maxPanExtra(sw);
    if (history.length > cap) history.splice(0, history.length - cap);

    // While panned: accumulate but skip canvas update
    if (panOffset.current > 0) { rafId = requestAnimationFrame(frame); return; }

    if (needsLiveRedraw.current) {
      needsLiveRedraw.current = false;
      redrawLive(eg);
      rafId = requestAnimationFrame(frame);
      return;
    }

    // Incremental shift-render
    const liveSlice = history.length > sw ? history.slice(-sw) : history;
    max.current = liveSlice.reduce((m, col) => Math.max(m, col.total), 1);

    if (Math.abs(max.current - lastMax.current) / lastMax.current > MAX_REDRAW_THRESHOLD) {
      lastMax.current = max.current;
      redrawAll(c, W, h, liveSlice, max.current, lookbackMs.current, smoothGraph.current, SMOOTH_RADIUS);
    } else {
      c.globalCompositeOperation = "copy";
      c.drawImage(cvs, -px, 0);
      c.globalCompositeOperation = "source-over";
      c.clearRect(W - px, 0, px, h);
      for (let i = 0; i < px; i++) {
        const histIdx = history.length - px + i;
        const paintCol = smoothGraph.current ? smoothColumn(history, histIdx, SMOOTH_RADIUS) : history[histIdx];
        paintColumnData(c, W - px + i, h, paintCol, max.current);
      }
      paintAxis(c, h, max.current);
      paintTimeAxis(c, W, sw, h, lookbackMs.current);
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    start: () => { rafId = requestAnimationFrame(frame); },
    stop: () => cancelAnimationFrame(rafId),
  };
}
