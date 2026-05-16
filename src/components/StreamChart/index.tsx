import { Card, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AXIS_W, HEIGHT, MAX_REDRAW_THRESHOLD, SCROLL_DURATION_MS, TIME_AXIS_H } from "./constants";
import { fillFromSnapshots, collectColumn } from "./columns";
import { paintAxis, paintColumnData, paintTimeAxis, redrawAll } from "./paint";
import { chainColor, hexToRgb } from "./utils";
import { ColumnData, TooltipState } from "./types";
import { OTHER_COLOR } from "./constants";

export function StreamChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const preloadedSnapshots = useSelector((s: RootState) => s.metrics.preloadedSnapshots);

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
    canvas.height = HEIGHT + TIME_AXIS_H;

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
      fillFromSnapshots(preloadedRef.current, history, streamW, networksRef.current, metricRef.current);
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
        c.clearRect(0, 0, W, HEIGHT + TIME_AXIS_H);
        paintAxis(c, HEIGHT, 1);
        paintTimeAxis(c, W, streamW);
        prevMetricRef.current = metricRef.current;
      }

      subPixel += dt * PIXELS_PER_MS;
      const px = Math.floor(subPixel);

      if (px >= 1) {
        subPixel -= px;

        const col = collectColumn(liveRef.current, networksRef.current, metricRef.current);

        for (let i = 0; i < px; i++) history.push(col);
        if (history.length > streamW) history.splice(0, history.length - streamW);

        maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);

        if (Math.abs(maxRef.current - lastMax) / lastMax > MAX_REDRAW_THRESHOLD) {
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
          paintTimeAxis(c, W, streamW);
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
      if (a === 0) { setTooltip(null); return; }

      const histIdx = mx - (W - history.length);
      const col = histIdx >= 0 && histIdx < history.length ? history[histIdx] : null;

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

    function onMouseLeave() { setTooltip(null); }

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
    fillFromSnapshots(preloadedSnapshots, history, W - AXIS_W, networksRef.current, metricRef.current);
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
            transform: tooltip.x > window.innerWidth - 160 ? "translateX(calc(-100% - 28px))" : undefined,
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
