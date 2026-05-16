import { TooltipState } from "./types";

interface Props {
  tooltip: TooltipState;
  metric: string;
}

export function ChartTooltip({ tooltip, metric }: Props) {
  return (
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
  );
}
