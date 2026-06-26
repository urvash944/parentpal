import styles from "./SessionPlan.module.css";

const DIFF_COLOR = { easy: "#6BCB77", medium: "#FFD93D", hard: "#FF6B6B" };

export default function SessionPlan({ session, onStart, onRegenerate, loading }) {
  if (!session) return null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Today's Session</h1>
        <p className={styles.sessionName}>{session.sessionTitle}</p>
        <p className={styles.meta}>⏱ {session.totalMinutes} minutes · {session.activities.length} activities</p>
      </div>

      <div className={styles.encouragement}>
        💬 "{session.encouragement}"
      </div>

      <div className={styles.list}>
        {session.activities.map((act, i) => (
          <div key={act.id} className={styles.actCard}>
            <div className={styles.actNum}>{i + 1}</div>
            <div className={styles.actEmoji}>{act.emoji}</div>
            <div className={styles.actInfo}>
              <p className={styles.actTitle}>{act.title}</p>
              <p className={styles.actDesc}>{act.description}</p>
              <div className={styles.actMeta}>
                <span className={styles.actTime}>⏱ {act.minutes} min</span>
                <span className={styles.actXP}>⚡ +{act.xp} XP</span>
                <span
                  className={styles.actDiff}
                  style={{ color: DIFF_COLOR[act.difficulty] ?? "#888" }}
                >
                  ● {act.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total XP this session</span>
        <span className={styles.totalXP}>
          ⚡ {session.activities.reduce((s, a) => s + a.xp, 0)} XP
        </span>
      </div>

      <button className={styles.startBtn} onClick={onStart}>
        🚀 Start Session
      </button>
      <button
        className={styles.regenBtn}
        onClick={onRegenerate}
        disabled={loading}
      >
        {loading ? "Regenerating…" : "🔄 Generate New Session"}
      </button>
    </div>
  );
}