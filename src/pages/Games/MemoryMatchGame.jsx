import { useState, useEffect } from "react";
import { useAuth }  from "../../context/AuthContext";
import { useChild } from "../../context/ChildContext";
import { generateMemoryMatchGame } from "../../api/gamesAPI";
import { recordGameResult } from "../../firebase/firestore";
import GameShell from "../../components/GameShell";
import styles from "./Game.module.css";
import { useToast } from "../../context/ToastContext";
import { BADGES } from "../../utils/constants";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatchGame({ onExit }) {
  const { user } = useAuth();
  const { activeChild } = useChild();

  const [theme, setTheme]     = useState(null);
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [flipped, setFlipped] = useState([]);  // indices currently flipped
  const [matched, setMatched] = useState([]);  // indices matched
  const [moves, setMoves]     = useState(0);
  const [done, setDone]       = useState(false);
  const [saved, setSaved]     = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true); setError(""); setDone(false);
    setFlipped([]); setMatched([]); setMoves(0); setSaved(false);
    try {
      const d = await generateMemoryMatchGame(activeChild);
      if (!d?.emojis?.length) throw new Error("empty");
      setTheme(d.theme);
      const pairs = shuffle([...d.emojis, ...d.emojis]).map((emoji, i) => ({ id: i, emoji }));
      setCards(pairs);
    } catch { setError("Couldn't load game. Try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (activeChild) load(); }, [activeChild]);

  // Total "score" = pairs found out of total pairs
  const totalPairs = cards.length / 2;
  const pairsFound = matched.length / 2;

  // Fewer moves = more XP (max 40, min 15)
  const xpEarned = Math.max(15, 40 - Math.max(0, moves - totalPairs) * 2);
  const coinsEarned = Math.floor(xpEarned / 5);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimeout(() => setDone(true), 600);
    }
  }, [matched]);

 useEffect(() => {
  if (done && !saved && user && activeChild) {
    (async () => {
      const result = await recordGameResult(
        user.uid,
        activeChild.childId,
        "memory-match",
        pairsFound,
        totalPairs,
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

  function handleFlip(idx) {
    if (flipped.length === 2) return;
    if (flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setMatched((m) => [...m, a, b]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  return (
    <GameShell
      emoji="🧠" title="Memory Match"
      score={pairsFound} total={totalPairs}
      round={0} totalRounds={0}
      loading={loading} error={error} onRetry={load}
      done={done} xpEarned={xpEarned} coinsEarned={coinsEarned}
      onPlayAgain={load}
      onExit={onExit}
    >
      {cards.length > 0 && !done && (
        <div>
          {theme && <p className={styles.themeLabel}>Theme: {theme} · Moves: {moves}</p>}
          <div className={styles.memoryGrid}>
            {cards.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(idx);
              return (
                <button
                  key={card.id}
                  className={`${styles.memoryCard} ${isFlipped ? styles.memoryFlipped : ""} ${matched.includes(idx) ? styles.memoryMatched : ""}`}
                  onClick={() => handleFlip(idx)}
                >
                  {isFlipped ? card.emoji : "❓"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </GameShell>
  );
}