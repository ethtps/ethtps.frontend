import { ActionIcon, Group, SegmentedControl, Text, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setColorScheme, setMetric } from "../store/uiSlice";
import { useEffect } from "react";

export function TopBar() {
  const dispatch = useDispatch<AppDispatch>();
  const metric = useSelector((s: RootState) => s.ui.metric);
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme();

  useEffect(() => {
    mantineSetColorScheme(colorScheme);
  }, [colorScheme, mantineSetColorScheme]);

  function toggleScheme() {
    const next = colorScheme === "dark" ? "light" : "dark";
    dispatch(setColorScheme(next));
  }

  return (
    <Group h="100%" px="md" justify="space-between">
      <Text fw={900} size="xl" style={{ letterSpacing: -1 }}>
        <Text span c="blue" inherit>
          ETHTPS
        </Text>
        <Text span c="dimmed" fw={400} inherit>
          .info
        </Text>
      </Text>

      <Group gap="sm">
        <SegmentedControl
          size="xs"
          value={metric.toUpperCase()}
          onChange={(v) => dispatch(setMetric(v.toLowerCase() as "tps" | "gps"))}
          data={["TPS", "GPS"]}
        />
        <ActionIcon variant="subtle" onClick={toggleScheme} aria-label="Toggle color scheme">
          {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
