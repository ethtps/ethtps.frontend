import { ActionIcon, Card, Group, Text, Tooltip } from "@mantine/core";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AXIS_W, HEIGHT, MAX_REDRAW_THRESHOLD, SCROLL_DURATION_MS, TIME_AXIS_H } from "./constants";
import { fillFromSnapshots, collectColumn } from "./columns";
import { paintAxis, paintColumnData, paintTimeAxis, paintCrosshair, redrawAll } from "./paint";
import { chainColor, hexToRgb } from "./utils";
import { ColumnData, TooltipState } from "./types";
import { OTHER_COLOR } from "./constants";
import { MetricToggle } from "../MetricToggle";
import { ThemeToggle } from "../ThemeToggle";

export function StreamChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(() => window.location.pathname === "/live");

  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const preloadedSnapshots = useSelector((s: RootState) => s.metrics.preloadedSnapshots);

  const liveRef = useRef(live);
  const networksRef = useRef(networks);
  const metricRef = useRef(metric);
  const colorSchemeRef = useRef(colorScheme);
  const preloadedRef = useRef(preloadedSnapshots);
  const isFullscreenRef = useRef(isFullscreen);
  const maxRef = useRef(1);
  const prevMetricRef = useRef(metric);
  const historyBufRef = useRef<ColumnData[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  // Dynamic dimension refs — updated by doResize
  const canvasWRef = useRef(0);
  const HRef = useRef(HEIGHT);
  const streamWRef = useRef(0);
  // Animation state refs — survive resize without restarting the rAF loop
  const lastMaxRef = useRef(1);
  const lastTsRef = useRef(0);
  const subPixelRef = useRef(0);

  liveRef.current = live;
  networksRef.current = networks;
  metricRef.current = metric;
  colorSchemeRef.current = colorScheme;
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

    const c: CanvasRenderingContext2D = ctx;
    const oc: CanvasRenderingContext2D = overlayCtx;
    const cvs: HTMLCanvasElement = canvas;
    ctxRef.current = c;

    const history = historyBufRef.current;
    let rafId: number;

    function doResize() {
      const newW = wrap!.clientWidth;
      if (newW === 0) return;
      // In fullscreen the wrap has explicit flex height; otherwise its height equals the canvas
      const newH = isFullscreenRef.current
        ? Math.max(wrap!.clientHeight - TIME_AXIS_H, HEIGHT)
        : HEIGHT;
      const newStreamW = newW - AXIS_W;

      // Proportionally rescale existing history to the new pixel width so data
      // always fills the full stream area after a resize (nearest-neighbour mapping)
      if (history.length > 0 && newStreamW !== streamWRef.current) {
        const oldLen = history.length;
        const rescaled: ColumnData[] = new Array(newStreamW);
        for (let i = 0; i < newStreamW; i++) {
          rescaled[i] = history[Math.min(Math.round((i / newStreamW) * oldLen), oldLen - 1)];
        }
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
      lastTsRef.current = 0; // prevent dt spike after resize

      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, newW, newH, history, maxRef.current);
    }

    // Initial sizing
    const initW = wrap.clientWidth || wrap.getBoundingClientRect().width;
    canvas.width = initW;
    canvas.height = HEIGHT + TIME_AXIS_H;
    overlay.width = initW;
    overlay.height = HEIGHT + TIME_AXIS_H;
    canvasWRef.current = initW;
    HRef.current = HEIGHT;
    streamWRef.current = initW - AXIS_W;

    if (preloadedRef.current.length > 0 && history.length === 0) {
      fillFromSnapshots(preloadedRef.current, history, streamWRef.current, networksRef.current, metricRef.current);
      if (history.length > 0) {
        lastMaxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
        maxRef.current = lastMaxRef.current;
        redrawAll(c, initW, HEIGHT, history, lastMaxRef.current);
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
        paintTimeAxis(c, W, streamW, H);
        prevMetricRef.current = metricRef.current;
      }

      subPixelRef.current += dt * (streamW / SCROLL_DURATION_MS);
      const px = Math.floor(subPixelRef.current);

      if (px >= 1) {
        subPixelRef.current -= px;
        const col = collectColumn(liveRef.current, networksRef.current, metricRef.current);

        for (let i = 0; i < px; i++) history.push(col);
        if (history.length > streamW) history.splice(0, history.length - streamW);

        maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);

        if (Math.abs(maxRef.current - lastMaxRef.current) / lastMaxRef.current > MAX_REDRAW_THRESHOLD) {
          lastMaxRef.current = maxRef.current;
          redrawAll(c, W, H, history, maxRef.current);
        } else {
          c.globalCompositeOperation = "copy";
          c.drawImage(cvs, -px, 0);
          c.globalCompositeOperation = "source-over";
          c.clearRect(W - px, 0, px, H);
          for (let i = 0; i < px; i++) {
            paintColumnData(c, W - px + i, H, col, maxRef.current);
          }
          paintAxis(c, H, maxRef.current);
          paintTimeAxis(c, W, streamW, H);
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

      paintCrosshair(oc, W, mx, my, maxRef.current, metricRef.current.toUpperCase(), colorSchemeRef.current === "dark", H);

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

    function onMouseLeave() {
      const W = canvasWRef.current;
      const H = HRef.current;
      setTooltip(null);
      oc.clearRect(0, 0, W, H + TIME_AXIS_H);
    }

    cvs.addEventListener("mousemove", onMouseMove);
    cvs.addEventListener("mouseleave", onMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      cvs.removeEventListener("mousemove", onMouseMove);
      cvs.removeEventListener("mouseleave", onMouseLeave);
      ctxRef.current = null;
    };
  }, []);

  useEffect(() => {
    const path = isFullscreen ? "/live" : "/";
    if (window.location.pathname !== path) history.pushState(null, "", path);
  }, [isFullscreen]);

  useEffect(() => {
    const onPop = () => setIsFullscreen(window.location.pathname === "/live");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
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
      redrawAll(ctx, W, HRef.current, history, max);
    }
  }, [preloadedSnapshots]);

  return (
    <div
      style={isFullscreen ? {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--mantine-color-body)",
        display: "flex",
        flexDirection: "column",
        padding: 12,
        boxSizing: "border-box",
      } : undefined}
    >
      <Card
        bg="transparent"
        p="md"
        mb={isFullscreen ? 0 : "md"}
        style={isFullscreen ? { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } : undefined}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Text size="sm" fw={600} c="dimmed" tt="uppercase">
            {metric} — live stream
          </Text>
          <Group gap="sm">
            {isFullscreen && (
              <>
                <MetricToggle />
                <ThemeToggle />
              </>
            )}
            <Tooltip label={isFullscreen ? "Minimize" : "Expand"} withArrow zIndex={10001}>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setIsFullscreen(f => !f)}
              >
                {isFullscreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </div>
        <div
          ref={wrapRef}
          style={{ position: "relative", ...(isFullscreen ? { flex: 1 } : {}) }}
        >
          <canvas ref={canvasRef} style={{ display: "block" }} />
          <canvas ref={overlayRef} style={{ display: "block", position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />
        </div>
      </Card>
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
            zIndex: 10000,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.name} — {tooltip.value.toFixed(2)} {metric.toUpperCase()}
        </div>
      )}
    </div>
  );
}
