import { Group, Pagination, ScrollArea, Skeleton, Table, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { config } from "../config";
import { RootState } from "../store";
import { LiveMetricsResponse } from "../store/metricsSlice";
import { ChainRow } from "./ChainRow";

type SortCol = "chain" | "type" | "metric" | "status";
type SortDir = "asc" | "desc";

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span style={{ marginLeft: 4, opacity: active ? 0.8 : 0.25, fontSize: 10 }}>
      {active ? (dir === "asc" ? "▲" : "▼") : "▲▼"}
    </span>
  );
}

export function ChainList() {
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const live = useSelector((s: RootState) => s.metrics.live);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<SortCol>("metric");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");

  const [sortSnapshot, setSortSnapshot] = useState<Record<number, LiveMetricsResponse>>(live);
  const liveRef = useRef(live);
  liveRef.current = live;
  const metricRef = useRef(metric);
  metricRef.current = metric;

  function handleSort(col: SortCol) {
    setSortSnapshot(liveRef.current);
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "metric" ? "desc" : "asc");
    }
    setPage(1);
  }

  useEffect(() => {
    setSortSnapshot(liveRef.current);
  }, [metric]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => {
      setSortSnapshot(liveRef.current);
    }, config.sortIntervalMs);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      // Search bypasses testnet/sidechain filters so hidden chains are still findable
      return networks
        .filter((n) => n.enabled)
        .filter(
          (n) =>
            n.name.toLowerCase().includes(q) ||
            String(n.chainId).includes(q) ||
            (n.networkType?.toLowerCase() ?? "").includes(q),
        );
    }
    return networks
      .filter((n) => n.enabled)
      .filter((n) => includeTestnets || !n.isTestnet)
      .filter((n) => includeSidechains || (n.networkType?.toLowerCase() ?? "") !== "sidechain");
  }, [networks, includeTestnets, includeSidechains, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "chain":
          cmp = a.name.localeCompare(b.name);
          break;
        case "type": {
          const ta = (a.networkType ?? "") + (a.isTestnet ? "1" : "0");
          const tb = (b.networkType ?? "") + (b.isTestnet ? "1" : "0");
          cmp = ta.localeCompare(tb);
          break;
        }
        case "metric": {
          const aVal = sortSnapshot[a.chainId]?.[metric] ?? -1;
          const bVal = sortSnapshot[b.chainId]?.[metric] ?? -1;
          cmp = aVal - bVal;
          break;
        }
        case "status": {
          const now = Date.now();
          const aLive = live[a.chainId]?.timestamp
            ? now - new Date(live[a.chainId].timestamp).getTime() <= config.staleThresholdMs
            : false;
          const bLive = live[b.chainId]?.timestamp
            ? now - new Date(live[b.chainId].timestamp).getTime() <= config.staleThresholdMs
            : false;
          cmp = Number(aLive) - Number(bLive);
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortSnapshot, metric, sortCol, sortDir, live]);

  useEffect(() => {
    setPage(1);
  }, [includeTestnets, includeSidechains, search]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / config.pageSize));
  const safePage = Math.min(page, totalPages);
  const pageSlice = sorted.slice((safePage - 1) * config.pageSize, safePage * config.pageSize);

  const thStyle: React.CSSProperties = { cursor: "pointer", userSelect: "none", textAlign: "center" };

  if (networksStatus === "loading" && networks.length === 0) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={48} mb="xs" />
        ))}
      </>
    );
  }

  if (networksStatus === "error") {
    return <Text c="red">Failed to load networks.</Text>;
  }

  return (
    <>
      <TextInput
        placeholder="Search chains by name, ID or type…"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="sm"
        size="sm"
      />
      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={thStyle} onClick={() => handleSort("chain")}>
                Chain <SortIndicator active={sortCol === "chain"} dir={sortDir} />
              </Table.Th>
              <Table.Th style={thStyle} onClick={() => handleSort("type")}>
                Type <SortIndicator active={sortCol === "type"} dir={sortDir} />
              </Table.Th>
              <Table.Th style={thStyle} onClick={() => handleSort("metric")}>
                {metric.toUpperCase()} <SortIndicator active={sortCol === "metric"} dir={sortDir} />
              </Table.Th>
              <Table.Th style={thStyle} onClick={() => handleSort("status")}>
                Status <SortIndicator active={sortCol === "status"} dir={sortDir} />
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageSlice.map((n) => (
              <ChainRow key={n.chainId} network={n} live={live[n.chainId]} metric={metric} />
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={safePage} onChange={setPage} />
        </Group>
      )}
    </>
  );
}
