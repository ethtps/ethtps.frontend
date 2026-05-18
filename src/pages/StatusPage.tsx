import { AppShell, Badge, Group, ScrollArea, Skeleton, Table, Text, Title, Tooltip } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { getApiV1IngestionStatus } from "../api/generated/services.gen";
import { Footer } from "../components/Footer";
import { TopBar } from "../components/TopBar";

interface ChainStatus {
  chainId: number;
  name: string;
  lastBlockNumber: number | null;
  state: string;
  isStale: boolean;
}

interface IngestionStatus {
  reportedAt: string;
  chainCount: number;
  chains: ChainStatus[];
}

type FetchState =
  | { kind: "loading" }
  | { kind: "ok"; data: IngestionStatus; fetchedAt: number }
  | { kind: "down" }
  | { kind: "error"; message: string };

function timeAgo(isoString: string): string {
  const diffS = Math.round((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ${diffS % 60}s ago`;
  return `${Math.floor(diffS / 3600)}h ${Math.floor((diffS % 3600) / 60)}m ago`;
}

function OverallBadge({ chains }: { chains: ChainStatus[] }) {
  const hasError = chains.some((c) => c.state !== "ok");
  const hasStale = chains.some((c) => c.isStale);
  if (hasError) return <Badge color="red" size="lg">Degraded</Badge>;
  if (hasStale) return <Badge color="yellow" size="lg">Partially stale</Badge>;
  return <Badge color="green" size="lg">Operational</Badge>;
}

function StateBadge({ state, isStale }: { state: string; isStale: boolean }) {
  return (
    <Group gap={4} wrap="nowrap">
      <Badge color={state === "ok" ? "green" : "red"} size="sm" variant="light">
        {state}
      </Badge>
      {isStale && (
        <Badge color="yellow" size="sm" variant="light">stale</Badge>
      )}
    </Group>
  );
}

function sortChains(chains: ChainStatus[]): ChainStatus[] {
  return [...chains].sort((a, b) => {
    const scoreA = (a.state !== "ok" ? 2 : 0) + (a.isStale ? 1 : 0);
    const scoreB = (b.state !== "ok" ? 2 : 0) + (b.isStale ? 1 : 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });
}

export function StatusPage() {
  const [state, setState] = useState<FetchState>({ kind: "loading" });
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  async function fetchStatus() {
    try {
      const result = await getApiV1IngestionStatus();
      const data = result as IngestionStatus;
      if (!data || typeof data !== "object") {
        setState({ kind: "error", message: "Invalid response" });
        return;
      }
      setState({ kind: "ok", data, fetchedAt: Date.now() });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.status;
      if (status === 503) {
        setState({ kind: "down" });
      } else {
        setState({ kind: "error", message: String(err) });
      }
    }
  }

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 30_000);
    return () => clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick every second so "X ago" labels update live
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Suppress unused-variable warning for tick — it drives re-renders
  void tick;

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 36 }} padding="md">
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>

      <AppShell.Main>
        {state.kind === "loading" && (
          <>
            <Skeleton height={32} width={240} mb="sm" />
            <Skeleton height={16} width={200} mb="md" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={40} mb="xs" />
            ))}
          </>
        )}

        {state.kind === "down" && (
          <Group mt="xl" justify="center">
            <div style={{ textAlign: "center" }}>
              <Badge color="red" size="xl" mb="sm">Service unavailable</Badge>
              <Text c="dimmed" size="sm">
                The ingestion service is down or starting up (HTTP 503).
              </Text>
            </div>
          </Group>
        )}

        {state.kind === "error" && (
          <Group mt="xl" justify="center">
            <div style={{ textAlign: "center" }}>
              <Badge color="red" size="xl" mb="sm">Error</Badge>
              <Text c="dimmed" size="sm">{state.message}</Text>
            </div>
          </Group>
        )}

        {state.kind === "ok" && (() => {
          const { data } = state;
          const sorted = sortChains(data.chains ?? []);
          const staleCount = sorted.filter((c) => c.isStale).length;
          const errorCount = sorted.filter((c) => c.state !== "ok").length;

          return (
            <>
              <Group mb="xs" align="center" gap="md">
                <Title order={3}>Ingestion status</Title>
                <OverallBadge chains={sorted} />
              </Group>

              <Text c="dimmed" size="sm" mb="md">
                Reported {timeAgo(data.reportedAt)} &middot;{" "}
                {data.chainCount} chain{data.chainCount !== 1 ? "s" : ""}
                {errorCount > 0 && ` · ${errorCount} error${errorCount !== 1 ? "s" : ""}`}
                {staleCount > 0 && ` · ${staleCount} stale`}
              </Text>

              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Chain</Table.Th>
                      <Table.Th style={{ textAlign: "right" }}>Last block</Table.Th>
                      <Table.Th>State</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sorted.map((chain) => (
                      <Table.Tr key={chain.chainId}>
                        <Table.Td>
                          <Text size="sm">{chain.name}</Text>
                          <Text size="xs" c="dimmed">#{chain.chainId}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: "right" }}>
                          <Text size="sm" ff="monospace">
                            {chain.lastBlockNumber != null
                              ? chain.lastBlockNumber.toLocaleString()
                              : "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <StateBadge state={chain.state} isStale={chain.isStale} />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Tooltip label={new Date(state.fetchedAt).toLocaleTimeString()} withArrow>
                <Text size="xs" c="dimmed" mt="sm" style={{ cursor: "default" }}>
                  Refreshes every 30s
                </Text>
              </Tooltip>
            </>
          );
        })()}
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
