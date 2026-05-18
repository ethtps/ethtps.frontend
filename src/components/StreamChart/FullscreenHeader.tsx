import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconMinimize } from "@tabler/icons-react";
import { GlobalStatsBanner } from "../GlobalStatsBanner";
import { Logo } from "../Logo";
import { MetricToggle } from "../MetricToggle";
import { ThemeToggle } from "../ThemeToggle";
import { ViewerCount } from "../ViewerCount";

interface Props {
  metric: string;
  onClose: () => void;
}

export function FullscreenHeader({ metric, onClose }: Props) {
  return (
    <div
      style={{
        position: "relative",
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <GlobalStatsBanner minimized />
      </div>
      <Group gap="md" align="center">
        <Logo onClick={onClose} />
        <Text size="sm" fw={600} c="dimmed" tt="uppercase" style={{ paddingTop: 5 }}>
          {metric} - live stream
        </Text>
      </Group>
      <Group gap="sm">
        <ViewerCount />
        <MetricToggle />
        <ThemeToggle />
        <Tooltip label="Minimize" withArrow zIndex={10001}>
          <ActionIcon variant="subtle" size="lg" onClick={onClose}>
            <IconMinimize size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  );
}
