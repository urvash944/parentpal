import { useNavigate } from "react-router-dom";
import styles from "./SessionSummary.module.css";
import ConfettiBurst from "../../components/ConfettiBurst";

export default function SessionSummary({ session, totalXP, completed, onFinish }) {
  const navigate  = useNavigate();
  const coinsEarned = Math.floor(totalXP / 5);

  async function handleFinish() {
    await onFinish();
    navigate("/");
  }
  

return (
  <div className={styles.page}>
    <ConfettiBurst />

    <div className={styles.confetti}>🎉🌟🎊⭐🏆</div>
      <h1 className={styles.title}>Session Complete!</h1>
      <p className={styles.subtitle}>{session.sessionTitle}</p>

      <div className={styles.rewardCard}>
        <div className={styles.rewardRow}>
          <div className={styles.rewardItem}>
            <span className={styles.rewardEmoji}>⚡</span>
            <span className={styles.rewardValue}>{totalXP}</span>
            <span className={styles.rewardLabel}>XP Earned</span>
          </div>
          <div className={styles.rewardDivider} />
          <div className={styles.rewardItem}>
            <span className={styles.rewardEmoji}>🪙</span>
            <span className={styles.rewardValue}>{coinsEarned}</span>
            <span className={styles.rewardLabel}>Coins Earned</span>
          </div>
          <div className={styles.rewardDivider} />
          <div className={styles.rewardItem}>
            <span className={styles.rewardEmoji}>✅</span>
            <span className={styles.rewardValue}>{completed.length}</span>
            <span className={styles.rewardLabel}>Activities</span>
          </div>
        </div>
      </div>

      <div className={styles.actList}>
        {session.activities.map((act) => (
          <div key={act.id} className={styles.actRow}>
            <span className={styles.actEmoji}>{act.emoji}</span>
            <span className={styles.actName}>{act.title}</span>
            <span className={styles.actXP}>+{act.xp} XP ✅</span>
          </div>
        ))}
      </div>

      <div className={styles.encouragement}>
        ✨ {session.encouragement}
      </div>

      <button className={styles.homeBtn} onClick={handleFinish}>
        🏠 Back to Home
      </button>
    </div>
  );
}