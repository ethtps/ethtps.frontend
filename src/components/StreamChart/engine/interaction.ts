import { AXIS_W, HEIGHT, MAX_LOOKBACK_MS, MIN_LOOKBACK_MS, SCROLL_DURATION_MS, SMOOTH_RADIUS, TIME_AXIS_H } from "../constants";
import { paintCrosshair } from "../paint";
import { chainColor, hexToRgb } from "../utils";
import { OTHER_COLOR } from "../constants";
import { fetchHistoryPreload } from "../../../store/metricsSlice";
import { maxPanExtra, rescaleHistory, trimToLive } from "./history";
import { onDrag, snapToLive } from "./pan";
import { redrawLive } from "./render";
import { redrawAll } from "../paint";
import { EngineCtx } from "./types";

// ── Resize ────────────────────────────────────────────────────────────────────

export function doResize(eg: EngineCtx): void {
  const { canvas, overlay, history, canvasW, H, streamW, lastTs, panOffset, isPanned, setIsPanned, isFullscreen } = eg;
  const wrap = canvas.parentElement!;
  const newW = wrap.clientWidth;
  if (newW === 0) return;
  const newH = isFullscreen.current
    ? Math.max(wrap.clientHeight - TIME_AXIS_H, HEIGHT)
    : HEIGHT;
  const newStreamW = newW - AXIS_W;

  if (history.length > 0 && newStreamW !== streamW.current) {
    trimToLive(eg);
    const oldLen = history.length;
    const rescaled = Array.from({ length: newStreamW }, (_, i) =>
      history[Math.min(Math.round((i / newStreamW) * oldLen), oldLen - 1)],
    );
    history.length = 0;
    for (const col of rescaled) history.push(col);
  }

  if (panOffset.current > 0) {
    if (eg.isDragging.current) eg.dragStartPan.current -= panOffset.current;
    panOffset.current = 0;
    isPanned.current = false;
    setIsPanned.current(false);
    canvas.style.cursor = "grab";
  }

  canvas.width = newW;
  canvas.height = newH + TIME_AXIS_H;
  overlay.width = newW;
  overlay.height = newH + TIME_AXIS_H;
  canvasW.current = newW;
  H.current = newH;
  streamW.current = newStreamW;
  lastTs.current = 0;

  redrawLive(eg);
}

// ── Mouse handlers ────────────────────────────────────────────────────────────

export function createMouseHandlers(eg: EngineCtx) {
  const { canvas, overlayCtx: oc, history, canvasW, H, streamW, panOffset, isDragging, dragStartX, dragStartPan, max, metric, colorScheme, networks, setTooltip } = eg;

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPan.current = panOffset.current;
    canvas.style.cursor = "grabbing";
  }

  function onMouseUpGlobal(e: MouseEvent) {
    if (e.button !== 0 || !isDragging.current) return;
    isDragging.current = false;
    canvas.style.cursor = "grab";
  }

  function onDocumentMouseMove(e: MouseEvent) {
    if (!isDragging.current) return;
    if (!(e.buttons & 1)) {
      // Mouse button released outside the window — mouseup was missed
      isDragging.current = false;
      canvas.style.cursor = "grab";
      return;
    }
    onDrag(eg, e.clientX - dragStartX.current);
  }

  function onMouseMove(e: MouseEvent) {
    if (isDragging.current) return; // drag handled by onDocumentMouseMove
    const W = canvasW.current;
    const h = H.current;
    const sw = streamW.current;
    const rect = canvas.getBoundingClientRect();
    const mx = Math.round(e.clientX - rect.left);
    const my = Math.round(e.clientY - rect.top);

    if (mx < AXIS_W || mx >= W || my < 0 || my >= h) {
      setTooltip(null);
      oc.clearRect(0, 0, W, h + TIME_AXIS_H);
      return;
    }

    const pan = panOffset.current;
    const panOffsetMs = pan * (eg.lookbackMs.current / sw);
    paintCrosshair(oc, W, mx, my, max.current, metric.current.toUpperCase(), colorScheme.current === "dark", h, eg.lookbackMs.current, panOffsetMs);

    const [r, g, b, a] = eg.ctx.getImageData(mx, my, 1, 1).data;
    if (a === 0) { setTooltip(null); return; }

    const displayStart = Math.max(0, history.length - sw - pan);
    const histIdx = displayStart + (mx - (W - Math.min(sw, history.length - pan)));
    const col = histIdx >= 0 && histIdx < history.length ? history[histIdx] : null;

    const [or, og, ob] = hexToRgb(OTHER_COLOR);
    if (r === or && g === og && b === ob) {
      setTooltip({ x: e.clientX, y: e.clientY, name: "Others", value: col?.segments.find(s => s.color === OTHER_COLOR)?.value ?? 0 });
      return;
    }
    for (const n of networks.current) {
      const color = chainColor(n.chainId);
      const [cr, cg, cb] = hexToRgb(color);
      if (r === cr && g === cg && b === cb) {
        setTooltip({ x: e.clientX, y: e.clientY, name: n.name, value: col?.segments.find(s => s.color === color)?.value ?? 0 });
        return;
      }
    }
    setTooltip(null);
  }

  function onMouseLeave() {
    if (isDragging.current) return;
    setTooltip(null);
    oc.clearRect(0, 0, canvasW.current, H.current + TIME_AXIS_H);
  }

  return { onMouseDown, onMouseUpGlobal, onDocumentMouseMove, onMouseMove, onMouseLeave };
}

