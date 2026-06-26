import { useNavigate } from "react-router-dom";
import { useAuth }  from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import XPBar    from "../../components/XPBar";
import StatPill from "../../components/StatPill";
import { LEVEL_INFO } from "../../utils/constants";
import { getLevel }   from "../../firebase/firestore";
import { getGreeting } from "../../utils/xpUtils";
import styles from "./Dashboard.module.css";

const QUICK_CARDS = [
  { emoji: "📚", label: "Learn",   sub: "Stories, Math, Vocab",  path: "/learn",   color: "#4D96FF", bg: "#EBF4FF" },
  { emoji: "🎮", label: "Games",   sub: "Fun learning games",    path: "/games",   color: "#6BCB77", bg: "#EBF9EE" },
  { emoji: "🏆", label: "Rewards", sub: "Badges & achievements", path: "/rewards", color: "#FF9F43", bg: "#FFF4E5" },
];

export default function Dashboard() {
  const { user }                   = useAuth();
  const { activeChild, childList } = useChild();
  const navigate                   = useNavigate();

  const firstName = user?.displayName?.split(" ")[0] || "Parent";
  const greeting  = getGreeting();

  // Derive level info
  const levelNum  = activeChild?.level?.num ?? getLevel(activeChild?.age ?? 5).num;
  const lvlInfo   = LEVEL_INFO[levelNum] ?? LEVEL_INFO[1];

  return (
    <div className={styles.page}>

      {/* ── Top greeting ── */}
      <div className={styles.topBar}>
        <div>
          <p className={styles.greeting}>{greeting},</p>
          <h1 className={styles.name}>{firstName} 👋</h1>
        </div>
        <button
          className={styles.profileBtn}
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          {activeChild ? (
            <span className={styles.profileAvatar}>{activeChild.avatar}</span>
          ) : (
            <span className={styles.profileInitial}>
              {firstName[0].toUpperCase()}
            </span>
          )}
        </button>
      </div>

      {/* ── No child state ── */}
      {childList.length === 0 && (
        <div className={styles.emptyCard}>
          <span className={styles.emptyEmoji}>👶</span>
          <h2 className={styles.emptyTitle}>Add your child to begin!</h2>
          <p className={styles.emptySub}>Set up a profile so ParentPal can personalise every session.</p>
          <button
            className={styles.emptyBtn}
            onClick={() => navigate("/add-child")}
          >
            + Add Child Profile
          </button>
        </div>
      )}

      {/* ── Active child card ── */}
      {activeChild && (
        <>
          <div className={styles.childCard} style={{ borderColor: lvlInfo.color }}>
            {/* Header row */}
            <div className={styles.childCardTop}>
              <span className={styles.childAvatarLg}>{activeChild.avatar}</span>
              <div className={styles.childCardInfo}>
                <h2 className={styles.childCardName}>{activeChild.name}</h2>
                <span
                  className={styles.levelBadge}
                  style={{ background: lvlInfo.bg, color: lvlInfo.color }}
                >
                  {lvlInfo.emoji} Level {levelNum} — {lvlInfo.label}
                </span>
              </div>
            </div>

            {/* XP bar */}
            <div className={styles.xpSection}>
              <XPBar xp={activeChild.xp ?? 0} level={levelNum} />
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
              <StatPill emoji="🔥" value={activeChild.streak ?? 0}   label="Streak"  color="#FF6B6B" />
              <StatPill emoji="🪙" value={activeChild.coins  ?? 0}   label="Coins"   color="#E8A020" />
              <StatPill emoji="🎖" value={activeChild.badges?.length ?? 0} label="Badges" color="#6C63FF" />
            </div>
          </div>

          {/* ── Teach Me Today CTA ── */}
          <button
            className={styles.heroBtn}
            onClick={() => navigate("/learn")}
          >
            <span className={styles.heroBtnIcon}>🚀</span>
            <div className={styles.heroBtnText}>
              <span className={styles.heroBtnTitle}>Teach Me Today</span>
              <span className={styles.heroBtnSub}>Generate today's learning session</span>
            </div>
            <span className={styles.heroBtnArrow}>→</span>
          </button>

          {/* ── Level focus chips ── */}
          <div className={styles.focusRow}>
            <p className={styles.focusLabel}>Today's topics</p>
            <div className={styles.chips}>
              {lvlInfo.focus.map((f) => (
                <span key={f} className={styles.chip}>{f}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Quick access cards ── */}
      <p className={styles.sectionTitle}>Explore</p>
      <div className={styles.quickGrid}>
        {QUICK_CARDS.map((card) => (
          <button
            key={card.path}
            className={styles.quickCard}
            onClick={() => navigate(card.path)}
            style={{ "--card-color": card.color, "--card-bg": card.bg }}
          >
            <span className={styles.quickEmoji}>{card.emoji}</span>
            <span className={styles.quickLabel}>{card.label}</span>
            <span className={styles.quickSub}>{card.sub}</span>
          </button>
        ))}
      </div>

      {/* ── Multi-child switcher ── */}
      {childList.length > 1 && (
        <div className={styles.switcherSection}>
          <p className={styles.sectionTitle}>Switch Child</p>
          <div className={styles.switcher}>
            {childList.map((child) => (
              <button
                key={child.childId}
                className={`${styles.switchBtn} ${
                  activeChild?.childId === child.childId ? styles.switchActive : ""
                }`}
                onClick={() => navigate("/profile")}
              >
                <span className={styles.switchAvatar}>{child.avatar}</span>
                <span className={styles.switchName}>{child.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}