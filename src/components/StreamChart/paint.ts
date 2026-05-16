import { AXIS_W, HEIGHT, TIME_AXIS_H } from "./constants";
import { ColumnData } from "./types";
import { siFormat } from "./utils";

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

export function paintTimeAxis(ctx: CanvasRenderingContext2D, W: number, streamW: number) {
  ctx.clearRect(0, HEIGHT, W, TIME_AXIS_H);
  ctx.fillStyle = "#444";
  ctx.fillRect(AXIS_W, HEIGHT, streamW, 1);
  ctx.font = "10px monospace";
  ctx.textBaseline = "top";
  const tickCount = 4;
  for (let i = 0; i <= tickCount; i++) {
    const x = AXIS_W + Math.round((streamW * i) / tickCount);
    const seconds = -60 + (60 * i) / tickCount;
    const label = seconds === 0 ? "0s" : `${seconds}s`;
    ctx.fillStyle = "#444";
    ctx.fillRect(x, HEIGHT, 1, 4);
    ctx.fillStyle = "#888";
    ctx.textAlign = i === 0 ? "left" : i === tickCount ? "right" : "center";
    ctx.fillText(label, x, HEIGHT + 6);
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
) {
  const streamW = W - AXIS_W;
  const lineColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const chipBg = isDark ? "rgba(20,20,20,0.85)" : "rgba(230,230,230,0.92)";
  const chipFg = isDark ? "#eee" : "#111";

  ctx.clearRect(0, 0, W, HEIGHT + TIME_AXIS_H);
  ctx.save();

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(mx + 0.5, 0);
  ctx.lineTo(mx + 0.5, HEIGHT);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(AXIS_W, my + 0.5);
  ctx.lineTo(W, my + 0.5);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.font = "10px monospace";

  // Y-axis label
  const value = (1 - my / HEIGHT) * max;
  const yLabel = `${siFormat(value)} ${metricLabel}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const yTw = ctx.measureText(yLabel).width + 6;
  const yLY = Math.max(8, Math.min(my, HEIGHT - 8));
  ctx.fillStyle = chipBg;
  ctx.fillRect(2, yLY - 8, yTw, 16);
  ctx.fillStyle = chipFg;
  ctx.fillText(yLabel, 5, yLY);

  // Time-axis label
  const seconds = Math.round(-60 + (60 * (mx - AXIS_W)) / streamW);
  const tLabel = seconds === 0 ? "now" : `${seconds}s`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const tTw = ctx.measureText(tLabel).width + 6;
  const tLX = Math.max(AXIS_W + tTw / 2, Math.min(mx, W - tTw / 2));
  ctx.fillStyle = chipBg;
  ctx.fillRect(tLX - tTw / 2, HEIGHT + 3, tTw, 14);
  ctx.fillStyle = chipFg;
  ctx.fillText(tLabel, tLX, HEIGHT + 5);

  ctx.restore();
}

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  history: ColumnData[],
  max: number,
) {
  ctx.clearRect(0, 0, W, H + TIME_AXIS_H);
  const startX = W - history.length;
  for (let i = 0; i < history.length; i++) {
    paintColumnData(ctx, startX + i, H, history[i], max);
  }
  paintAxis(ctx, H, max);
  paintTimeAxis(ctx, W, W - AXIS_W);
}
