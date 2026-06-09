import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchHistoryPreload } from "../../store/metricsSlice";
import { AXIS_W, HEIGHT, SMOOTH_RADIUS, TIME_AXIS_H } from "./constants";
import { fillFromSnapshots } from "./columns";
import { redrawAll } from "./paint";
import { ColumnData, TooltipState } from "./types";
import { createFrameLoop } from "./engine/frame";
import { attachListeners, createMouseHandlers, createTouchHandlers, createWheelHandlers, doResize } from "./engine/interaction";
import { EngineCtx } from "./engine/types";

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
  const [isPanned, setIsPanned] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  // Live refs — updated every render so effect closures always read fresh values
  const liveRef = useRef(live);
  const networksRef = useRef(visibleNetworks);
  const metricRef = useRef(metric);
  const colorSchemeRef = useRef(colorScheme);
  const excludeLowThroughputRef = useRef(excludeLowThroughput);
  const smoothGraphRef = useRef(smoothGraph);
  const preloadedRef = useRef(preloadedSnapshots);
  const isFullscreenRef = useRef(isFullscreen);
  liveRef.current = live;
  networksRef.current = visibleNetworks;
  metricRef.current = metric;
  colorSchemeRef.current = colorScheme;
  excludeLowThroughputRef.current = excludeLowThroughput;
  smoothGraphRef.current = smoothGraph;
  preloadedRef.current = preloadedSnapshots;
  isFullscreenRef.current = isFullscreen;

  // Stable callback refs
  const setTooltipRef = useRef(setTooltip);
  setTooltipRef.current = setTooltip;
  const setIsPannedRef = useRef(setIsPanned);
  setIsPannedRef.current = setIsPanned;
  const setIsLoadingHistoryRef = useRef(setIsLoadingHistory);
  setIsLoadingHistoryRef.current = setIsLoadingHistory;

  // Persistent state refs
  const historyBufRef = useRef<ColumnData[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasWRef = useRef(0);
  const HRef = useRef(HEIGHT);
  const streamWRef = useRef(0);
  const lastTsRef = useRef(0);
  const maxRef = useRef(1);
  const lastMaxRef = useRef(1);
  const lookbackMsRef = useRef(60_000);
  const panOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPanRef = useRef(0);
  const isPannedRef = useRef(false);
  const needsLiveRedrawRef = useRef(false);
  const bufferOldestTsRef = useRef(0);
  const isFetchingHistoryRef = useRef(false);
  const noMoreHistoryRef = useRef(false);
  const filtersMountedRef = useRef(false);
  const pendingReplaceRef = useRef(false);

  // Main effect — runs once; all live values read through refs
  useEffect(() => {
    const canvas = canvasRef.current!;
    const overlay = overlayRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const overlayCtx = overlay.getContext("2d")!;
    ctxRef.current = ctx;

    const initW = wrap.clientWidth || wrap.getBoundingClientRect().width;
    canvas.width = initW;
    canvas.height = HEIGHT + TIME_AXIS_H;
    overlay.width = initW;
    overlay.height = HEIGHT + TIME_AXIS_H;
    canvasWRef.current = initW;
    HRef.current = HEIGHT;
    streamWRef.current = initW - AXIS_W;

    const eg: EngineCtx = {
      canvas, overlay, ctx, overlayCtx,
      history: historyBufRef.current,
      bufferOldestTs: bufferOldestTsRef,
      isFetchingHistory: isFetchingHistoryRef,
      noMoreHistory: noMoreHistoryRef,
      setIsLoadingHistory: setIsLoadingHistoryRef,
      canvasW: canvasWRef,
      H: HRef,
      streamW: streamWRef,
      lastTs: lastTsRef,
      isFullscreen: isFullscreenRef,
      panOffset: panOffsetRef,
      isDragging: isDraggingRef,
      dragStartX: dragStartXRef,
      dragStartPan: dragStartPanRef,
      isPanned: isPannedRef,
      setIsPanned: setIsPannedRef,
      needsLiveRedraw: needsLiveRedrawRef,
      max: maxRef,
      lastMax: lastMaxRef,
      lookbackMs: lookbackMsRef,
      metric: metricRef as MutableRefObject<"tps" | "gps">,
      networks: networksRef,
      smoothGraph: smoothGraphRef,
      excludeLowThroughput: excludeLowThroughputRef,
      colorScheme: colorSchemeRef,
      live: liveRef,
      setTooltip: (t) => setTooltipRef.current(t),
      dispatch: dispatchRef,
      resetLookbackRef,
    };

    // Seed canvas with preloaded history if available
    const history = eg.history;
    const sw = streamWRef.current;
    if (preloadedRef.current.length > 0 && history.length === 0) {
      fillFromSnapshots(preloadedRef.current, history, sw, networksRef.current, metricRef.current, lookbackMsRef.current);
      if (history.length > 0) {
        const m = history.reduce((acc, col) => Math.max(acc, col.total), 1);
        maxRef.current = m;
        lastMaxRef.current = m;
        redrawAll(ctx, initW, HEIGHT, history, m, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
      }
    }

    // Wire up subsystems
    const mouse = createMouseHandlers(eg);
    const touch = createTouchHandlers(eg);
    const wheel = createWheelHandlers(eg);
    const frame = createFrameLoop(eg);
    const ro = new ResizeObserver(() => doResize(eg));
    ro.observe(wrap);
    canvas.style.cursor = "grab";
    frame.start();
    const detach = attachListeners(canvas, mouse, touch, wheel);

    return () => {
      frame.stop();
      ro.disconnect();
      detach();
      ctxRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter / metric changes → refetch history
  useEffect(() => {
    if (!filtersMountedRef.current) { filtersMountedRef.current = true; return; }
    pendingReplaceRef.current = true;
    dispatchRef.current(fetchHistoryPreload(lookbackMsRef.current));
  }, [includeTestnets, includeSidechains, metric]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preloaded snapshots arrived → paint them into the history buffer
  useEffect(() => {
    if (preloadedRef.current.length === 0 || networksRef.current.length === 0) return;
    const W = canvasWRef.current;
    const history = historyBufRef.current;
    fillFromSnapshots(preloadedRef.current, history, W - AXIS_W, networksRef.current, metricRef.current, lookbackMsRef.current, pendingReplaceRef.current);
    pendingReplaceRef.current = false;
    bufferOldestTsRef.current = preloadedRef.current[0]?.timestamp ?? Date.now() - lookbackMsRef.current;
    noMoreHistoryRef.current = false;
    const ctx = ctxRef.current;
    if (ctx && W > 0) {
      const sw = W - AXIS_W;
      const liveSlice = history.length > sw ? history.slice(-sw) : history;
      const m = liveSlice.reduce((acc, col) => Math.max(acc, col.total), 1);
      maxRef.current = m;
      lastMaxRef.current = m;
      redrawAll(ctx, W, HRef.current, liveSlice, m, lookbackMsRef.current, smoothGraphRef.current, SMOOTH_RADIUS);
    }
  }, [preloadedSnapshots, networks]); // eslint-disable-line react-hooks/exhaustive-deps

  return { canvasRef, overlayRef, wrapRef, tooltip, isPanned, isLoadingHistory };
}
