import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";

export function DiscordButton() {
  return (
    <Tooltip label="Join our Discord" withArrow zIndex={10001}>
      <ActionIcon
        component="a"
        href="https://discord.gg/vs6vCnhd7u"
        target="_blank"
        rel="noopener noreferrer"
        variant="default"
        size="md"
        aria-label="Join Discord"
      >
        <IconBrandDiscord size={18} />
      </ActionIcon>
    </Tooltip>
  );
}
