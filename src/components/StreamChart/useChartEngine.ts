import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchHistoryPreload } from "../../store/metricsSlice";
import {
  AXIS_W,
  HEIGHT,
  MAX_LOOKBACK_MS,
  MAX_REDRAW_THRESHOLD,
  MIN_LOOKBACK_MS,
  OTHER_COLOR,
  SCROLL_DURATION_MS,
  SMOOTH_RADIUS,
  TIME_AXIS_H,
} from "./constants";
import { collectColumn, fillFromSnapshots } from "./columns";
import {
  paintAxis,
  paintColumnData,
  paintCrosshair,
  paintTimeAxis,
  redrawAll,
  smoothColumn,
} from "./paint";
import { chainColor, hexToRgb } from "./utils";
import { ColumnData, TooltipState } from "./types";

export function useChartEngine(
  excludeLowThroughput: boolean,
  isFullscreen: boolean,
  resetLookbackRef: MutableRefObject<() => void>,
) {
  const dispatch = useDispatch<AppDispatch>();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const smoothGraph = useSelector((s: RootState) => s.ui.smoothGraph);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const preloadedSnapshots = useSelector((s: RootState) => s.metrics.preloadedSnapshots);

  const visibleNetworks = networks
    .filter((n) => n.enabled)
    .filter((n) => includeTestnets || !n.isTestnet)
    .filter((n) => includeSidechains || (n.networkType?.toLowerCase() ?? "") !== "sidechain");

  const liveRef = useRef(live);
  const networksRef = useRef(visibleNetworks);
  const metricRef = useRef(metric);
  const colorSchemeRef = useRef(colorScheme);
  const excludeLowThroughputRef = useRef(excludeLowThroughput);
  const smoothGraphRef = useRef(smoothGraph);
  const prevSmoothRef = useRef(smoothGraph);
  const preloadedRef = useRef(preloadedSnapshots);
  const isFullscreenRef = useRef(isFullscreen);
  const maxRef = useRef(1);
  const prevMetricRef = useRef(metric);
  const historyBufRef = useRef<ColumnData[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasWRef = useRef(0);
  const HRef = useRef(HEIGHT);
  const streamWRef = useRef(0);
  const lastMaxRef = useRef(1);
  const lastTsRef = useRef(0);
  const subPixelRef = useRef(0);
  const lookbackMsRef = useRef(SCROLL_DURATION_MS);

  liveRef.current = live;
  networksRef.current = visibleNetworks;
  metricRef.current = metric;
  colorSchemeRef.current = colorScheme;
  excludeLowThroughputRef.current = excludeLowThroughput;
  smoothGraphRef.current = smoothGraph;
  preloadedRef.current = preloadedSnapshots;
  isFullscreenRef.current = isFullscreen;

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !overlay || !wrap) return;

    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;

    const c = ctx;
    const oc = overlayCtx;
    const cvs = canvas;
    ctxRef.current = c;

    const history = historyBufRef.current;
    let rafId: number;
    let refetchTimer: ReturnType<typeof setTimeout> | undefined;

    function rescaleHistory(newLookback: number, oldLookback: number) {
      if (history.length === 0) return;
      const sw = streamWRef.current;
      const rescaled: ColumnData[] = new Array(sw);
      if (newLookback < oldLookback) {
        const keepCount = Math.max(1, Math.round((history.length * newLookback) / oldLookback));
        const slice = history.slice(history.length - keepCount);
        for (let i = 0; i < sw; i++)
          rescaled[i] = slice[Math.min(Math.round((i / sw) * slice.length), slice.length - 1)];
      } else {
        const coveredPx = Math.min(sw, Math.round((sw * oldLookback) / newLookback));
        const empty: ColumnData = { segments: [], total: 0 };
        for (let i = 0; i < sw - coveredPx; i++) rescaled[i] = empty;
        for (let i = 0; i < coveredPx; i++)
          rescaled[sw - coveredPx + i] =
            history[Math.min(Math.round((i / coveredPx) * history.length), history.length - 1)];
      }
      history.length = 0;
      for (const col of rescaled) history.push(col);
    }

    function doResize() {
      const newW = wrap!.clientWidth;
      if (newW === 0) return;
      const newH = isFullscreenRef.current
        ? Math.max(wrap!.clientHeight - TIME_AXIS_H, HEIGHT)
        : HEIGHT;
      const newStreamW = newW - AXIS_W;

      if (history.length > 0 && newStreamW !== streamWRef.current) {
        const oldLen = history.length;
        const rescaled: ColumnData[] = new Array(newStreamW);
        for (let i = 0; i < newStreamW; i++)
          rescaled[i] = history[Math.min(Math.round((i / newStreamW) * oldLen), oldLen - 1)];
        history.length = 0;
        for (const col of rescaled) history.push(col);
      }

      canvas!.width = newW;
      canvas!.height = newH + TIME_AXIS_H;
      overlay!.width = newW;
      overlay!.height = newH + TIME_AXIS_H;
      canvasWRef.current = newW;
      HRef.current = newH;
      streamWRef.current = newStreamW;
      lastTsRef.current = 0;

      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, newW, newH, history, maxRef.current, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
    }

    const initW = wrap.clientWidth || wrap.getBoundingClientRect().width;
    canvas.width = initW;
    canvas.height = HEIGHT + TIME_AXIS_H;
    overlay.width = initW;
    overlay.height = HEIGHT + TIME_AXIS_H;
    canvasWRef.current = initW;
    HRef.current = HEIGHT;
    streamWRef.current = initW - AXIS_W;

    if (preloadedRef.current.length > 0 && history.length === 0) {
      fillFromSnapshots(preloadedRef.current, history, streamWRef.current, networksRef.current, metricRef.current, lookbackMsRef.current);
      if (history.length > 0) {
        lastMaxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
        maxRef.current = lastMaxRef.current;
        redrawAll(c, initW, HEIGHT, history, lastMaxRef.current, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
      }
    }

    const ro = new ResizeObserver(doResize);
    ro.observe(wrap);

    function frame(ts: number) {
      const W = canvasWRef.current;
      const H = HRef.current;
      const streamW = streamWRef.current;
      const dt = lastTsRef.current === 0 ? 0 : ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (metricRef.current !== prevMetricRef.current) {
        maxRef.current = 1;
        lastMaxRef.current = 1;
        history.length = 0;
        c.clearRect(0, 0, W, H + TIME_AXIS_H);
        paintAxis(c, H, 1);
        paintTimeAxis(c, W, streamW, H, lookbackMsRef.current);
        prevMetricRef.current = metricRef.current;
      }

      if (smoothGraphRef.current !== prevSmoothRef.current) {
        prevSmoothRef.current = smoothGraphRef.current;
        redrawAll(c, W, H, history, maxRef.current, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
      }

      subPixelRef.current += dt * (streamW / lookbackMsRef.current);
      const px = Math.floor(subPixelRef.current);

      if (px >= 1) {
        subPixelRef.current -= px;
        const col = collectColumn(liveRef.current, networksRef.current, metricRef.current, excludeLowThroughputRef.current);

        for (let i = 0; i < px; i++) history.push(col);
        if (history.length > streamW) history.splice(0, history.length - streamW);

        maxRef.current = history.reduce((m, c) => Math.max(m, c.total), 1);

        if (Math.abs(maxRef.current - lastMaxRef.current) / lastMaxRef.current > MAX_REDRAW_THRESHOLD) {
          lastMaxRef.current = maxRef.current;
          redrawAll(c, W, H, history, maxRef.current, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
        } else {
          c.globalCompositeOperation = "copy";
          c.drawImage(cvs, -px, 0);
          c.globalCompositeOperation = "source-over";
          c.clearRect(W - px, 0, px, H);
          for (let i = 0; i < px; i++) {
            const histIdx = history.length - px + i;
            const paintCol = smoothGraphRef.current ? smoothColumn(history, histIdx, SMOOTH_RADIUS) : col;
            paintColumnData(c, W - px + i, H, paintCol, maxRef.current);
          }
          paintAxis(c, H, maxRef.current);
          paintTimeAxis(c, W, streamW, H, lookbackMsRef.current);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    function onMouseMove(e: MouseEvent) {
      const W = canvasWRef.current;
      const H = HRef.current;
      const rect = cvs.getBoundingClientRect();
      const mx = Math.round(e.clientX - rect.left);
      const my = Math.round(e.clientY - rect.top);

      if (mx < AXIS_W || mx >= W || my < 0 || my >= H) {
        setTooltip(null);
        oc.clearRect(0, 0, W, H + TIME_AXIS_H);
        return;
      }

      paintCrosshair(oc, W, mx, my, maxRef.current, metricRef.current.toUpperCase(), colorSchemeRef.current === "dark", H, lookbackMsRef.current);

      const [r, g, b, a] = c.getImageData(mx, my, 1, 1).data;
      if (a === 0) {
        setTooltip(null);
        return;
      }

      const histIdx = mx - (W - history.length);
      const col = histIdx >= 0 && histIdx < history.length ? history[histIdx] : null;
      const nets = networksRef.current;
      let name = "Unknown";
      let value = 0;

      const [or, og, ob] = hexToRgb(OTHER_COLOR);
      if (r === or && g === og && b === ob) {
        name = "Others";
        value = col?.segments.find((s) => s.color === OTHER_COLOR)?.value ?? 0;
      } else {
        for (const n of nets) {
          const color = chainColor(n.chainId);
          const [cr, cg, cb] = hexToRgb(color);
          if (r === cr && g === cg && b === cb) {
            name = n.name;
            value = col?.segments.find((s) => s.color === color)?.value ?? 0;
            break;
          }
        }
      }

      setTooltip({ x: e.clientX, y: e.clientY, name, value });
    }

    function onMouseLeave() {
      setTooltip(null);
      oc.clearRect(0, 0, canvasWRef.current, HRef.current + TIME_AXIS_H);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const oldLookback = lookbackMsRef.current;
      const factor = e.deltaY > 0 ? 1.25 : 1 / 1.25;
      const newLookback = Math.max(MIN_LOOKBACK_MS, Math.min(MAX_LOOKBACK_MS, oldLookback * factor));
      if (newLookback === oldLookback) return;

      rescaleHistory(newLookback, oldLookback);
      lookbackMsRef.current = newLookback;
      const W = canvasWRef.current;
      const H = HRef.current;
      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, W, H, history, maxRef.current, newLookback, smoothGraphRef.current, SMOOTH_RADIUS);

      if (newLookback > oldLookback) {
        clearTimeout(refetchTimer);
        refetchTimer = setTimeout(() => dispatchRef.current(fetchHistoryPreload()), 300);
      }
    }

    function onDblClick() {
      const oldLookback = lookbackMsRef.current;
      if (oldLookback === SCROLL_DURATION_MS) return;
      rescaleHistory(SCROLL_DURATION_MS, oldLookback);
      lookbackMsRef.current = SCROLL_DURATION_MS;
      const W = canvasWRef.current;
      const H = HRef.current;
      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, W, H, history, maxRef.current, SCROLL_DURATION_MS, smoothGraphRef.current, SMOOTH_RADIUS);
    }

    resetLookbackRef.current = onDblClick;

    cvs.addEventListener("mousemove", onMouseMove);
    cvs.addEventListener("mouseleave", onMouseLeave);
    cvs.addEventListener("wheel", onWheel, { passive: false });
    cvs.addEventListener("dblclick", onDblClick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(refetchTimer);
      ro.disconnect();
      cvs.removeEventListener("mousemove", onMouseMove);
      cvs.removeEventListener("mouseleave", onMouseLeave);
      cvs.removeEventListener("wheel", onWheel);
      cvs.removeEventListener("dblclick", onDblClick);
      ctxRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (preloadedSnapshots.length === 0) return;
    const W = canvasWRef.current;
    const history = historyBufRef.current;
    fillFromSnapshots(preloadedSnapshots, history, W - AXIS_W, networksRef.current, metricRef.current, lookbackMsRef.current);
    const ctx = ctxRef.current;
    if (ctx && W > 0) {
      const max = history.reduce((m, col) => Math.max(m, col.total), 1);
      maxRef.current = max;
      redrawAll(ctx, W, HRef.current, history, max, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
    }
  }, [preloadedSnapshots]);

  return { canvasRef, overlayRef, wrapRef, tooltip };
}
