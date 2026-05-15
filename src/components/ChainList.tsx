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
  const [page, setPage] = useState(1);

  // Snapshot of live values used exclusively for sort order.
  // Updated on an interval so rows don't shuffle on every SignalR push.
  const [sortSnapshot, setSortSnapshot] = useState<Record<number, LiveMetricsResponse>>(live);
  const metricRef = useRef(metric);
  metricRef.current = metric;

  useEffect(() => {
    // Snap immediately when metric changes so order reflects the new key at once.
    setSortSnapshot(live);
  }, [metric]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => {
      setSortSnapshot((prev) => {
        // Only trigger a re-render if values actually changed.
        return prev === live ? prev : live;
      });
    }, config.sortIntervalMs);
    return () => clearInterval(id);
  }, [live]);

  const sorted = useMemo(() => {
    return [...networks].sort((a, b) => {
      const aVal = sortSnapshot[a.chainId]?.[metric] ?? -1;
      const bVal = sortSnapshot[b.chainId]?.[metric] ?? -1;
      return bVal - aVal;
    });
  }, [networks, sortSnapshot, metric]);

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
