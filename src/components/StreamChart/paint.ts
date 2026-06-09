import { AXIS_W, HEIGHT, TIME_AXIS_H } from "./constants";
import { ColumnData, Segment } from "./types";
import { siFormat } from "./utils";

export function smoothColumn(history: ColumnData[], idx: number, radius: number): ColumnData {
  const colorMap = new Map<string, number>();
  let totalSum = 0;
  let count = 0;
  for (let di = -radius; di <= 0; di++) {
    const i = idx + di;
    if (i < 0) continue;
    count++;
    for (const seg of history[i].segments) {
      colorMap.set(seg.color, (colorMap.get(seg.color) ?? 0) + seg.value);
    }
    totalSum += history[i].total;
  }
  if (count === 0) return { segments: [], total: 0 };
  const segments: Segment[] = [];
  for (const [color, sum] of colorMap) {
    const avg = sum / count;
    if (avg > 0) segments.push({ color, value: avg });
  }
  return { segments, total: totalSum / count };
}

export function paintColumnData(
  ctx: CanvasRenderingContext2D,
  x: number,
  H: number,
  col: ColumnData,
  max: number,
) {
  if (col.total === 0 || max === 0) return;
  const scale = H / max;
  let y = H;
  for (const seg of col.segments) {
    if (seg.value === 0) continue;
    const h = Math.max(1, seg.value * scale);
    ctx.fillStyle = seg.color;
    ctx.fillRect(x, y - h, 1, h);
    y -= h;
  }
}

export function paintAxis(ctx: CanvasRenderingContext2D, H: number, max: number) {
  ctx.clearRect(0, 0, AXIS_W, H);
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const v = (max * i) / tickCount;
    const y = Math.round(H - (H * i) / tickCount);
    const labelY = i === 0 ? y - 10 : i === tickCount ? y + 10 : y;
    ctx.fillStyle = "#888";
    ctx.fillText(siFormat(v), AXIS_W - 5, labelY);
    ctx.fillStyle = "#444";
    ctx.fillRect(AXIS_W - 4, y, 4, 1);
  }
  ctx.fillStyle = "#444";
  ctx.fillRect(AXIS_W - 1, 0, 1, H);
}

function fmtTimeLabel(ms: number): string {
  if (ms === 0) return "0s";
  const totalS = Math.round(Math.abs(ms) / 1000);
  if (totalS < 60) return `-${totalS}s`;
  const m = Math.floor(totalS / 60);
  const s = totalS % 60;
  return s === 0 ? `-${m}m` : `-${m}m${s}s`;
}

export function paintTimeAxis(ctx: CanvasRenderingContext2D, W: number, streamW: number, H: number, lookbackMs: number, panOffsetMs = 0) {
  ctx.clearRect(0, H, W, TIME_AXIS_H);
  ctx.fillStyle = "#444";
  ctx.fillRect(AXIS_W, H, streamW, 1);
  ctx.font = "10px monospace";
  ctx.textBaseline = "top";
  const tickCount = 4;
  for (let i = 0; i <= tickCount; i++) {
    const x = AXIS_W + Math.round((streamW * i) / tickCount);
    const ms = -(lookbackMs + panOffsetMs) + (lookbackMs * i) / tickCount;
    const label = fmtTimeLabel(ms);
    ctx.fillStyle = "#444";
    ctx.fillRect(x, H, 1, 4);
    ctx.fillStyle = "#888";
    ctx.textAlign = i === 0 ? "left" : i === tickCount ? "right" : "center";
    ctx.fillText(label, x, H + 6);
  }
}

export function paintCrosshair(
  ctx: CanvasRenderingContext2D,
  W: number,
  mx: number,
  my: number,
  max: number,
  metricLabel: string,
  isDark: boolean,
  H: number,
  lookbackMs: number,
  panOffsetMs = 0,
) {
  const streamW = W - AXIS_W;
  const lineColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const chipBg = isDark ? "rgba(20,20,20,0.85)" : "rgba(230,230,230,0.92)";
  const chipFg = isDark ? "#eee" : "#111";

  ctx.clearRect(0, 0, W, H + TIME_AXIS_H);
  ctx.save();

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(mx + 0.5, 0);
  ctx.lineTo(mx + 0.5, H);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(AXIS_W, my + 0.5);
  ctx.lineTo(W, my + 0.5);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.font = "10px monospace";

  // Y-axis label
  const value = (1 - my / H) * max;
  const yLabel = `${siFormat(value)} ${metricLabel}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const yTw = ctx.measureText(yLabel).width + 6;
  const yLY = Math.max(8, Math.min(my, H - 8));
  ctx.fillStyle = chipBg;
  ctx.fillRect(2, yLY - 8, yTw, 16);
  ctx.fillStyle = chipFg;
  ctx.fillText(yLabel, 5, yLY);

  // Time-axis label
  const ms = -(lookbackMs + panOffsetMs) + (lookbackMs * (mx - AXIS_W)) / streamW;
  const tLabel = fmtTimeLabel(ms);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const tTw = ctx.measureText(tLabel).width + 6;
  const tLX = Math.max(AXIS_W + tTw / 2, Math.min(mx, W - tTw / 2));
  ctx.fillStyle = chipBg;
  ctx.fillRect(tLX - tTw / 2, H + 3, tTw, 14);
  ctx.fillStyle = chipFg;
  ctx.fillText(tLabel, tLX, H + 5);

  ctx.restore();
}

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  history: ColumnData[],
  max: number,
  lookbackMs: number,
  smooth = false,
  smoothRadius = 8,
  panOffsetMs = 0,
) {
  ctx.clearRect(0, 0, W, H + TIME_AXIS_H);
  const startX = W - history.length;
  for (let i = 0; i < history.length; i++) {
    const col = smooth ? smoothColumn(history, i, smoothRadius) : history[i];
    paintColumnData(ctx, startX + i, H, col, max);
  }
  paintAxis(ctx, H, max);
  paintTimeAxis(ctx, W, W - AXIS_W, H, lookbackMs, panOffsetMs);
}