// ── Touch handlers ────────────────────────────────────────────────────────────

export function createTouchHandlers(eg: EngineCtx) {
  const { isDragging, dragStartX, dragStartPan, panOffset } = eg;

  function onTouchStart(e: TouchEvent) {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartPan.current = panOffset.current;
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging.current) return;
    e.preventDefault();
    onDrag(eg, e.touches[0].clientX - dragStartX.current);
  }

  function onTouchEnd() {
    isDragging.current = false;
  }

  return { onTouchStart, onTouchMove, onTouchEnd };
}

// ── Wheel / zoom handlers ─────────────────────────────────────────────────────

export function createWheelHandlers(eg: EngineCtx) {
  const { canvasW, H, streamW, lookbackMs, dispatch, resetLookbackRef } = eg;
  let refetchTimer: ReturnType<typeof setTimeout> | undefined;

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    snapToLive(eg);

    const oldLookback = lookbackMs.current;
    const factor = e.deltaY > 0 ? 1.25 : 1 / 1.25;
    const newLookback = Math.max(MIN_LOOKBACK_MS, Math.min(MAX_LOOKBACK_MS, oldLookback * factor));
    if (newLookback === oldLookback) return;

    rescaleHistory(eg, newLookback, oldLookback);
    lookbackMs.current = newLookback;
    const sw = streamW.current;
    const liveSlice = eg.history.length > sw ? eg.history.slice(-sw) : eg.history;
    const m = liveSlice.reduce((acc, col) => Math.max(acc, col.total), 1);
    eg.max.current = m;
    eg.lastMax.current = m;
    redrawAll(eg.ctx, canvasW.current, H.current, liveSlice, m, newLookback, eg.smoothGraph.current, SMOOTH_RADIUS);

    if (newLookback > oldLookback) {
      clearTimeout(refetchTimer);
      refetchTimer = setTimeout(() => dispatch.current(fetchHistoryPreload(lookbackMs.current)), 300);
    }
  }

  function onDblClick() {
    snapToLive(eg);
    const oldLookback = lookbackMs.current;
    if (oldLookback === SCROLL_DURATION_MS) return;
    const wasZoomedIn = oldLookback < SCROLL_DURATION_MS;
    rescaleHistory(eg, SCROLL_DURATION_MS, oldLookback);
    lookbackMs.current = SCROLL_DURATION_MS;
    const sw = streamW.current;
    const liveSlice = eg.history.length > sw ? eg.history.slice(-sw) : eg.history;
    const m = liveSlice.reduce((acc, col) => Math.max(acc, col.total), 1);
    eg.max.current = m;
    eg.lastMax.current = m;
    redrawAll(eg.ctx, canvasW.current, H.current, liveSlice, m, SCROLL_DURATION_MS, eg.smoothGraph.current, SMOOTH_RADIUS);
    if (wasZoomedIn) {
      clearTimeout(refetchTimer);
      refetchTimer = setTimeout(() => dispatch.current(fetchHistoryPreload(SCROLL_DURATION_MS)), 300);
    }
  }

  resetLookbackRef.current = onDblClick;

  return { onWheel, onDblClick, clearRefetchTimer: () => clearTimeout(refetchTimer) };
}

// ── Event listener registration ───────────────────────────────────────────────

export function attachListeners(
  canvas: HTMLCanvasElement,
  mouse: ReturnType<typeof createMouseHandlers>,
  touch: ReturnType<typeof createTouchHandlers>,
  wheel: ReturnType<typeof createWheelHandlers>,
): () => void {
  const { onMouseDown, onMouseUpGlobal, onDocumentMouseMove, onMouseMove, onMouseLeave } = mouse;
  const { onTouchStart, onTouchMove, onTouchEnd } = touch;
  const { onWheel, onDblClick, clearRefetchTimer } = wheel;

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("dblclick", onDblClick);
  canvas.addEventListener("touchstart", onTouchStart, { passive: true });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd);
  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("mouseup", onMouseUpGlobal);

  return () => {
    clearRefetchTimer();
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("dblclick", onDblClick);
    canvas.removeEventListener("touchstart", onTouchStart);
    canvas.removeEventListener("touchmove", onTouchMove);
    canvas.removeEventListener("touchend", onTouchEnd);
    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onMouseUpGlobal);
  };
}
