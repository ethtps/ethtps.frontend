import { Card, Group, Skeleton, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useFilteredGlobalMetrics } from "../store/useFilteredGlobalMetrics";

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

interface Props {
  minimized?: boolean;
}

export function GlobalStatsBanner({ minimized }: Props) {
  const status = useSelector((s: RootState) => s.metrics.globalStatus);
  const metrics = useFilteredGlobalMetrics();

  if (minimized) {
    return metrics
      ? (
        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
          {metrics.totalTps.toFixed(2)} TPS · {formatGps(metrics.totalGps)} GPS
        </Text>
      )
      : null;
  }

  const loading = status === "loading" && metrics === null;

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Group gap="xl">
        {loading ? (
          <>
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
            <Skeleton height={48} width={100} />
          </>
        ) : metrics ? (
          <>
            <Stat label="Total TPS" value={metrics.totalTps.toFixed(2)} />
            <Stat label="Total GPS" value={formatGps(metrics.totalGps)} />
            <Stat label="Active Chains" value={String(metrics.activeChains)} />
          </>
        ) : (
          <Text c="dimmed">No global metrics available</Text>
        )}
      </Group>
    </Card>
  );
}
