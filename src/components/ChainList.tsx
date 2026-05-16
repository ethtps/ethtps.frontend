import { Group, Pagination, ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { config } from "../config";
import { RootState } from "../store";
import { LiveMetricsResponse } from "../store/metricsSlice";
import { ChainRow } from "./ChainRow";

export function ChainList() {
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const live = useSelector((s: RootState) => s.metrics.live);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const [page, setPage] = useState(1);

  const [sortSnapshot, setSortSnapshot] = useState<Record<number, LiveMetricsResponse>>(live);
  const metricRef = useRef(metric);
  metricRef.current = metric;

  useEffect(() => {
    setSortSnapshot(live);
  }, [metric]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => {
      setSortSnapshot((prev) => (prev === live ? prev : live));
    }, config.sortIntervalMs);
    return () => clearInterval(id);
  }, [live]);

  const filtered = useMemo(() => {
    return networks
      .filter((n) => includeTestnets || !n.isTestnet)
      .filter((n) => includeSidechains || (n.networkType?.toLowerCase() ?? "") !== "sidechain");
  }, [networks, includeTestnets, includeSidechains]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = sortSnapshot[a.chainId]?.[metric] ?? -1;
      const bVal = sortSnapshot[b.chainId]?.[metric] ?? -1;
      return bVal - aVal;
    });
  }, [filtered, sortSnapshot, metric]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [includeTestnets, includeSidechains]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / config.pageSize));
  const safePage = Math.min(page, totalPages);
  const pageSlice = sorted.slice((safePage - 1) * config.pageSize, safePage * config.pageSize);

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
      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Chain</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>{metric.toUpperCase()}</Table.Th>
              <Table.Th>Status</Table.Th>
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
