import { Anchor, Badge, Group, HoverCard, Stack, Table, Text } from "@mantine/core";
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

function typeColor(networkType: string | undefined, isTestnet: boolean | undefined): string {
  if (isTestnet) return "orange";
  switch (networkType?.toLowerCase()) {
    case "l1":
    case "mainnet": return "green";
    case "l2": return "blue";
    case "sidechain": return "grape";
    default: return "gray";
  }
}

export const ChainRow = memo(function ChainRow({ network, live, metric }: Props) {
  const stale = isStale(live?.timestamp);
  const rawValue = live ? live[metric] : null;
  const display = rawValue != null ? rawValue.toFixed(2) : "—";

  return (
    <Table.Tr>
      <Table.Td ta="center">
        <Group gap="xs" justify="center">
          <Text fw={600}>{network.name}</Text>
          <Text size="xs" c="dimmed">#{network.chainId}</Text>
        </Group>
      </Table.Td>
      <Table.Td ta="center">
        {network.networkType ? (
          <Badge color={typeColor(network.networkType, network.isTestnet)} variant="light" size="sm">
            {network.networkType}
            {network.isTestnet ? " · testnet" : ""}
          </Badge>
        ) : (
          <Text size="xs" c="dimmed">—</Text>
        )}
      </Table.Td>
      <Table.Td ta="center">
        <Text fw={500}>{display}</Text>
      </Table.Td>
      <Table.Td ta="center">
        {stale && config.rpcOverridesGithubUrl ? (
          <HoverCard width={220} shadow="md" withArrow openDelay={150} closeDelay={200}>
            <HoverCard.Target>
              <Badge color="orange" variant="dot" style={{ cursor: "help" }}>
                stale
              </Badge>
            </HoverCard.Target>
            <HoverCard.Dropdown p="sm">
              <Stack gap={4}>
                <Text size="xs" fw={500}>Stale for a long time?</Text>
                <Anchor
                  size="xs"
                  href={config.rpcOverridesGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add missing RPC URL
                </Anchor>
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        ) : (
          <Badge color={stale ? "orange" : "green"} variant="dot">
            {stale ? "stale" : "live"}
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  );
});
