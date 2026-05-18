import { Group } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { memo, useEffect } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { AlertsButton } from "./AlertsModal";
import { DiscordButton } from "./DiscordButton";
import { GitHubStarButton } from "./GitHubStarButton";
import { Logo } from "./Logo";
import { MetricToggle } from "./MetricToggle";
import { ThemeToggle } from "./ThemeToggle";
import { ViewerCount } from "./ViewerCount";

export const TopBar = memo(function TopBar() {
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme();

  useEffect(() => {
    mantineSetColorScheme(colorScheme);
  }, [colorScheme, mantineSetColorScheme]);

  return (
    <Group h="100%" px="md" justify="space-between">
      <Logo />
      <Group gap="sm">
        <ViewerCount />
        <GitHubStarButton />
        <DiscordButton />
        <AlertsButton />
        <MetricToggle />
        <ThemeToggle />
      </Group>
    </Group>
  );
});
