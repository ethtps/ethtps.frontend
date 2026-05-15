import { Badge, Group, Table, Text } from "@mantine/core";
import { memo } from "react";
import { NetworkResponse } from "../store/networksSlice";
import { LiveMetricsResponse } from "../store/metricsSlice";
import { config } from "../config";

interface Props {
  network: NetworkResponse;
  live: LiveMetricsResponse | undefined;
  metric: "tps" | "gps";
}

function isStale(timestamp: string | undefined): boolean {
  if (!timestamp) return true;
  return Date.now() - new Date(timestamp).getTime() > config.staleThresholdMs;
}

export const ChainRow = memo(function ChainRow({ network, live, metric }: Props) {
  const stale = isStale(live?.timestamp);
  const rawValue = live ? live[metric] : null;
  const display = rawValue != null ? rawValue.toFixed(2) : "—";

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="xs">
          <Text fw={600}>{network.name}</Text>
          <Text size="xs" c="dimmed">
            #{network.chainId}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={500}>{display}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color={stale ? "gray" : "green"} variant="dot">
          {stale ? "stale" : "live"}
        </Badge>
      </Table.Td>
    </Table.Tr>
  );
});
