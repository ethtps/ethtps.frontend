import { useEffect, useState } from "react";

// Module-level: src URL → blob object URL (string) or null (failed).
// Populated on first fetch; every re-mount reads from here synchronously.
const cache    = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

function fetchLogo(src: string): Promise<string | null> {
  const hit = cache.get(src);
  if (hit !== undefined) return Promise.resolve(hit);

  const existing = inFlight.get(src);
  if (existing) return existing;

  const p = fetch(src)
    .then(r => r.ok ? r.blob() : Promise.reject(r.status))
    .then(blob => {
      const url = URL.createObjectURL(blob);
      cache.set(src, url);
      return url;
    })
    .catch(() => {
      cache.set(src, null); // don't retry failed logos
      return null;
    })
    .finally(() => inFlight.delete(src));

  inFlight.set(src, p);
  return p;
}

interface Props { src: string; size?: number; }

export function ChainLogo({ src, size = 18 }: Props) {
  // Synchronous fast path: if this logo was already fetched this session, no flash
  const [url, setUrl] = useState<string | null>(() => cache.get(src) ?? null);

  useEffect(() => {
    let live = true;
    fetchLogo(src).then(u => { if (live) setUrl(u); });
    return () => { live = false; };
  }, [src]);

  if (!url) return null;
  return (
    <img
      src={url}
      width={size}
      height={size}
      alt=""
      aria-hidden
      style={{ borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}
