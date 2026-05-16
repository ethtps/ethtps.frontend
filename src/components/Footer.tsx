import { useState } from "react";

export function Footer() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%", padding: "0 16px" }}>
      <span style={{ fontSize: 12, color: "var(--mantine-color-dimmed)" }}>
        Vibecoded by{" "}
        <span
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ textDecoration: "underline", cursor: "default" }}
        >
          {hovered ? "Ethereum" : "Mister_Eth"}
        </span>
      </span>
      <a
        href="https://github.com/ethtps/ethtps.frontend"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: "var(--mantine-color-dimmed)", textDecoration: "none" }}
      >
        GitHub ↗
      </a>
    </div>
  );
}
