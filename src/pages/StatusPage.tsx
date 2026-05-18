import { AppShell, Badge, Group, ScrollArea, Skeleton, Table, Text, Title, Tooltip } from "@mantine/core";
import { SearchInput } from "../components/SearchInput";
import { useEffect, useMemo, useRef, useState } from "react";
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

type SortCol = "chain" | "block" | "state";
type SortDir = "asc" | "desc";

function timeAgo(isoString: string): string {
  const diffS = Math.round((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ${diffS % 60}s ago`;
  return `${Math.floor(diffS / 3600)}h ${Math.floor((diffS % 3600) / 60)}m ago`;
}

function stateScore(c: ChainStatus) {
  return (c.state !== "ok" ? 2 : 0) + (c.isStale ? 1 : 0);
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span style={{ marginLeft: 4, opacity: active ? 0.8 : 0.25, fontSize: 10 }}>
      {active ? (dir === "asc" ? "▲" : "▼") : "▲▼"}
    </span>
  );
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
      {isStale && <Badge color="yellow" size="sm" variant="light">stale</Badge>}
    </Group>
  );
}

export function StatusPage() {
  const [fetchState, setFetchState] = useState<FetchState>({ kind: "loading" });
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("state");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  async function fetchStatus() {
    try {
      const result = await getApiV1IngestionStatus();
      const data = result as IngestionStatus;
      if (!data || typeof data !== "object") {
        setFetchState({ kind: "error", message: "Invalid response" });
        return;
      }
      setFetchState({ kind: "ok", data, fetchedAt: Date.now() });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.status;
      if (status === 503) {
        setFetchState({ kind: "down" });
      } else {
        setFetchState({ kind: "error", message: String(err) });
      }
    }
  }

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 30_000);
    return () => clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  void tick;

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir(col === "state" ? "desc" : "asc");
    }
  }

  const thStyle: React.CSSProperties = { cursor: "pointer", userSelect: "none" };

  const chains = fetchState.kind === "ok" ? (fetchState.data.chains ?? []) : [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chains;
    return chains.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        String(c.chainId).includes(q) ||
        c.state.toLowerCase().includes(q),
    );
  }, [chains, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "chain":
          cmp = a.name.localeCompare(b.name);
          break;
        case "block":
          cmp = (a.lastBlockNumber ?? -1) - (b.lastBlockNumber ?? -1);
          break;
        case "state":
          cmp = stateScore(b) - stateScore(a);
          if (cmp === 0) cmp = a.name.localeCompare(b.name);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 36 }} padding="md">
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>

      <AppShell.Main>
        {fetchState.kind === "loading" && (
          <>
            <Skeleton height={32} width={240} mb="sm" />
            <Skeleton height={16} width={200} mb="md" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={40} mb="xs" />
            ))}
          </>
        )}

        {fetchState.kind === "down" && (
          <Group mt="xl" justify="center">
            <div style={{ textAlign: "center" }}>
              <Badge color="red" size="xl" mb="sm">Service unavailable</Badge>
              <Text c="dimmed" size="sm">
                The ingestion service is down or starting up (HTTP 503).
              </Text>
            </div>
          </Group>
        )}

        {fetchState.kind === "error" && (
          <Group mt="xl" justify="center">
            <div style={{ textAlign: "center" }}>
              <Badge color="red" size="xl" mb="sm">Error</Badge>
              <Text c="dimmed" size="sm">{fetchState.message}</Text>
            </div>
          </Group>
        )}

        {fetchState.kind === "ok" && (() => {
          const { data } = fetchState;
          const staleCount = chains.filter((c) => c.isStale).length;
          const errorCount = chains.filter((c) => c.state !== "ok").length;

          return (
            <>
              <Group mb="xs" align="center" gap="md">
                <Title order={3}>Ingestion status</Title>
                <OverallBadge chains={chains} />
              </Group>

              <Text c="dimmed" size="sm" mb="md">
                Reported {timeAgo(data.reportedAt)} &middot;{" "}
                {data.chainCount} chain{data.chainCount !== 1 ? "s" : ""}
                {errorCount > 0 && ` · ${errorCount} error${errorCount !== 1 ? "s" : ""}`}
                {staleCount > 0 && ` · ${staleCount} stale`}
              </Text>

              <SearchInput
                placeholder="Search by name, ID or state…"
                value={search}
                onChange={setSearch}
                mb="sm"
              />

              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={thStyle} onClick={() => handleSort("chain")}>
                        Chain <SortIndicator active={sortCol === "chain"} dir={sortDir} />
                      </Table.Th>
                      <Table.Th style={{ ...thStyle, textAlign: "right" }} onClick={() => handleSort("block")}>
                        Last block <SortIndicator active={sortCol === "block"} dir={sortDir} />
                      </Table.Th>
                      <Table.Th style={thStyle} onClick={() => handleSort("state")}>
                        State <SortIndicator active={sortCol === "state"} dir={sortDir} />
                      </Table.Th>
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
                    {sorted.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={3}>
                          <Text c="dimmed" size="sm" ta="center">No chains match your search.</Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Tooltip label={new Date(fetchState.fetchedAt).toLocaleTimeString()} withArrow>
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
