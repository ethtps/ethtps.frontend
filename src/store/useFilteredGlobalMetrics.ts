import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from ".";
import { GlobalMetricsResponse } from "./metricsSlice";

/**
 * Returns global TPS/GPS totals with sidechain and testnet filters applied.
 * When the WebSocket is active the totals are recomputed from per-chain live
 * state so filter toggles take effect immediately. Before WS connects the
 * REST-derived global value is returned (the API already applies the filters).
 */
export function useFilteredGlobalMetrics(): GlobalMetricsResponse | null {
  const live = useSelector((s: RootState) => s.metrics.live);
  const global = useSelector((s: RootState) => s.metrics.global);
  const wsConnected = useSelector((s: RootState) => s.metrics.wsConnected);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);

  return useMemo(() => {
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
}
