import { Anchor, ActionIcon, Badge, Group, HoverCard, Stack, Table, Text, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { toggleWatchlist } from "../store/watchlistSlice";
import { NetworkResponse } from "../store/networksSlice";
import { LiveMetricsResponse } from "../store/metricsSlice";
import { config } from "../config";
import { ChainLogo } from "./ChainLogo";

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

function InfoIcon({ label }: { label: string }) {
  return (
    <Tooltip label={label} withArrow multiline w={200} openDelay={100}>
      <Text
        component="span"
        size="xs"
        c="dimmed"
        style={{ cursor: "help", lineHeight: 1 }}
      >
        ⓘ
      </Text>
    </Tooltip>
  );
}

export const ChainRow = memo(function ChainRow({ network, live, metric }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const watched = useSelector((s: RootState) => s.watchlist.chainIds.includes(network.chainId));
  const stale = isStale(live?.timestamp);
  const rawValue = live ? live[metric] : null;
  const display = rawValue != null ? rawValue.toFixed(2) : "—";

  return (
    <Table.Tr>
      <Table.Td ta="center">
        <Group gap="xs" justify="center">
          <ActionIcon
            variant="subtle"
            size="xs"
            color={watched ? "yellow" : "gray"}
            onClick={() => dispatch(toggleWatchlist(network.chainId))}
            aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
          >
            {watched ? <IconStarFilled size={12} /> : <IconStar size={12} />}
          </ActionIcon>
          {network.logoUrl && <ChainLogo src={network.logoUrl} />}
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
              <Group gap={4} justify="center" style={{ display: "inline-flex" }}>
                <Badge color="orange" variant="dot" style={{ cursor: "help" }}>
                  stale
                </Badge>
                <InfoIcon label="No update received within the stale threshold. The RPC node may be down or misconfigured." />
              </Group>
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
