import styles from "./TopBar.module.css";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 1, ...(onClick ? { cursor: "pointer" } : {}) }}
      onClick={onClick}
    >
      <span className={styles.logo}>ETHTPS.info</span>
      <span style={{ fontSize: 10, color: "var(--mantine-color-dimmed)", lineHeight: 1, userSelect: "none" }}>
        Real-time throughput across Ethereum and its ecosystem
      </span>
    </div>
  );
}
