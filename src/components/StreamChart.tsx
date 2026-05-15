import { Card, Text } from "@mantine/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RootState } from "../store";

const THRESHOLD = 5;
const OTHER_COLOR = "#868e96";
const CHAIN_COLORS = [
  "#4dabf7",
  "#69db7c",
  "#ffa94d",
  "#da77f2",
  "#f783ac",
  "#a9e34b",
  "#63e6be",
  "#74c0fc",
  "#ff6b6b",
  "#ffe066",
];

function chainColor(id: string): string {
  return CHAIN_COLORS[Number(id) % CHAIN_COLORS.length] ?? OTHER_COLOR;
}

function formatTs(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function StreamChart() {
  const history = useSelector((s: RootState) => s.metrics.history);
  const live = useSelector((s: RootState) => s.metrics.live);
  const networks = useSelector((s: RootState) => s.networks.networks);
  const metric = useSelector((s: RootState) => s.ui.metric);

  const nameMap = useMemo(
    () => new Map(networks.map((n) => [String(n.chainId), n.name])),
    [networks],
  );

  // Chains currently at or above threshold determine which get their own stream.
  // Classification is stable for the whole visible window to avoid lines
  // appearing/disappearing mid-chart as values fluctuate around the boundary.
  const significantIds = useMemo(() => {
    return new Set(
      Object.entries(live)
        .filter(([, m]) => (m[metric] ?? 0) >= THRESHOLD)
        .map(([id]) => id),
    );
  }, [live, metric]);

  const significantList = useMemo(() => Array.from(significantIds), [significantIds]);

  const chartData = useMemo(() => {
    return history.map((snap) => {
      const point: Record<string, number> = { timestamp: snap.timestamp };
      let other = 0;
      for (const [id, chain] of Object.entries(snap.chains)) {
        const v = metric === "tps" ? (chain.tps ?? 0) : (chain.gps ?? 0);
        if (significantIds.has(id)) {
          point[id] = v;
        } else {
          other += v;
        }
      }
      point.__other = other;
      return point;
    });
  }, [history, metric, significantIds]);

  if (history.length < 2) return null;

  const labelFor = (key: string) =>
    key === "__other" ? "Other" : (nameMap.get(key) ?? `Chain ${key}`);

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Text size="sm" fw={600} mb="xs" c="dimmed" tt="uppercase">
        {metric} — last 60 s
      </Text>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatTs}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} width={40} />
          <Tooltip
            labelFormatter={(v) => formatTs(v as number)}
            formatter={(value, name) => [
              (value as number).toFixed(2),
              labelFor(name as string),
            ]}
          />
          {significantList.map((id) => (
            <Area
              key={id}
              type="linear"
              dataKey={id}
              stackId="s"
              stroke={chainColor(id)}
              fill={chainColor(id)}
              fillOpacity={0.55}
              isAnimationActive={false}
            />
          ))}

          <Area
            type="linear"
            dataKey="__other"
            stackId="s"
            stroke={OTHER_COLOR}
            fill={OTHER_COLOR}
            fillOpacity={0.35}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
