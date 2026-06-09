import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from ".";
import { GlobalMetricsResponse } from "./metricsSlice";

const UPDATE_INTERVAL_MS = Number(import.meta.env.VITE_TOTAL_TPS_UPDATE_INTERVAL_MS ?? 1000);

/**
 * Returns global TPS/GPS totals with sidechain/testnet filters applied,
 * throttled to at most one update per VITE_TOTAL_TPS_UPDATE_INTERVAL_MS.
 * When WS is active the totals are recomputed from per-chain live state so
 * filter toggles take effect immediately. Before WS connects the REST-derived
 * global value is returned (the API already applies the filters).
 */
export function useFilteredGlobalMetrics(): GlobalMetricsResponse | null {
  const live = useSelector((s: RootState) => s.metrics.live);
  const global = useSelector((s: RootState) => s.metrics.global);
  const wsConnected = useSelector((s: RootState) => s.metrics.wsConnected);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);

  const filtered = useMemo(() => {
    if (!wsConnected || Object.keys(live).length === 0) return global;

    const infoById = new Map(networks.map((n) => [n.chainId, n]));
    let totalTps = 0, totalGps = 0, activeChains = 0;

    for (const [idStr, m] of Object.entries(live)) {
      const info = infoById.get(Number(idStr));
      if (!includeSidechains && info?.networkType?.toLowerCase() === "sidechain") continue;
      if (!includeTestnets && info?.isTestnet) continue;
      if (m.tps != null) { totalTps += m.tps; activeChains++; }
      if (m.gps != null) totalGps += m.gps;
    }

    return { totalTps, totalGps, activeChains, computedAt: global?.computedAt ?? new Date().toISOString() };
  }, [live, networks, includeSidechains, includeTestnets, wsConnected, global]);

  const latestRef = useRef(filtered);
  latestRef.current = filtered;

  const [throttled, setThrottled] = useState(filtered);

  useEffect(() => {
    const id = setInterval(() => setThrottled(latestRef.current), UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return throttled;
}
