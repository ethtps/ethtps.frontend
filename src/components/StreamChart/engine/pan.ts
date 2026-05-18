import { fetchOlderHistory } from "./history";
import { redrawLive, redrawPanned } from "./render";
import { EngineCtx } from "./types";

export function snapToLive(eg: EngineCtx): void {
  const { panOffset, isDragging, dragStartPan, isPanned, setIsPanned, needsLiveRedraw, canvas } = eg;
  const oldPan = panOffset.current;
  if (oldPan === 0) return;
  panOffset.current = 0;
  // Re-anchor drag so the next onDrag(dx) continues smoothly from 0
  if (isDragging.current) dragStartPan.current -= oldPan;
  isPanned.current = false;
  setIsPanned.current(false);
  needsLiveRedraw.current = true;
  canvas.style.cursor = "grab";
}

export function onDrag(eg: EngineCtx, dx: number): void {
  const { history, streamW, lookbackMs, panOffset, dragStartPan, isPanned, setIsPanned, needsLiveRedraw, isFetchingHistory, noMoreHistory, bufferOldestTs } = eg;
  const sw = streamW.current;
  const maxPan = Math.max(0, history.length - sw);
  const newPan = Math.max(0, Math.min(maxPan, Math.round(dragStartPan.current + dx)));
  panOffset.current = newPan;

  // Trigger prefetch based on timestamps so that a successful fetch (which shifts both
  // history.length and panOffset by extraPx) actually moves the trigger condition false.
  if (newPan > 0 && !isFetchingHistory.current && !noMoreHistory.current) {
    const panOffsetMs = newPan * (lookbackMs.current / sw);
    const viewportLeftTs = Date.now() - lookbackMs.current - panOffsetMs;
    if (viewportLeftTs < bufferOldestTs.current + lookbackMs.current * 0.5) {
      fetchOlderHistory(eg);
    }
  }

  const nowPanned = newPan > 0;
  if (nowPanned !== isPanned.current) {
    isPanned.current = nowPanned;
    setIsPanned.current(nowPanned);
    if (!nowPanned) needsLiveRedraw.current = true;
  }
  if (nowPanned) {
    redrawPanned(eg);
  } else if (needsLiveRedraw.current) {
    needsLiveRedraw.current = false;
    redrawLive(eg);
  }
}
