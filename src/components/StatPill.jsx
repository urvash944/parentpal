import styles from "./StatPill.module.css";

export default function StatPill({ emoji, value, label, color }) {
  return (
    <div className={styles.pill}>
      <span className={styles.emoji}>{emoji}</span>
      <span className={styles.value} style={{ color }}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}