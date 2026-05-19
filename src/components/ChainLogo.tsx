import { useState } from "react";
import { OpenAPI } from "../api/generated/core/OpenAPI";
import type { GetApiV1NetworksByChainIdLogoData } from "../api/generated/types.gen";

type Props = GetApiV1NetworksByChainIdLogoData & { size?: number };

export function ChainLogo({ chainId, size = 18 }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={`${OpenAPI.BASE}/api/v1/networks/${chainId}/logo`}
      width={size}
      height={size}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      style={{ borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}
