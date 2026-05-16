import { ActionIcon, Card, Group, Text, Tooltip } from "@mantine/core";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchHistoryPreload } from "../../store/metricsSlice";
import {
  AXIS_W,
  HEIGHT,
  MAX_LOOKBACK_MS,
  MAX_REDRAW_THRESHOLD,
  MIN_LOOKBACK_MS,
  SCROLL_DURATION_MS,
  TIME_AXIS_H,
} from "./constants";
import { fillFromSnapshots, collectColumn } from "./columns";
import {
  paintAxis,
  paintColumnData,
  paintTimeAxis,
  paintCrosshair,
  redrawAll,
} from "./paint";
import { chainColor, hexToRgb } from "./utils";
import { ColumnData, TooltipState } from "./types";
import { OTHER_COLOR } from "./constants";
import { Logo } from "../Logo";
import { MetricToggle } from "../MetricToggle";
import { ThemeToggle } from "../ThemeToggle";
import { ViewerCount } from "../ViewerCount";

export function StreamChart() {
  const dispatch = useDispatch<AppDispatch>();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(
    () => window.location.pathname === "/live",
  );

  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const preloadedSnapshots = useSelector(
    (s: RootState) => s.metrics.preloadedSnapshots,
  );

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
  const lookbackMsRef = useRef(SCROLL_DURATION_MS);

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
    let refetchTimer: ReturnType<typeof setTimeout> | undefined;

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
          rescaled[i] =
            history[
              Math.min(Math.round((i / newStreamW) * oldLen), oldLen - 1)
            ];
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
      redrawAll(c, newW, newH, history, maxRef.current, lookbackMsRef.current);
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
      fillFromSnapshots(
        preloadedRef.current,
        history,
        streamWRef.current,
        networksRef.current,
        metricRef.current,
      );
      if (history.length > 0) {
        lastMaxRef.current = history.reduce(
          (m, col) => Math.max(m, col.total),
          1,
        );
        maxRef.current = lastMaxRef.current;
        redrawAll(
          c,
          initW,
          HEIGHT,
          history,
          lastMaxRef.current,
          lookbackMsRef.current,
        );
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

      subPixelRef.current += dt * (streamW / lookbackMsRef.current);
      const px = Math.floor(subPixelRef.current);

      if (px >= 1) {
        subPixelRef.current -= px;
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
          Math.abs(maxRef.current - lastMaxRef.current) / lastMaxRef.current >
          MAX_REDRAW_THRESHOLD
        ) {
          lastMaxRef.current = maxRef.current;
          redrawAll(c, W, H, history, maxRef.current, lookbackMsRef.current);
        } else {
          c.globalCompositeOperation = "copy";
          c.drawImage(cvs, -px, 0);
          c.globalCompositeOperation = "source-over";
          c.clearRect(W - px, 0, px, H);
          for (let i = 0; i < px; i++) {
            paintColumnData(c, W - px + i, H, col, maxRef.current);
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

      paintCrosshair(
        oc,
        W,
        mx,
        my,
        maxRef.current,
        metricRef.current.toUpperCase(),
        colorSchemeRef.current === "dark",
        H,
        lookbackMsRef.current,
      );

      const [r, g, b, a] = c.getImageData(mx, my, 1, 1).data;
      if (a === 0) {
        setTooltip(null);
        return;
      }

      const histIdx = mx - (W - history.length);
      const col =
        histIdx >= 0 && histIdx < history.length ? history[histIdx] : null;

      const nets = networksRef.current;
      let name = "Unknown";
      let value = 0;

      const [or, og, ob] = hexToRgb(OTHER_COLOR);
      if (r === or && g === og && b === ob) {
        name = "Others";
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

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const oldLookback = lookbackMsRef.current;
      const factor = e.deltaY > 0 ? 1.25 : 1 / 1.25;
      const newLookback = Math.max(
        MIN_LOOKBACK_MS,
        Math.min(MAX_LOOKBACK_MS, oldLookback * factor),
      );
      if (newLookback === oldLookback) return;

      // Rescale history: zoom in = keep newest slice and stretch; zoom out = compress into right portion, pad left with empty
      if (history.length > 0) {
        const streamW = streamWRef.current;
        const rescaled: ColumnData[] = new Array(streamW);
        if (newLookback < oldLookback) {
          const keepCount = Math.max(
            1,
            Math.round((history.length * newLookback) / oldLookback),
          );
          const slice = history.slice(history.length - keepCount);
          for (let i = 0; i < streamW; i++)
            rescaled[i] =
              slice[
                Math.min(
                  Math.round((i / streamW) * slice.length),
                  slice.length - 1,
                )
              ];
        } else {
          const coveredPx = Math.min(
            streamW,
            Math.round((streamW * oldLookback) / newLookback),
          );
          const empty: ColumnData = { segments: [], total: 0 };
          for (let i = 0; i < streamW - coveredPx; i++) rescaled[i] = empty;
          for (let i = 0; i < coveredPx; i++)
            rescaled[streamW - coveredPx + i] =
              history[
                Math.min(
                  Math.round((i / coveredPx) * history.length),
                  history.length - 1,
                )
              ];
        }
        history.length = 0;
        for (const col of rescaled) history.push(col);
      }

      lookbackMsRef.current = newLookback;
      const W = canvasWRef.current;
      const H = HRef.current;
      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, W, H, history, maxRef.current, newLookback);

      if (newLookback > oldLookback) {
        clearTimeout(refetchTimer);
        refetchTimer = setTimeout(
          () => dispatchRef.current(fetchHistoryPreload()),
          300,
        );
      }
    }

    function onDblClick() {
      const oldLookback = lookbackMsRef.current;
      if (oldLookback === SCROLL_DURATION_MS) return;
      const streamW = streamWRef.current;
      if (history.length > 0) {
        const rescaled: ColumnData[] = new Array(streamW);
        if (SCROLL_DURATION_MS < oldLookback) {
          const keepCount = Math.max(
            1,
            Math.round((history.length * SCROLL_DURATION_MS) / oldLookback),
          );
          const slice = history.slice(history.length - keepCount);
          for (let i = 0; i < streamW; i++)
            rescaled[i] =
              slice[
                Math.min(
                  Math.round((i / streamW) * slice.length),
                  slice.length - 1,
                )
              ];
        } else {
          const coveredPx = Math.min(
            streamW,
            Math.round((streamW * oldLookback) / SCROLL_DURATION_MS),
          );
          const empty: ColumnData = { segments: [], total: 0 };
          for (let i = 0; i < streamW - coveredPx; i++) rescaled[i] = empty;
          for (let i = 0; i < coveredPx; i++)
            rescaled[streamW - coveredPx + i] =
              history[
                Math.min(
                  Math.round((i / coveredPx) * history.length),
                  history.length - 1,
                )
              ];
        }
        history.length = 0;
        for (const col of rescaled) history.push(col);
      }
      lookbackMsRef.current = SCROLL_DURATION_MS;
      const W = canvasWRef.current;
      const H = HRef.current;
      maxRef.current = history.reduce((m, col) => Math.max(m, col.total), 1);
      lastMaxRef.current = maxRef.current;
      redrawAll(c, W, H, history, maxRef.current, SCROLL_DURATION_MS);
    }

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        return;
      }
      if ((e.key === "f" || e.key === "F") && e.target === document.body)
        setIsFullscreen((f) => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

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
      redrawAll(ctx, W, HRef.current, history, max, lookbackMsRef.current);
    }
  }, [preloadedSnapshots]);

  return (
    <div
      style={
        isFullscreen
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "var(--mantine-color-body)",
              display: "flex",
              flexDirection: "column",
            }
          : undefined
      }
    >
      {isFullscreen && (
        <div
          style={{
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <Group gap="md" align="center">
            <Logo onClick={() => setIsFullscreen(false)} />
            <Text
              size="sm"
              fw={600}
              c="dimmed"
              tt="uppercase"
              style={{ paddingTop: 5 }}
            >
              {metric} - live stream
            </Text>
          </Group>
          <Group gap="sm">
            <ViewerCount />
            <MetricToggle />
            <ThemeToggle />
            <Tooltip label="Minimize" withArrow zIndex={10001}>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setIsFullscreen(false)}
              >
                <IconMinimize size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </div>
      )}
      <Card
        bg="transparent"
        p="md"
        mb={isFullscreen ? 0 : "md"}
        style={
          isFullscreen
            ? {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {!isFullscreen && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text size="sm" fw={600} c="dimmed" tt="uppercase">
              {metric} - live stream
            </Text>
            <Tooltip label="Expand" withArrow zIndex={10001}>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setIsFullscreen(true)}
              >
                <IconMaximize size={20} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
        <div
          ref={wrapRef}
          style={{ position: "relative", ...(isFullscreen ? { flex: 1 } : {}) }}
        >
          <canvas ref={canvasRef} style={{ display: "block" }} />
          <canvas
            ref={overlayRef}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </Card>
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
