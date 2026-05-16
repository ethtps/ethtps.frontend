import { ActionIcon, Card, Text, Tooltip } from "@mantine/core";
import { IconMaximize } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  setExcludeLowThroughputChains,
  setIncludeSidechains,
  setIncludeTestnets,
  setSmoothGraph,
} from "../../store/uiSlice";
import { ChartHotkeys } from "./ChartHotkeys";
import { ChartOptions } from "./ChartOptions";
import { ChartTooltip } from "./ChartTooltip";
import { FullscreenHeader } from "./FullscreenHeader";
import { useChartEngine } from "./useChartEngine";
import { useFullscreen } from "./useFullscreen";

interface StreamChartProps {
  excludeLowThroughputChains?: boolean;
}

export function StreamChart({ excludeLowThroughputChains: excludeProp }: StreamChartProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const excludeLowThroughputRedux = useSelector((s: RootState) => s.ui.excludeLowThroughputChains);
  const excludeLowThroughput = excludeProp ?? excludeLowThroughputRedux;
  const metric = useSelector((s: RootState) => s.ui.metric);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const smoothGraph = useSelector((s: RootState) => s.ui.smoothGraph);

  const resetLookbackRef = useRef<() => void>(() => {});
  const { isFullscreen, setIsFullscreen } = useFullscreen(resetLookbackRef);
  const { canvasRef, overlayRef, wrapRef, tooltip } = useChartEngine(
    excludeLowThroughput,
    isFullscreen,
    resetLookbackRef,
  );

  // Capture URL search string before any effects can overwrite it
  const initialSearch = useRef(
    window.location.pathname === "/live" ? window.location.search : ""
  );
  // Skip option→URL sync on the first render so the parse effect can apply first
  const optionsSyncReady = useRef(false);

  // On direct navigation to /live?o=..., apply the encoded options to Redux
  useEffect(() => {
    if (!initialSearch.current) return;
    const o = new URLSearchParams(initialSearch.current).get("o") ?? "";
    dispatch(setIncludeTestnets(o.includes("tn")));
    dispatch(setIncludeSidechains(o.includes("sd")));
    dispatch(setExcludeLowThroughputChains(!o.includes("lt")));
    dispatch(setSmoothGraph(o.includes("sm")));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the URL in sync with current options while in fullscreen
  useEffect(() => {
    if (!optionsSyncReady.current) {
      optionsSyncReady.current = true;
      return;
    }
    if (!isFullscreen) return;
    const o = [
      includeTestnets ? "tn" : "",
      includeSidechains ? "sd" : "",
      !excludeLowThroughputRedux ? "lt" : "",
      smoothGraph ? "sm" : "",
    ].join("");
    history.replaceState(null, "", `/live${o ? `?o=${o}` : ""}`);
  }, [isFullscreen, includeTestnets, includeSidechains, excludeLowThroughputRedux, smoothGraph]);

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
        <FullscreenHeader metric={metric} onClose={() => setIsFullscreen(false)} />
      )}
      <Card
        bg="transparent"
        p="md"
        mb={isFullscreen ? 0 : "md"}
        style={
          isFullscreen
            ? { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }
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
              <ActionIcon variant="subtle" size="lg" onClick={() => setIsFullscreen(true)}>
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
          <ChartOptions />
        </div>
        <ChartHotkeys />
      </Card>
      {tooltip && <ChartTooltip tooltip={tooltip} metric={metric} />}
    </div>
  );
}
