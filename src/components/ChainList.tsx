import { Group, Pagination, ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { config } from "../config";
import { RootState } from "../store";
import { ChainRow } from "./ChainRow";

export function ChainList() {
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const live = useSelector((s: RootState) => s.metrics.live);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    return [...networks].sort((a, b) => {
      const aVal = live[a.chainId]?.[metric] ?? -1;
      const bVal = live[b.chainId]?.[metric] ?? -1;
      return bVal - aVal;
    });
  }, [networks, live, metric]);

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
