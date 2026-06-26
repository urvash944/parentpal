import styles from "./ConfettiBurst.module.css";

const PIECES = ["🎉", "⭐", "🎊", "✨", "🏆", "🌟", "💫", "🎈"];

export default function ConfettiBurst() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.6}s`,
            animationDuration: `${1.8 + Math.random() * 1.2}s`,
            fontSize: `${16 + Math.random() * 14}px`,
          }}
        >
          {PIECES[i % PIECES.length]}
        </span>
      ))}
    </div>
  );
}