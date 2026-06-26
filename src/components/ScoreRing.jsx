import styles from "./ScoreRing.module.css";

export default function ScoreRing({ score, label, emoji, color }) {
  const circumference = 2 * Math.PI * 36; // r=36
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.wrap}>
      <div className={styles.ringWrap}>
        <svg width="84" height="84" viewBox="0 0 84 84">
          <circle cx="42" cy="42" r="36" fill="none" stroke="var(--clr-border)" strokeWidth="8" />
          <circle
            cx="42" cy="42" r="36" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 42 42)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className={styles.ringCenter}>
          <span className={styles.ringEmoji}>{emoji}</span>
          <span className={styles.ringScore}>{score}</span>
        </div>
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}