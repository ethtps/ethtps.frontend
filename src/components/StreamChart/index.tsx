import { ActionIcon, Card, Text, Tooltip } from "@mantine/core";
import { IconMaximize } from "@tabler/icons-react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
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
  const excludeLowThroughputRedux = useSelector((s: RootState) => s.ui.excludeLowThroughputChains);
  const excludeLowThroughput = excludeProp ?? excludeLowThroughputRedux;
  const metric = useSelector((s: RootState) => s.ui.metric);

  const resetLookbackRef = useRef<() => void>(() => {});
  const { isFullscreen, setIsFullscreen } = useFullscreen(resetLookbackRef);
  const { canvasRef, overlayRef, wrapRef, tooltip } = useChartEngine(
    excludeLowThroughput,
    isFullscreen,
    resetLookbackRef,
  );

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
