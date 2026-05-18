import { useState } from "react";
import { config } from "../config";

export function Footer() {
  const [nameHovered, setNameHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(config.donationAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%", padding: "0 16px" }}>
      <span style={{ fontSize: 12, color: "var(--mantine-color-dimmed)" }}>
        Vibecoded by{" "}
        <span
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
          style={{ textDecoration: "underline", cursor: "default" }}
        >
          {nameHovered ? "Ethereum" : "Mister_Eth"}
        </span>
      </span>
      {config.donationAddress && (
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Click to copy donation address"}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: 12,
            color: "var(--mantine-color-dimmed)",
            textDecorationLine: "underline",
            textDecorationStyle: "dotted",
            textUnderlineOffset: 3,
            fontFamily: "monospace",
            transition: "color 0.15s",
          }}
        >
          {copied ? "Copied!" : config.donationAddress}
        </button>
      )}
    </div>
  );
}
