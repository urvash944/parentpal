import { xpProgress, xpForNextLevel } from "../utils/xpUtils";
import styles from "./XPBar.module.css";

export default function XPBar({ xp = 0, level = 1 }) {
  const pct  = xpProgress(xp, level);
  const next = xpForNextLevel(level);

  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <span className={styles.xpText}>⚡ {xp} XP</span>
        <span className={styles.nextText}>Next level: {next} XP</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}