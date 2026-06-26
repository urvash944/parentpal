import { useState } from "react";
import { useChild } from "../../context/ChildContext";
import AnimalCountingGame from "./AnimalCountingGame";
import ShapeMatchGame     from "./ShapeMatchGame";
import WordBuilderGame    from "./WordBuilderGame";
import MemoryMatchGame    from "./MemoryMatchGame";
import ColorMatchGame     from "./ColorMatchGame";
import styles from "./Games.module.css";

const GAMES = [
  { id: "animal-counting", emoji: "🐶", label: "Animal Counting", sub: "Count the animals!",      color: "#FF6B6B", bg: "#FFF0F0" },
  { id: "shape-match",     emoji: "🔷", label: "Shape Match",     sub: "Match the shape!",        color: "#6C63FF", bg: "#EAE8FF" },
  { id: "word-builder",    emoji: "🔤", label: "Word Builder",    sub: "Fill the missing letter!", color: "#FF9F43", bg: "#FFF4E5" },
  { id: "memory-match",    emoji: "🧠", label: "Memory Match",    sub: "Find the pairs!",          color: "#6BCB77", bg: "#EBF9EE" },
  { id: "color-match",     emoji: "🎨", label: "Color Match",     sub: "Match the colors!",        color: "#4D96FF", bg: "#EBF4FF" },
];

export default function Games() {
  const { activeChild } = useChild();
  const [activeGame, setActiveGame] = useState(null);

  // This function resets back to hub
  function goToHub() {
    setActiveGame(null);
  }

  if (activeGame === "animal-counting") return <AnimalCountingGame onExit={goToHub} />;
  if (activeGame === "shape-match")     return <ShapeMatchGame     onExit={goToHub} />;
  if (activeGame === "word-builder")    return <WordBuilderGame    onExit={goToHub} />;
  if (activeGame === "memory-match")    return <MemoryMatchGame    onExit={goToHub} />;
  if (activeGame === "color-match")     return <ColorMatchGame     onExit={goToHub} />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎮 Games</h1>
      <p className={styles.sub}>Play & earn XP, coins, and badges!</p>

      {!activeChild ? (
        <div className={styles.noChild}>
          <span className={styles.noChildEmoji}>👶</span>
          <p>Add a child profile to play games.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {GAMES.map((g) => (
            <button
              key={g.id}
              className={styles.card}
              style={{ "--c": g.color, "--bg": g.bg }}
              onClick={() => setActiveGame(g.id)}
            >
              <span className={styles.cardEmoji}>{g.emoji}</span>
              <span className={styles.cardLabel}>{g.label}</span>
              <span className={styles.cardSub}>{g.sub}</span>
              <span className={styles.playBtn}>Play ▶</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}