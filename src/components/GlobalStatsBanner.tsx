import { Card, Group, Skeleton, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function formatGps(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toFixed(2);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="xl" fw={700}>
        {value}
      </Text>
    </div>
  );
}

export function GlobalStatsBanner() {
  const global = useSelector((s: RootState) => s.metrics.global);
  const status = useSelector((s: RootState) => s.metrics.globalStatus);

  const loading = status === "loading" && global === null;

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Group gap="xl">
        {loading ? (
          <>
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
          </>
        ) : global ? (
          <>
            <Stat label="Total TPS" value={global.totalTps.toFixed(2)} />
            <Stat label="Total GPS" value={formatGps(global.totalGps)} />
            <Stat label="Active Chains" value={String(global.activeChains)} />
          </>
        ) : (
          <Text c="dimmed">No global metrics available</Text>
        )}
      </Group>
    </Card>
  );
}
