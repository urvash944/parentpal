import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth }  from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import { getChildSessions, getChildGameResults, computeAnalytics } from "../../firebase/analytics";
import ScoreRing   from "../../components/ScoreRing";
import WeeklyChart from "../../components/WeeklyChart";
import styles from "./Analytics.module.css";

const KIND_ICON = {
  reading: "📖", math: "🔢", vocab: "📝", poem: "🎵",
  "animal-counting": "🐶", "shape-match": "🔷", "word-builder": "🔤",
  "memory-match": "🧠", "color-match": "🎨", session: "🚀",
};

export default function Analytics() {
  const { user } = useAuth();
  const { activeChild } = useChild();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState("");

  useEffect(() => {
  if (!activeChild) {
    setLoading(false);
    return;
  }

  load();
}, [activeChild]);

  async function load() {
  setLoading(true);
  setError("");
  try {
    const [sessions, games] = await Promise.all([
      getChildSessions(user.uid, activeChild.childId),
      getChildGameResults(user.uid, activeChild.childId),
    ]);
    setData(computeAnalytics(sessions, games));
  } catch (e) {
    console.error(e);
    setError(e?.message || "Failed to load analytics.");
  } finally {
    setLoading(false);
  }
}

  if (!activeChild) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.back} onClick={() => navigate("/profile")}>← Back</button>
          <h1 className={styles.title}>📊 Progress Analytics</h1>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>👶</span>
          <p>Add a child profile to see analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>Loading analytics…</p>
      </div>
    );
  }
  if (error) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.back}
          onClick={() => navigate("/profile")}
        >
          ← Back
        </button>

        <h1 className={styles.title}>📊 Progress Analytics</h1>
      </div>

      <div className={styles.empty}>
        <span className={styles.emptyEmoji}>⚠️</span>

        <p style={{ marginBottom: "12px" }}>
          {error}
        </p>

        <button
          onClick={load}
          className={styles.back}
        >
          🔄 Retry
        </button>
      </div>
    </div>
  );
}
  const { weekDays, totalActivitiesMonth, totalXPMonth, totalMinutesMonth, subjectScores, timeline, totalActivitiesAllTime } = data;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/profile")}>← Back</button>
        <h1 className={styles.title}>📊 Progress Analytics</h1>
      </div>

      <div className={styles.childBanner}>
        <span className={styles.bannerAvatar}>{activeChild.avatar}</span>
        <div>
          <p className={styles.bannerName}>{activeChild.name}</p>
          <p className={styles.bannerLevel}>{activeChild.level?.label ?? "Beginner"} · Age {activeChild.age}</p>
        </div>
      </div>

      {/* Subject scores */}
      <p className={styles.sectionTitle}>Subject Scores</p>
      {totalActivitiesAllTime === 0 ? (
        <div className={styles.emptyCard}>
          <span className={styles.emptyEmoji}>📈</span>
          <p>Complete activities to see subject scores grow!</p>
        </div>
      ) : (
        <div className={styles.scoreRow}>
          <ScoreRing score={subjectScores.reading} label="Reading" emoji="📖" color="#4D96FF" />
          <ScoreRing score={subjectScores.math}    label="Math"    emoji="🔢" color="#6BCB77" />
          <ScoreRing score={subjectScores.vocab}   label="Vocab"   emoji="📝" color="#FF9F43" />
        </div>
      )}

      {/* Weekly chart */}
      <p className={styles.sectionTitle}>This Week's Activity</p>
      <div className={styles.chartCard}>
        <WeeklyChart weekDays={weekDays} />
      </div>

      {/* Monthly summary */}
      <p className={styles.sectionTitle}>Last 30 Days</p>
      <div className={styles.monthRow}>
        <div className={styles.monthBox}>
          <span className={styles.monthEmoji}>✅</span>
          <span className={styles.monthVal}>{totalActivitiesMonth}</span>
          <span className={styles.monthLbl}>Activities</span>
        </div>
        <div className={styles.monthBox}>
          <span className={styles.monthEmoji}>⚡</span>
          <span className={styles.monthVal}>{totalXPMonth}</span>
          <span className={styles.monthLbl}>XP Earned</span>
        </div>
        <div className={styles.monthBox}>
          <span className={styles.monthEmoji}>⏱</span>
          <span className={styles.monthVal}>{totalMinutesMonth}</span>
          <span className={styles.monthLbl}>Minutes</span>
        </div>
      </div>

      {/* Recent activity timeline */}
      <p className={styles.sectionTitle}>Recent Activity</p>
      {timeline.length === 0 ? (
        <div className={styles.emptyCard}>
          <span className={styles.emptyEmoji}>📋</span>
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        <div className={styles.timeline}>
          {timeline.map((item) => (
            <div key={item.id} className={styles.timelineRow}>
              <span className={styles.timelineIcon}>
                {item.kind === "session" ? "🚀" : KIND_ICON[item.gameId] ?? "🎮"}
              </span>
              <div className={styles.timelineInfo}>
                <p className={styles.timelineTitle}>
                  {item.kind === "session" ? item.sessionTitle : formatGameName(item.gameId)}
                </p>
                <p className={styles.timelineDate}>{formatDate(item.date)}</p>
              </div>
              <div className={styles.timelineStats}>
                {item.kind === "game" && <span className={styles.timelineScore}>{item.score}/{item.total}</span>}
                <span className={styles.timelineXP}>+{item.xpEarned ?? item.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatGameName(id) {
  const map = {
    "animal-counting": "Animal Counting",
    "shape-match": "Shape Match",
    "word-builder": "Word Builder",
    "memory-match": "Memory Match",
    "color-match": "Color Match",
  };
  return map[id] ?? id;
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today - 86400000);
  if (d.toDateString() === today.toDateString()) return "Today, " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday, " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}