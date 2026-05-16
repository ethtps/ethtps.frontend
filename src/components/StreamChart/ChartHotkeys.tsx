import React from "react";

const kbdStyle: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: 10,
  padding: "1px 4px",
  borderRadius: 3,
  border: "1px solid currentColor",
  opacity: 0.7,
};

export function ChartHotkeys() {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        justifyContent: "flex-end",
        marginTop: 6,
        opacity: 0.45,
        fontSize: 11,
        letterSpacing: "0.02em",
      }}
    >
      <span><kbd style={kbdStyle}>F</kbd> fullscreen</span>
      <span><kbd style={kbdStyle}>R</kbd> / double-click — reset zoom</span>
    </div>
  );
}
