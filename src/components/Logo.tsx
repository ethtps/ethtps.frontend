import styles from "./TopBar.module.css";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <span
      className={styles.logo}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      ETHTPS.info
    </span>
  );
}
