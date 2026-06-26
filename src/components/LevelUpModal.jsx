import { LEVEL_INFO } from "../utils/constants";
import styles from "./LevelUpModal.module.css";

export default function LevelUpModal({ levelNum, onClose }) {
  const info = LEVEL_INFO[levelNum] ?? LEVEL_INFO[1];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.confetti}>🎉✨🎊⭐🎉</div>
        <span className={styles.bigEmoji}>{info.emoji}</span>
        <h2 className={styles.title}>Level Up!</h2>
        <p className={styles.levelText}>
          You're now Level {levelNum} — <span style={{ color: info.color }}>{info.label}</span>!
        </p>
        <p className={styles.sub}>New activities unlocked for your level 🚀</p>
        <button className={styles.btn} onClick={onClose}>Awesome! 🎉</button>
      </div>
    </div>
  );
}