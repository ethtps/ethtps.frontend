import { Card, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { LiveMetricsResponse, MetricsSnapshot } from "../store/metricsSlice";
import { NetworkResponse } from "../store/networksSlice";

const THRESHOLD = 5;
const OTHER_COLOR = "#868e96";
const CHAIN_COLORS = [
  "#4dabf7",
  "#69db7c",
  "#ffa94d",
  "#da77f2",
  "#f783ac",
  "#a9e34b",
  "#63e6be",
  "#74c0fc",
  "#ff6b6b",
  "#ffe066",
];
const HEIGHT = 400;
const AXIS_W = 48;
const SCROLL_DURATION_MS = 60_000;
const MAX_REDRAW_THRESHOLD = 0.01;

interface Segment {
  color: string;
  value: number;
}
interface ColumnData {
  segments: Segment[];
  total: number;
}
interface TooltipState {
  x: number;
  y: number;
  name: string;
  value: number;
}

function chainColor(id: string): string {
  return CHAIN_COLORS[Number(id) % CHAIN_COLORS.length] ?? OTHER_COLOR;
}

function siFormat(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  return v.toFixed(1);
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function collectColumn(
  live: Record<number, LiveMetricsResponse>,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
): ColumnData {
  const segments: Segment[] = [];
  let other = 0;
  let total = 0;
  for (const n of networks) {
    const v = live[n.chainId]?.[metric] ?? 0;
    if (v >= THRESHOLD) {
      segments.push({ color: chainColor(String(n.chainId)), value: v });
    } else {
      other += v;
    }
    total += v;
  }
  if (other > 0) segments.push({ color: OTHER_COLOR, value: other });
  return { segments, total };
}

function paintColumnData(
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

function paintAxis(ctx: CanvasRenderingContext2D, H: number, max: number) {
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

function snapshotToColumnData(
  snap: MetricsSnapshot,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
): ColumnData {
  if (Object.keys(snap.chains).length === 0) {
    const total = metric === "tps" ? snap.totalTps : snap.totalGps;
    return {
      segments: total > 0 ? [{ color: OTHER_COLOR, value: total }] : [],
      total,
    };
  }
  const segments: Segment[] = [];
  let other = 0;
  let total = 0;
  for (const n of networks) {
    const entry = snap.chains[String(n.chainId)];
    const v = (entry?.[metric] ?? 0) as number;
    if (v >= THRESHOLD) {
      segments.push({ color: chainColor(String(n.chainId)), value: v });
    } else {
      other += v;
    }
    total += v;
  }
  if (other > 0) segments.push({ color: OTHER_COLOR, value: other });
  return { segments, total };
}

function fillFromSnapshots(
  snapshots: MetricsSnapshot[],
  history: ColumnData[],
  streamW: number,
  networks: NetworkResponse[],
  metric: "tps" | "gps",
) {
  if (snapshots.length === 0 || streamW === 0) return;
  history.length = 0;
  const cols = snapshots.map((s) => snapshotToColumnData(s, networks, metric));
  const pxPerCol = streamW / cols.length;
  let carry = 0;
  for (const col of cols) {
    carry += pxPerCol;
    const px = Math.round(carry);
    carry -= px;
    for (let i = 0; i < px; i++) history.push(col);
  }
  if (history.length > streamW) history.splice(0, history.length - streamW);
}

function redrawAll(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  history: ColumnData[],
  max: number,
) {
  ctx.clearRect(0, 0, W, H);
  const startX = W - history.length;
  for (let i = 0; i < history.length; i++) {
    paintColumnData(ctx, startX + i, H, history[i], max);
  }
  paintAxis(ctx, H, max);
}

export function StreamChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const preloadedSnapshots = useSelector(
    (s: RootState) => s.metrics.preloadedSnapshots,
  );

  const liveRef = useRef(live);
  const networksRef = useRef(networks);
  const metricRef = useRef(metric);
  const preloadedRef = useRef(preloadedSnapshots);
  const maxRef = useRef(1);
  const prevMetricRef = useRef(metric);
  const historyBufRef = useRef<ColumnData[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasWRef = useRef(0);

  liveRef.current = live;
  networksRef.current = networks;
  metricRef.current = metric;
  preloadedRef.current = preloadedSnapshots;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const W = wrap.getBoundingClientRect().width;
    canvas.width = W;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c: CanvasRenderingContext2D = ctx;
    const cvs: HTMLCanvasElement = canvas;
    ctxRef.current = c;
    canvasWRef.current = W;

    const streamW = W - AXIS_W;
    const PIXELS_PER_MS = streamW / SCROLL_DURATION_MS;
    const history = historyBufRef.current;
    let lastMax = 1;
    let lastTs = 0;
    let subPixel = 0;
    let rafId: number;

    if (preloadedRef.current.length > 0 && history.length === 0) {
      fillFromSnapshots(
        preloadedRef.current,
        history,
        streamW,
        networksRef.current,
        metricRef.current,
      );
      if (history.length > 0) {
        lastMax = history.reduce((m, col) => Math.max(m, col.total), 1);
        maxRef.current = lastMax;
        redrawAll(c, W, HEIGHT, history, lastMax);
      }
    }

    function frame(ts: number) {
      const dt = lastTs === 0 ? 0 : ts - lastTs;
      lastTs = ts;

      if (metricRef.current !== prevMetricRef.current) {
        maxRef.current = 1;
        lastMax = 1;
        history.length = 0;
        c.clearRect(0, 0, W, HEIGHT);
        prevMetricRef.current = metricRef.current;
      }

      subPixel += dt * PIXELS_PER_MS;
      const px = Math.floor(subPixel);

      if (px >= 1) {
        subPixel -= px;

        const col = collectColumn(
          liveRef.current,
          networksRef.current,
          metricRef.current,
        );

        for (let i = 0; i < px; i++) history.push(col);
        if (history.length > streamW)
          history.splice(0, history.length - streamW);

        maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);

        if (
          Math.abs(maxRef.current - lastMax) / lastMax >
          MAX_REDRAW_THRESHOLD
        ) {
          lastMax = maxRef.current;
          redrawAll(c, W, HEIGHT, history, maxRef.current);
        } else {
          c.globalCompositeOperation = "copy";
          c.drawImage(cvs, -px, 0);
          c.globalCompositeOperation = "source-over";
          c.clearRect(W - px, 0, px, HEIGHT);
          for (let i = 0; i < px; i++) {
            paintColumnData(c, W - px + i, HEIGHT, col, maxRef.current);
          }
          paintAxis(c, HEIGHT, maxRef.current);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    function onMouseMove(e: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      const mx = Math.round(e.clientX - rect.left);
      const my = Math.round(e.clientY - rect.top);

      if (mx < AXIS_W || mx >= W || my < 0 || my >= HEIGHT) {
        setTooltip(null);
        return;
      }

      const [r, g, b, a] = c.getImageData(mx, my, 1, 1).data;
      if (a === 0) {
        setTooltip(null);
        return;
      }

      // Map canvas x back to the history entry for that column
      const histIdx = mx - (W - history.length);
      const col =
        histIdx >= 0 && histIdx < history.length ? history[histIdx] : null;

      // Reverse-map pixel color to chain name and stored value
      const nets = networksRef.current;
      let name = "Unknown";
      let value = 0;

      const [or, og, ob] = hexToRgb(OTHER_COLOR);
      if (r === or && g === og && b === ob) {
        name = "Other";
        value = col?.segments.find((s) => s.color === OTHER_COLOR)?.value ?? 0;
      } else {
        for (const n of nets) {
          const color = chainColor(String(n.chainId));
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
    }

    cvs.addEventListener("mousemove", onMouseMove);
    cvs.addEventListener("mouseleave", onMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      cvs.removeEventListener("mousemove", onMouseMove);
      cvs.removeEventListener("mouseleave", onMouseLeave);
      ctxRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (preloadedSnapshots.length === 0) return;
    const W = canvasWRef.current;
    const history = historyBufRef.current;
    fillFromSnapshots(
      preloadedSnapshots,
      history,
      W - AXIS_W,
      networksRef.current,
      metricRef.current,
    );
    const ctx = ctxRef.current;
    if (ctx && W > 0) {
      const max = history.reduce((m, col) => Math.max(m, col.total), 1);
      maxRef.current = max;
      redrawAll(ctx, W, HEIGHT, history, max);
    }
  }, [preloadedSnapshots]);

  return (
    <Card bg="transparent" p="md" mb="md">
      <Text size="sm" fw={600} mb="xs" c="dimmed" tt="uppercase">
        {metric} — live stream
      </Text>
      <div ref={wrapRef} style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 14,
            top: tooltip.y - 32,
            transform:
              tooltip.x > window.innerWidth - 160
                ? "translateX(calc(-100% - 28px))"
                : undefined,
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.name} — {tooltip.value.toFixed(2)} {metric.toUpperCase()}
        </div>
      )}
    </Card>
  );
}
