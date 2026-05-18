import styles from "./TopBar.module.css";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <a
      href="#"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <span className={styles.logo}>ETHTPS.info</span>
      <span
        style={{
          fontSize: 12,
          color: "var(--mantine-color-dimmed)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Real-time Ethereum throughput
      </span>
    </a>
  );
}
