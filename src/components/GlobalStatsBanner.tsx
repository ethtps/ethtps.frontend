import { Card, Group, Skeleton, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const UPDATE_INTERVAL_MS = Number(import.meta.env.VITE_TOTAL_TPS_UPDATE_INTERVAL_MS ?? 1000);

function formatGps(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toFixed(2);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="xl" fw={700}>
        {value}
      </Text>
    </div>
  );
}

export function GlobalStatsBanner() {
  const live = useSelector((s: RootState) => s.metrics.live);
  const global = useSelector((s: RootState) => s.metrics.global);
  const status = useSelector((s: RootState) => s.metrics.globalStatus);
  const wsConnected = useSelector((s: RootState) => s.metrics.wsConnected);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);

  // When WS is active, compute filtered totals from per-chain live data so that
  // sidechain/testnet toggles are reflected immediately. Fall back to the REST-
  // derived global (already filtered by the API) when WS hasn't connected yet.
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

  const [displayed, setDisplayed] = useState(filtered);

  useEffect(() => {
    const id = setInterval(() => setDisplayed(latestRef.current), UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const loading = status === "loading" && displayed === null;

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Group gap="xl">
        {loading ? (
          <>
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
          </>
        ) : displayed ? (
          <>
            <Stat label="Total TPS" value={displayed.totalTps.toFixed(2)} />
            <Stat label="Total GPS" value={formatGps(displayed.totalGps)} />
            <Stat label="Active Chains" value={String(displayed.activeChains)} />
          </>
        ) : (
          <Text c="dimmed">No global metrics available</Text>
        )}
      </Group>
    </Card>
  );
}
