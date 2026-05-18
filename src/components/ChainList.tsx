import { Group, Pagination, ScrollArea, Skeleton, Table, Text, TextInput, Tooltip, SegmentedControl } from "@mantine/core";
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
  const watchlist = useSelector((s: RootState) => s.watchlist.chainIds);
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<SortCol>("metric");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [showWatchlist, setShowWatchlist] = useState(false);

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
    const base = networks
      .filter((n) => n.enabled)
      .filter((n) => includeTestnets || !n.isTestnet)
      .filter((n) => includeSidechains || (n.networkType?.toLowerCase() ?? "") !== "sidechain");
    return showWatchlist ? base.filter((n) => watchlist.includes(n.chainId)) : base;
  }, [networks, includeTestnets, includeSidechains, search, showWatchlist, watchlist]);

  const watchedSet = useMemo(() => new Set(watchlist), [watchlist]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aWatched = watchedSet.has(a.chainId);
      const bWatched = watchedSet.has(b.chainId);

      // Watchlisted chains always float to the top, sorted by throughput desc
      if (aWatched !== bWatched) return aWatched ? -1 : 1;
      if (aWatched && bWatched) {
        return (sortSnapshot[b.chainId]?.[metric] ?? -1) - (sortSnapshot[a.chainId]?.[metric] ?? -1);
      }

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
  }, [filtered, watchedSet, sortSnapshot, metric, sortCol, sortDir, live]);

  useEffect(() => {
    setPage(1);
  }, [includeTestnets, includeSidechains, search, showWatchlist]);

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
      <Group mb="sm" gap="sm">
        <TextInput
          placeholder="Search chains by name, ID or type…"
          leftSection={<IconSearch size={14} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          size="sm"
          style={{ flex: 1 }}
        />
        <SegmentedControl
          size="sm"
          value={showWatchlist ? "watchlist" : "all"}
          onChange={(v) => setShowWatchlist(v === "watchlist")}
          data={[
            { label: "All", value: "all" },
            {
              label: watchlist.length > 0 ? `★ Watchlist (${watchlist.length})` : "★ Watchlist",
              value: "watchlist",
            },
          ]}
        />
      </Group>
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
                {metric.toUpperCase()}{" "}
                <Tooltip
                  label={metric === "tps" ? "Transactions per second — how many transactions this chain processes each second" : "Gas per second — total gas consumed per second on this chain"}
                  withArrow multiline w={220} openDelay={100}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Text component="span" size="xs" c="dimmed" style={{ cursor: "help" }}>ⓘ</Text>
                </Tooltip>
                {" "}<SortIndicator active={sortCol === "metric"} dir={sortDir} />
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
