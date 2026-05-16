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
  ctx.clearRect(AXIS_W, HEIGHT, streamW, TIME_AXIS_H);
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
