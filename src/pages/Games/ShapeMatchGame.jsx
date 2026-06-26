import { useState, useEffect } from "react";
import { useAuth }  from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import { generateShapeMatchGame } from "../../api/gamesAPI";
import { recordGameResult } from "../../firebase/firestore";
import GameShell from "../../components/GameShell";
import QuestionCard from "../../components/QuestionCard";
import styles from "./Game.module.css";
import { useToast } from "../../context/ToastContext";
import { BADGES } from "../../utils/constants";

export default function ShapeMatchGame({ onExit }) {
  const { user } = useAuth();
  const { activeChild } = useChild();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [round, setRound]     = useState(0);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);
  const [saved, setSaved]     = useState(false);
  const { showToast } = useToast();

 async function load() {
  setLoading(true); setError(""); setDone(false);
  setRound(0); setScore(0); setSaved(false);
  try {
    const d = await generateShapeMatchGame(activeChild);
    if (!d?.rounds?.length) throw new Error("empty");

    // Normalize: trim whitespace and fix casing so answer always matches an option exactly
    const normalized = {
      rounds: d.rounds.map((r) => {
        const correct = (r.correctName || "").trim();
        let options = (r.options || []).map((o) => (o || "").trim());

        // Ensure the correct answer is present in options with exact casing
        const matchIdx = options.findIndex(
          (o) => o.toLowerCase() === correct.toLowerCase()
        );
        if (matchIdx !== -1) {
          options[matchIdx] = correct; // force exact match
        } else {
          options[0] = correct; // fallback: ensure it's included
        }

        return { ...r, correctName: correct, options };
      }),
    };

    setData(normalized);
  } catch { setError("Couldn't load game. Try again."); }
  finally { setLoading(false); }
}

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  const rounds = data?.rounds ?? [];
  const xpEarned = score * 5;
  const coinsEarned = Math.floor(xpEarned / 5);

 useEffect(() => {
  if (done && !saved && user && activeChild) {
    (async () => {
      const result = await recordGameResult(
        user.uid,
        activeChild.childId,
        "shape-match",
        score,
        rounds.length,
        xpEarned,
        coinsEarned
      );

      showToast(
        `+${xpEarned} XP, +${coinsEarned} coins!`,
        "xp",
        "🪙"
      );

      if (result?.newBadges?.length > 0) {
        for (const badgeId of result.newBadges) {
          const badge = BADGES.find((b) => b.id === badgeId);

          if (badge) {
            setTimeout(() => {
              showToast(
                `Badge unlocked: ${badge.label}!`,
                "badge",
                badge.emoji
              );
            }, 600);
          }
        }
      }
    })();

    setSaved(true);
  }
}, [done]);

  return (
    <GameShell
      emoji="🔷" title="Shape Match"
      score={score} total={rounds.length}
      round={round} totalRounds={rounds.length}
      loading={loading} error={error} onRetry={load}
      done={done} xpEarned={xpEarned} coinsEarned={coinsEarned}
      onPlayAgain={load}
      onExit={onExit}
    >
      {data && !done && rounds[round] && (
        <div>
          <div className={styles.bigDisplay}>
            <span className={styles.shapeEmoji}>{rounds[round].shapeEmoji}</span>
          </div>
          <QuestionCard
            key={round}
            question="What shape is this?"
            options={rounds[round].options}
            answer={rounds[round].correctName}
            questionNum={round + 1}
            total={rounds.length}
            onCorrect={() => setScore((s) => s + 1)}
            onWrong={() => {}}
          />
          <button
            className={styles.nextBtn}
            onClick={() => {
              if (round + 1 >= rounds.length) setDone(true);
              else setRound((r) => r + 1);
            }}
          >
            {round + 1 >= rounds.length ? "Finish 🏆" : "Next →"}
          </button>
        </div>
      )}
    </GameShell>
  );
}