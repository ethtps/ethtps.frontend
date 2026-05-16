import { Switch } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  setExcludeLowThroughputChains,
  setIncludeSidechains,
  setIncludeTestnets,
  setSmoothGraph,
} from "../../store/uiSlice";
import { AXIS_W } from "./constants";

export function ChartOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const excludeLowThroughput = useSelector((s: RootState) => s.ui.excludeLowThroughputChains);
  const smoothGraph = useSelector((s: RootState) => s.ui.smoothGraph);

  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const open = hovered || locked;

  return (
    <div
      style={{ position: "absolute", top: 8, left: AXIS_W + 8, zIndex: 10, userSelect: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => setLocked((l) => !l)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          background: open ? "rgba(128,128,128,0.25)" : "rgba(128,128,128,0.15)",
          border: "1px solid rgba(128,128,128,0.25)",
          borderRadius: 6,
          padding: 0,
          cursor: "pointer",
          color: "var(--mantine-color-dimmed)",
          backdropFilter: "blur(4px)",
          transition: "background 0.15s ease",
        }}
        aria-label="Chart options"
      >
        <IconAdjustments size={16} />
      </button>
      <div
        style={{
          marginTop: 6,
          background: "var(--mantine-color-body)",
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          pointerEvents: open ? "auto" : "none",
          transition: "max-height 0.2s ease, opacity 0.18s ease",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          whiteSpace: "nowrap",
        }}
      >
        <Switch
          size="xs"
          label="Testnets"
          checked={includeTestnets}
          onChange={(e) => dispatch(setIncludeTestnets(e.currentTarget.checked))}
        />
        <Switch
          size="xs"
          label="Sidechains"
          checked={includeSidechains}
          onChange={(e) => dispatch(setIncludeSidechains(e.currentTarget.checked))}
        />
        <Switch
          size="xs"
          label="Low-throughput"
          checked={!excludeLowThroughput}
          onChange={(e) => dispatch(setExcludeLowThroughputChains(!e.currentTarget.checked))}
        />
        <Switch
          size="xs"
          label="Smooth"
          checked={smoothGraph}
          onChange={(e) => dispatch(setSmoothGraph(e.currentTarget.checked))}
        />
      </div>
    </div>
  );
}
