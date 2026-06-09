import { Badge, Button } from "@mantine/core";
import { useEffect, useState } from "react";

const REPO = "ethtps/ethtps.frontend";

export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => r.json())
      .then((d) => setStars(d.stargazers_count))
      .catch(() => {});
  }, []);

  const formatted =
    stars === null ? "—"
    : stars >= 1000 ? `${(stars / 1000).toFixed(1)}k`
    : String(stars);

  return (
    <Button
      component="a"
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      variant="default"
      size="xs"
      leftSection="☆"
      rightSection={
        <Badge size="xs" variant="light" color="gray" circle={false}>
          {formatted}
        </Badge>
      }
    >
      Star
    </Button>
  );
}
