import { Text, Tooltip } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getApiV1MetricsViewers } from "../api/generated/services.gen";

export function ViewerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    function fetch() {
      getApiV1MetricsViewers()
        .then((res) => setCount(Number((res as { count: number })?.count)))
        .catch(() => {});
    }
    fetch();
    const id = setInterval(fetch, 10_000);
    return () => clearInterval(id);
  }, []);

  if (count === null) return null;

  return (
    <Tooltip
      label={`${count} ${count === 1 ? "person is" : "people are"} watching`}
      withArrow
      zIndex={10001}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "default" }}>
        <IconEye size={16} style={{ display: "block" }} />
        <Text component="span" size="sm" lh={1}>{count}</Text>
      </div>
    </Tooltip>
  );
}
