import { useState } from "react";
import { useAuth }    from "../../context/AuthContext";
import { useChild }   from "../../context/ChildContext";
import { useSession } from "../../context/SessionContext";
import { useToast }   from "../../context/ToastContext";
import { generateSession } from "../../api/sessionAPI";
import { saveSession, updateChildXP, recordActivityCompletion, getUserDoc, updateChild } from "../../firebase/firestore";
import { BADGES } from "../../utils/constants";
import LevelUpModal from "../../components/LevelUpModal";
import SessionPlan     from "./SessionPlan";
import ActivityRunner  from "./ActivityRunner";
import SessionSummary  from "./SessionSummary";

import ReadingActivity from "./activities/ReadingActivity";
import MathActivity    from "./activities/MathActivity";
import VocabActivity   from "./activities/VocabActivity";
import ShapesActivity  from "./activities/ShapesActivity";
import AnimalsActivity from "./activities/AnimalsActivity";
import PoemActivity    from "./activities/PoemActivity";

import styles from "./Learn.module.css";

const ACTIVITY_CARDS = [
  { id: "reading", emoji: "📖", label: "Reading",   sub: "Stories & comprehension",    color: "#4D96FF", bg: "#EBF4FF" },
  { id: "math",    emoji: "🔢", label: "Math",       sub: "Numbers & problem solving",  color: "#6BCB77", bg: "#EBF9EE" },
  { id: "vocab",   emoji: "📝", label: "Vocabulary", sub: "Words & meanings",           color: "#FF9F43", bg: "#FFF4E5" },
  { id: "shapes",  emoji: "🔷", label: "Shapes",     sub: "Identify & match",           color: "#6C63FF", bg: "#EAE8FF" },
  { id: "animals", emoji: "🐾", label: "Animals",    sub: "Count & discover",           color: "#FF6B6B", bg: "#FFF0F0" },
  { id: "poem",    emoji: "🎵", label: "Poems",      sub: "Read & enjoy",               color: "#E879F9", bg: "#FDF4FF" },
];

export default function Learn() {
  const { user }        = useAuth();
  const { activeChild } = useChild();
  const { showToast }   = useToast();
  const {
    session, setSession,
    sessionDone, resetSession,
    totalXP, completed,
  } = useSession();

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [started, setStarted]       = useState(false);
  const [activeAct, setActiveAct]   = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);

  // ── Go back to library ──
  function goToLibrary() {
    setActiveAct(null);
  }

  // ── XP handler for individual activities ──
  async function handleActivityXP(xp, activityType, wasPerfect) {
    if (!user || !activeChild) return;
    try {
      const result = await recordActivityCompletion(
        user.uid, activeChild.childId, activityType, xp, wasPerfect
      );
      // Add coins
      const coins = Math.floor(xp / 5);
      if (coins > 0) {
        const userData = await getUserDoc(user.uid);
        const child = userData.children.find((c) => c.childId === activeChild.childId);
        if (child) {
          await updateChild(user.uid, { ...child, coins: (child.coins || 0) + coins });
        }
      }
      showToast(`+${xp} XP earned!`, "xp", "⚡");
      if (result?.newBadges?.length > 0) {
        for (const badgeId of result.newBadges) {
          const badge = BADGES.find((b) => b.id === badgeId);
          if (badge) setTimeout(() => showToast(`Badge unlocked: ${badge.label}!`, "badge", badge.emoji), 600);
        }
      }
      if (result?.leveledUp) {
        setTimeout(() => setLevelUpInfo(result.newLevelNum), 1200);
      }
    } catch (e) {
      console.error(e);
      showToast(`+${xp} XP earned!`, "xp", "⚡");
    }
    setActiveAct(null);
  }

  // ── Session generation ──
  async function handleGenerate() {
    if (!activeChild) { setError("Please add a child profile first."); return; }
    setError(""); setLoading(true);
    try {
      setSession(await generateSession(activeChild));
      setStarted(false);
    } catch {
      setError("Couldn't generate session. Check your Grok API key.");
    } finally { setLoading(false); }
  }

  async function handleSessionComplete() {
    if (!user || !activeChild) return;
    const coins = Math.floor(totalXP / 5);
    await updateChildXP(user.uid, activeChild.childId, totalXP, coins);
    await saveSession(user.uid, activeChild.childId, {
      sessionTitle: session.sessionTitle,
      totalMinutes: session.totalMinutes,
      activitiesCompleted: completed,
      xpEarned: totalXP,
      coinsEarned: coins,
    });
  }

  function handleReset() {
    resetSession();
    setStarted(false);
    setError("");
  }

  // ── Route to individual activities ──
  if (activeAct === "reading") return (
    <>
      <ReadingActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );
  if (activeAct === "math") return (
    <>
      <MathActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );
  if (activeAct === "vocab") return (
    <>
      <VocabActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );
  if (activeAct === "shapes") return (
    <>
      <ShapesActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );
  if (activeAct === "animals") return (
    <>
      <AnimalsActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );
  if (activeAct === "poem") return (
    <>
      <PoemActivity onXP={handleActivityXP} onBack={goToLibrary} />
      {levelUpInfo && <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
    </>
  );

  // ── Session flow ──
  if (sessionDone && session) return (
    <SessionSummary
      session={session} totalXP={totalXP} completed={completed}
      onFinish={async () => { await handleSessionComplete(); handleReset(); }}
    />
  );
  if (session && started) return <ActivityRunner onSessionComplete={handleSessionComplete} />;
  if (session && !started) return (
    <SessionPlan
      session={session}
      onStart={() => setStarted(true)}
      onRegenerate={handleGenerate}
      loading={loading}
    />
  );

  // ── Main library ──
  return (
    <>
      <div className={styles.page}>
        <h1 className={styles.title}>📚 Learn</h1>

        {activeChild && (
          <div className={styles.childBanner}>
            <span className={styles.bannerAvatar}>{activeChild.avatar}</span>
            <div>
              <p className={styles.bannerName}>{activeChild.name}</p>
              <p className={styles.bannerLevel}>
                {activeChild.level?.label ?? "Beginner"} · Age {activeChild.age}
              </p>
            </div>
          </div>
        )}

        <button
          className={styles.heroBtn}
          onClick={handleGenerate}
          disabled={loading || !activeChild}
        >
          {loading ? (
            <span className={styles.loadRow}>
              <span className={styles.spinner} /> Generating…
            </span>
          ) : (
            <>
              <span className={styles.heroBtnIcon}>🚀</span>
              <div className={styles.heroBtnText}>
                <span className={styles.heroBtnTitle}>Teach Me Today</span>
                <span className={styles.heroBtnSub}>Auto-generate a full 20-min session</span>
              </div>
              <span className={styles.heroBtnArrow}>→</span>
            </>
          )}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.sectionTitle}>Activity Library</p>
        <div className={styles.actGrid}>
          {ACTIVITY_CARDS.map((card) => (
            <button
              key={card.id}
              className={styles.actCard}
              style={{ "--c": card.color, "--bg": card.bg }}
              onClick={() => setActiveAct(card.id)}
              disabled={!activeChild}
            >
              <span className={styles.actEmoji}>{card.emoji}</span>
              <span className={styles.actLabel}>{card.label}</span>
              <span className={styles.actSub}>{card.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {levelUpInfo && (
        <LevelUpModal levelNum={levelUpInfo} onClose={() => setLevelUpInfo(null)} />
      )}
    </>
  );
}