import { ActionIcon, Group, SegmentedControl, useMantineColorScheme } from "@mantine/core";
import styles from "./TopBar.module.css";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setColorScheme, setMetric } from "../store/uiSlice";
import { useEffect } from "react";
import { GitHubStarButton } from "./GitHubStarButton";

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
      <span className={styles.logo}>ETHTPS.info</span>

      <Group gap="sm">
        <GitHubStarButton />
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
