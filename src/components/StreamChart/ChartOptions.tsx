import { Switch } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  setExcludeLowThroughputChains,
  setIncludeSidechains,
  setIncludeTestnets,
} from "../../store/uiSlice";
import { AXIS_W } from "./constants";

export function ChartOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const excludeLowThroughput = useSelector((s: RootState) => s.ui.excludeLowThroughputChains);

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
          display: "block",
          background: "rgba(128,128,128,0.15)",
          border: "1px solid rgba(128,128,128,0.25)",
          borderRadius: 6,
          padding: "3px 8px",
          fontSize: 11,
          fontFamily: "inherit",
          cursor: "pointer",
          color: "var(--mantine-color-dimmed)",
          backdropFilter: "blur(4px)",
          letterSpacing: "0.03em",
          opacity: 1,
        }}
      >
        Options
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
      </div>
    </div>
  );
}
