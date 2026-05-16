import { Group } from "@mantine/core";
import styles from "./TopBar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { GitHubStarButton } from "./GitHubStarButton";
import { MetricToggle } from "./MetricToggle";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme();

  useEffect(() => {
    mantineSetColorScheme(colorScheme);
  }, [colorScheme, mantineSetColorScheme]);

  return (
    <Group h="100%" px="md" justify="space-between">
      <span className={styles.logo}>ETHTPS.info</span>
      <Group gap="sm">
        <GitHubStarButton />
        <MetricToggle />
        <ThemeToggle />
      </Group>
    </Group>
  );
}
