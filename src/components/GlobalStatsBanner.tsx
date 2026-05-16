import { Card, Checkbox, Group, Skeleton, Stack, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setIncludeSidechains, setIncludeTestnets } from "../store/uiSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const global = useSelector((s: RootState) => s.metrics.global);
  const status = useSelector((s: RootState) => s.metrics.globalStatus);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);

  const loading = status === "loading" && global === null;

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Group justify="space-between" align="flex-start">
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
        <Stack gap="xs" justify="center">
          <Checkbox
            label="Include testnets"
            checked={includeTestnets}
            onChange={(e) => dispatch(setIncludeTestnets(e.currentTarget.checked))}
          />
          <Checkbox
            label="Include sidechains"
            checked={includeSidechains}
            onChange={(e) => dispatch(setIncludeSidechains(e.currentTarget.checked))}
          />
        </Stack>
      </Group>
    </Card>
  );
}
