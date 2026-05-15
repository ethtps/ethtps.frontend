import { ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ChainRow } from "./ChainRow";

export function ChainList() {
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const live = useSelector((s: RootState) => s.metrics.live);
  const metric = useSelector((s: RootState) => s.ui.metric);

  const sorted = useMemo(() => {
    return [...networks].sort((a, b) => {
      const aVal = live[a.chainId]?.[metric] ?? -1;
      const bVal = live[b.chainId]?.[metric] ?? -1;
      return (bVal ?? -1) - (aVal ?? -1);
    });
  }, [networks, live, metric]);

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
          {sorted.map((n) => (
            <ChainRow key={n.chainId} network={n} live={live[n.chainId]} metric={metric} />
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
