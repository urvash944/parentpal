import styles from "./ActivityShell.module.css";
import { SkeletonActivity } from "./Skeleton";

export default function ActivityShell({
  emoji, title, topic,
  score, total, xpEarned,
  loading, error, onRetry,
  children,
  done, onDone,
  onBack,
}) {

  function handleBack() {
    if (onBack) {
      onBack();
    }
  }

  if (loading) return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <button className={styles.back} onClick={handleBack}>← Back</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerEmoji}>{emoji}</span>
          <div>
            <p className={styles.headerTitle}>{title}</p>
            <p className={styles.headerTopic}>Loading…</p>
          </div>
        </div>
      </div>
      <div className={styles.body}><SkeletonActivity /></div>
    </div>
  );

  if (error) return (
    <div className={styles.center}>
      <span className={styles.bigEmoji}>⚠️</span>
      <p className={styles.errorText}>{error}</p>
      <button className={styles.retryBtn} onClick={onRetry}>Try Again</button>
      <button
        className={styles.retryBtn}
        style={{ marginTop: 10, background: "var(--clr-border)", color: "var(--clr-text)" }}
        onClick={handleBack}
      >
        ← Back
      </button>
    </div>
  );

  if (done) return (
    <div className={styles.doneWrap}>
      <span className={styles.doneEmoji}>🎉</span>
      <h2 className={styles.doneTitle}>{title} Complete!</h2>
      <div className={styles.doneStats}>
        <div className={styles.doneStat}>
          <span className={styles.doneStatVal}>{score}/{total}</span>
          <span className={styles.doneStatLbl}>Correct</span>
        </div>
        <div className={styles.doneStatDiv} />
        <div className={styles.doneStat}>
          <span className={styles.doneStatVal}>+{xpEarned}</span>
          <span className={styles.doneStatLbl}>XP Earned</span>
        </div>
      </div>
      <button className={styles.doneBtn} onClick={onDone}>✅ Done</button>
      <button
        className={styles.retryBtn}
        onClick={onRetry}
        style={{ marginTop: 10 }}
      >
        🔄 Try Again
      </button>
      <button
        className={styles.retryBtn}
        onClick={handleBack}
        style={{ marginTop: 10, background: "var(--clr-border)", color: "var(--clr-text)" }}
      >
        ← Back to Learn
      </button>
    </div>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <button className={styles.back} onClick={handleBack}>← Back</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerEmoji}>{emoji}</span>
          <div>
            <p className={styles.headerTitle}>{title}</p>
            <p className={styles.headerTopic}>{topic}</p>
          </div>
        </div>
        <div className={styles.scoreBadge}>{score}/{total}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}